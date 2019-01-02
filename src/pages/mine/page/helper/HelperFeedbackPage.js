import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback, ScrollView, ImageBackground
} from "react-native";
import BasePage from "../../../../BasePage";
import UIText from "../../../../components/ui/UIText";
import UIImage from "../../../../components/ui/UIImage";
import NoMoreClick from "../../../../components/ui/NoMoreClick";
import ImageLoad from "@mr/image-placeholder";
import ScreenUtils from "../../../../utils/ScreenUtils";
import AutoExpandingInput from "../../../../components/ui/AutoExpandingInput";
import res from "../../res";
import BusinessUtils from "../../components/BusinessUtils";
import StringUtils from "../../../../utils/StringUtils";
import MineApi from "../../api/MineApi";
import Modal from '../../../../comm/components/CommModal';
import {MRText as Text} from '../../../../components/ui'
const {
    icon_arrow_up,
    icon_arrow_down,
    icon_dashframe,
    icon_delete,
    icon_red_select,
    icon_camara
} = res.helperAndCustomerService;

const rightIcon = res.button.tongyon_icon_check_green;
import DesignRule from "../../../../constants/DesignRule";
import NavigatorBar from "../../../../components/pageDecorator/NavigatorBar/NavigatorBar";

/**
 * @author chenxiang
 * @date on 2018/9/18
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */

