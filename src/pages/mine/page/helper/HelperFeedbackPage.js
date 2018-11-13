import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback, ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import UIImage from '../../../../components/ui/UIImage';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import AutoExpandingInput from '../../../../components/ui/AutoExpandingInput';
import arrowUp from '../../res/customerservice/icon_06-03.png';
import arrowDown from '../../res/customerservice/icon_06.png';
import res from '../../../../comm/res';
import addPic from '../../res/customerservice/xk1_03.png';
import deleteImage from '../../res/customerservice/deleteImage.png';
import BusinessUtils from '../../components/BusinessUtils';
import StringUtils from '../../../../utils/StringUtils';
import MineApi from '../../api/MineApi';
import Modal from 'CommModal';
const rightIcon = res.button.tongyon_icon_check_green;
import DesignRule from 'DesignRule';
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
            imageArr: [],
            touchable:false
        };

    }

    $navigationBarOptions = {
        title: '问题反馈',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        MineApi.queryDictionaryTypeList({ code: 'WTLX' }).then(res => {
            if (res.code == 10000 && StringUtils.isNoEmpty(res.data)) {
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
    selCourse(course, i) {
        this.setState({
            showModal: false,
            course: course,
            selectIndex: i
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
        let smallImgs = smallImagarr.join(';');
        let orignImgs = orignImagarr.join(';');
        // if (this.state.selectIndex == -1 || this.state.detailContent == '' || orignImgs.length < 20) {
        //     ToastAndroid.show('请完善反馈资料!', ToastAndroid.SHORT);
        //     return;
        // }
        if (this.state.selectIndex == -1) {
            this.$toastShow('请选择反馈类型!');
            return;
        }
        if (this.state.detailContent && this.state.detailContent.length < 10) {
            this.$toastShow('反馈内容请大于10个字!');
            return;
        }
        this.setState({touchable:true});
        MineApi.addFeedback({
            content: this.state.detailContent, typeKey: this.state.selectIndex || 1, smallImg: smallImgs,
            originalImg: orignImgs
        }).then(res => {
                this.setState({ isShowFinishModal: true ,touchable:false});
                this.finishModal && this.finishModal.open();
        }).catch(err => {
            this.setState({touchable:false});
            this.$toastShow(err.msg);
        });
    }

    renderFinishModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={() => {
                }}
                ref={(ref)=>{
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
                            <UIText value={'提交成功！'} style={{ fontSize: 15, color: DesignRule.textColor_mainTitle, marginTop: 10 }}/>
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
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: DesignRule.lineColor_inColorBg,
                            width: '100%',
                            height: 40
                        }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({ isShowFinishModal: false }), this.props.navigation.goBack();
                            }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle
                                    }}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    renderAddItem = () => {
        let isShowIcon = this.state.imageArr.length == 3;
        if (isShowIcon) {
            return null;
        } else {
            return <UIImage source={addPic} style={{ width: 83, height: 83, marginLeft: 15, borderRadius: 5 }}
                            resizeMode={'stretch'}
                            onPress={() => this.choosePicker()}/>;
        }

    };
    renderPhotoItem = (item, index) => {
        return (
            <View style={{ marginRight: 8, marginBottom: 12 }} key={index}>
                <Image style={styles.photo_item} source={{ uri: this.state.imageArr[index].imageUrl }}/>
                <TouchableOpacity style={styles.delete_btn} onPress={() => this.deletePic(index)}>
                    <Image style={{ width: 24, height: 24 }} source={deleteImage}/>
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
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <TouchableOpacity style={styles.modalContainer}
                                          onPress={() => this.setState({ showModal: true })}>
                            <Text style={{ marginLeft: 10, fontSize: 15, color: DesignRule.textColor_instruction }}>请选择问题类型</Text>
                            <Image source={arrowUp} style={{ width: 15, height: 15, marginRight: 10 }}/>
                        </TouchableOpacity>
                        <View style={{ width: ScreenUtils.width, backgroundColor: 'white' }}>
                            {this.state.CONFIG.map((item, i) => {
                                return (
                                    <TouchableOpacity key={i} style={{ height: 48, justifyContent: 'center' }}
                                                      activeOpacity={0.6}
                                                      onPress={() => this.selCourse(item.value, i)}>
                                        <Text style={{
                                            color: i == this.state.selectIndex ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                            fontSize: 15,
                                            marginLeft: 15
                                        }}>{item.value}</Text>
                                    </TouchableOpacity>
                                );
                            })
                            }
                        </View>
                    </View>

                </TouchableWithoutFeedback>
            </Modal>
        );
    }
    showTypeSelect(){
        if(this.state.CONFIG.length>0){
            this.setState({ showModal: true })
        }else{
            this.$toastShow('无反馈类型1');
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
                        marginTop: 5,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }} onPress={() => this.showTypeSelect()}>
                        <Text style={{ marginLeft: 10, fontSize: 15, color: DesignRule.textColor_mainTitle }}>{this.state.course}</Text>
                        <Image source={arrowDown} style={{ width: 15, height: 15, marginRight: 10 }}/>
                    </TouchableOpacity>
                    <View style={styles.containerView1}>
                        <Text style={{ marginLeft: 10, fontSize: 15, color: DesignRule.textColor_mainTitle }}>详细说明</Text>
                    </View>
                    <View style={{ height: 130, backgroundColor: 'white' }}>
                        <AutoExpandingInput
                            style={styles.detailAddress}
                            onChangeText={text => this.setState({ detailContent: text, textLength: text.length })}
                            placeholder={'请描述详细问题...'}
                            maxLength={90}
                            defaultValue={''}
                            underlineColorAndroid={'transparent'}
                        />
                        <Text style={{ position: 'absolute', bottom: 10, right: 10 }}>{this.state.textLength}/90</Text>
                    </View>
                    <View style={styles.containerView2}>
                        <Text style={{ marginLeft: 10, fontSize: 15, color: DesignRule.textColor_mainTitle }}>上传图片</Text>
                    </View>
                    <View style={styles.containerView3}>
                        {this.state.imageArr.map((item, index) => {
                            return this.renderPhotoItem(item, index);
                        })}
                        {this.renderAddItem()}
                    </View>

                    <View style={{ width: ScreenUtils.width, height: 180, alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={0.9}  disabled={this.state.touchable}
                                          style={[styles.buttoncolorStyle, { backgroundColor: this.state.course == '请选择问题类型' || this.state.detailContent.length < 10 ? DesignRule.lineColor_inGrayBg : color.red }]

                                          } onPress={() => this.feedback2server()}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>提交</Text>
                        </TouchableOpacity>
                    </View>
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
        fontSize: 14

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
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 44+5+ScreenUtils.statusBarHeight,
    },
    buttoncolorStyle: {
        width: 290,
        height: 48,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    containerView1: {
        backgroundColor: 'white',
        width: ScreenUtils.width,
        marginTop: 5,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    containerView2: {
        backgroundColor: 'white',
        width: ScreenUtils.width,
        marginTop: 5,
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