export default class HelperFeedbackPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            textLength: 0,
            detailContent: '',
            showModal: false,
            isShowFinishModal: false,
            course: '请选择问题类型',
            CONFIG: [],//value, item.detailId
            selectIndex: -1,
            typeKey: -1,
            imageArr: [],
            touchable: false,
            picNum: 0
        };

    }

    $navigationBarOptions = {
        title: '问题反馈',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        MineApi.queryDictionaryTypeList({ code: 'WTLX' }).then(res => {
            if (res.code === 10000 && StringUtils.isNoEmpty(res.data)) {
                this.setState({
                    CONFIG: res.data
                });
            } else {
                this.$toastShow('服务器未返回类型数据');
            }
        }).catch(err => {
            console.log(err);
        });

    }

    //选择具体的反馈类型
    selCourse(course, id, i) {
        this.setState({
            showModal: false,
            course: course,
            selectIndex: i,
            typeKey: id
        });
    }

    //选择上传图片
    choosePicker = () => {
        let imageArr = this.state.imageArr;
        BusinessUtils.getImagePicker(callback => {
            imageArr.push({ imageUrl: callback.imageUrl, imageThumbUrl: callback.imageThumbUrl });
            this.setState({ imageArr: imageArr });
        });
    };

    feedback2server() {
        let smallImagarr = [];
        let orignImagarr = [];

        for (let i = 0; i < this.state.imageArr.length; i++) {
            smallImagarr.push(this.state.imageArr[i].imageThumbUrl);
            orignImagarr.push(this.state.imageArr[i].imageUrl);
        }
        let smallImgs = smallImagarr.join(',');
        let orignImgs = orignImagarr.join(',');
        if (this.state.typeKey === -1) {
            this.$toastShow('请选择反馈类型!');
            return;
        }
        if (this.state.detailContent && this.state.detailContent.length < 10) {
            this.$toastShow('反馈内容请大于10个字!');
            return;
        }
        this.setState({ touchable: true });
        MineApi.addFeedback({
            content: this.state.detailContent, typeKey: this.state.typeKey || 1, smallImg: smallImgs,
            originalImg: orignImgs
        }).then(res => {
            this.setState({ isShowFinishModal: true, touchable: false });
            this.finishModal && this.finishModal.open();
        }).catch(err => {
            this.setState({ touchable: false });
            this.$toastShow(err.msg);
        });
    }

    renderFinishModal() {
        return (
            <Modal
                animationType="fade"
                onRequestClose={() => {
                }}
                ref={(ref) => {
                    this.finishModal = ref;
                }}
                visible={this.state.isShowFinishModal}>
                <View style={{ flex: 1, width: ScreenUtils.width }}>
                    <View style={{
                        width: ScreenUtils.width / 5 * 3,
                        height: ScreenUtils.height / 3,
                        marginLeft: ScreenUtils.width / 5,
                        marginTop: ScreenUtils.height / 3,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <UIImage source={rightIcon} style={{ width: 70, height: 70 }}/>
                            <UIText value={'提交成功！'}
                                    style={{ fontSize: 15, color: DesignRule.textColor_mainTitle, marginTop: 10 }}/>
                            <UIText value={`您的反馈我们会认真查看`} style={{
                                fontSize: 11,
                                color: '#c6c6c6',
                                marginTop: 10
                            }}/>
                            <UIText value={`     并尽量修复及完善`} style={{
                                fontSize: 11,
                                color: '#c6c6c6',
                                marginTop: 3
                            }}/>
                            <UIText value={`感谢您的一如既往的支持`} style={{
                                fontSize: 11,
                                color: '#c6c6c6',
                                marginTop: 3
                            }}/>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.setState({ isShowFinishModal: false }), this.props.navigation.goBack();
                        }} style={{ width: '100%' }}>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: DesignRule.lineColor_inColorBg,
                                width: '100%',
                                height: 40
                            }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle
                                    }} allowFontScaling={false}>确定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    renderAddItem = () => {
        let isShowIcon = this.state.imageArr.length === 3;
        if (isShowIcon) {
            return null;
        } else {
            return <ImageBackground style={{
                width: 83,
                height: 83,
                borderColor: DesignRule.textColor_instruction,
                marginLeft: 16,
                justifyContent: 'center',
                alignItems: 'center'
            }} source={icon_dashframe}>
                <UIImage source={icon_camara} style={{ width: 27, height: 22 }}
                         resizeMode={'stretch'}
                         onPress={() => this.choosePicker()}/>
                <Text style={{
                    fontSize: 13,
                    color: DesignRule.textColor_hint,
                    marginTop: 4
                }} allowFontScaling={false}>{this.state.imageArr.length}/3</Text>

            </ImageBackground>;

        }

    };
    renderPhotoItem = (item, index) => {
        return (
            <View style={{ marginLeft: 8 }} key={index}>
                <ImageLoad style={styles.photo_item} source={{ uri: this.state.imageArr[index].imageUrl }}/>
                <TouchableOpacity style={styles.delete_btn} onPress={() => this.deletePic(index)}>
                    <UIImage style={{ width: 24, height: 24 }} source={icon_delete}/>
                </TouchableOpacity>

            </View>);
    };
    deletePic = (index) => {
        let imageArr = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            if (i != index) {
                imageArr.push(this.state.imageArr[i]);
            }
        }
        this.setState({ imageArr: imageArr });
    };

    renderModals() {
        return (
            <Modal
                visible={this.state.showModal}
                transparent={true}
                animationType='fade'
                onRequestClose={() => {
                }}
                style={{ flex: 1 }}
                ref="modal">
                <TouchableWithoutFeedback onPress={() => {
                    this.setState({ showModal: false });
                }}>
                    <View>
                        <NavigatorBar title={'问题反馈'} leftPressed={() => {
                            if (this.state.showModal) {
                                this.setState({ showModal: false });
                                return;
                            }
                            this.props.navigation.goBack();
                        }}/>
                        <View style={{ height: 15, backgroundColor: DesignRule.bgColor }}/>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.modalContainer}
                                  onPress={() => this.setState({ showModal: true })}>
                                <Text style={{
                                    marginLeft: 16,
                                    fontSize: 15,
                                    color: DesignRule.textColor_instruction
                                }} allowFontScaling={false}>请选择问题类型</Text>
                                <UIImage source={icon_arrow_up} style={{ width: 10, height: 7, marginRight: 16 }}/>
                            </View>
                            <View style={{ width: ScreenUtils.width, backgroundColor: 'white' }}>
                                {this.state.CONFIG.map((item, i) => {
                                    return (
                                        <TouchableOpacity key={i} style={{
                                            height: 48,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                                          activeOpacity={0.6}
                                                          onPress={() => this.selCourse(item.value, item.detailId, i)}>
                                            <Text style={{
                                                color: i === this.state.selectIndex ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                                fontSize: 15,
                                                marginLeft: 15
                                            }} allowFontScaling={false}>{item.value}</Text>
                                            {i === this.state.selectIndex ? <Image source={icon_red_select} style={{
                                                width: 17,
                                                height: 12,
                                                marginRight: 19
                                            }}/> : <View style={{ width: 17, height: 12, marginRight: 19 }}/>}
                                        </TouchableOpacity>
                                    );
                                })
                                }
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    showTypeSelect() {
        if (this.state.CONFIG.length > 0) {
            this.setState({ showModal: true });
        } else {
            this.$toastShow('无反馈类型');
        }

    }

    _render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                {this.renderModals()}
                {this.renderFinishModal()}
                <ScrollView>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        width: ScreenUtils.width,
                        height: 44,
                        backgroundColor: 'white',
                        marginTop: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }} onPress={() => this.showTypeSelect()}>
                        <Text style={{
                            marginLeft: 16,
                            fontSize: 15,
                            color: DesignRule.textColor_mainTitle
                        }} allowFontScaling={false}>{this.state.course}</Text>
                        <UIImage source={icon_arrow_down} style={{ width: 10, height: 7, marginRight: 16 }}/>
                    </TouchableOpacity>
                    <View style={styles.containerView1}>
                        <Text style={{
                            marginLeft: 16,
                            fontSize: 15,
                            color: DesignRule.textColor_mainTitle
                        }} allowFontScaling={false}>详细说明（必填）</Text>
                    </View>
                    <View style={{ height: 130, backgroundColor: 'white' }}>
                        <AutoExpandingInput
                            style={styles.detailAddress}
                            onChangeText={text => this.setState({ detailContent: text, textLength: text.length })}
                            placeholder={'请描述详细问题...'}
                            maxLength={90}
                            defaultValue={''}
                        />
                        <Text style={{
                            color: DesignRule.textColor_instruction,
                            position: 'absolute',
                            bottom: 10,
                            right: 16
                        }} allowFontScaling={false}>{this.state.textLength}/90</Text>
                    </View>
                    <View style={styles.containerView2}>
                        <Text style={{
                            marginLeft: 16,
                            fontSize: 15,
                            color: DesignRule.textColor_mainTitle
                        }} allowFontScaling={false}>上传图片（选填）</Text>
                    </View>
                    <View style={styles.containerView3}>
                        {this.state.imageArr.map((item, index) => {
                            return this.renderPhotoItem(item, index);
                        })}
                        {this.renderAddItem()}
                    </View>
                    <NoMoreClick activeOpacity={0.9} disabled={this.state.touchable}
                                 style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}
                                 onPress={() => this.feedback2server()}>
                        <View
                            style={[styles.buttoncolorStyle, { backgroundColor: this.state.course === '请选择问题类型' || this.state.detailContent.length < 10 ? DesignRule.lineColor_inGrayBg : DesignRule.mainColor }]}>
                            <Text style={{ fontSize: 16, color: '#fff' }} allowFontScaling={false}>提交</Text>
                        </View>
                    </NoMoreClick>

                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width,
        backgroundColor: '#F5FCFF'
    },
    text: {
        fontSize: 20,
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'

    },
    detailAddress: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        fontSize: 14,
        textAlignVertical: 'top'

    },
    headText: {
        fontSize: 22
    },
    headStyle: {
        flexDirection: 'row',
        width: ScreenUtils.width,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#F2F2F2',
        paddingTop: 70,
        paddingBottom: 15
    },
    delete_btn: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 60 - 1
    },
    photo_item: {
        height: 83,
        width: 83,
        borderRadius: 3
    },
    modalContainer: {
        flexDirection: 'row',
        width: ScreenUtils.width,
        height: 44,
        backgroundColor: DesignRule.lineColor_inColorBg,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttoncolorStyle: {
        width: 290,
        height: 48,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'

    },
    containerView1: {
        backgroundColor: 'white',
        width: ScreenUtils.width,
        marginTop: 14,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 0.5
    },
    containerView2: {
        backgroundColor: 'white',
        width: ScreenUtils.width,
        marginTop: 10,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    containerView3: {
        width: ScreenUtils.width,
        height: 101,
        backgroundColor: 'white',
        marginTop: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
