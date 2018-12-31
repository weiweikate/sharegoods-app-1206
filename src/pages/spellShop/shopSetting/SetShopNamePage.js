//设置我的店铺基础信息 或者 修改店铺信息
//gesturesEnabled 手势由外部控制
//navigation 会传递一个isChangeStoreInfo bool true表示为修改店铺信息
//isChangeStoreInfo true表示修改信息  false表示第一个创建

import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../model/SpellStatusModel';
import DesignRule from 'DesignRule';
import res from '../../../comm/res';
import openShopRes from '../res';
import {
    MRText as Text, MRTextInput as TextInput
} from '../../../components/ui';

const { px2dp } = ScreenUtils;
const arrow_right = res.button.arrow_right_black;
const { openShop_image_pre } = openShopRes.openShop;

export default class SetShopNamePage extends BasePage {

    $navigationBarOptions = {
        title: this.params.storeData ? '我的店铺' : '拼店信息设置',
        rightNavTitle: '完成',
        rightTitleStyle: styles.rightItem,
        rightNavItemHidden: !this.params.storeData
    };

    $NavBarLeftPressed = () => {
        if (this.params.storeData) {
            this.$navigateBack();
        } else {
            this.props.navigation.popToTop();
        }
    };

    $NavBarRightPressed = () => {
        this._complete();
    };

    constructor(props) {
        super(props);
        this.state = {
            storeHeadUrlOrigin: null,
            textName: '',
            textArea: '',
            textProfile: '',

            provinceCode: '',
            cityCode: '',
            areaCode: ''
        };
    }

    componentDidMount() {
        if (this.params.storeData) {
            this.$loadingShow();
            SpellShopApi.getById({ storeCode: this.params.storeData.storeCode }).then((data) => {
                let dataTemp = data.data || {};
                this.setState({
                    storeHeadUrlOrigin: dataTemp.headUrl,
                    textName: dataTemp.name,
                    textArea: `${dataTemp.province || ''}${dataTemp.city || ''}`,
                    textProfile: dataTemp.profile || '',

                    provinceCode: dataTemp.provinceCode,
                    cityCode: dataTemp.cityCode
                });
                this.$loadingDismiss();
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        }
    }

    _complete = () => {
        if (StringUtils.isEmpty(this.state.storeHeadUrlOrigin)) {
            this.$toastShow('店铺头像不能为空');
            return;
        }

        if (StringUtils.isEmpty(this.state.textName)) {
            this.$toastShow('请输入店铺名称');
            return;
        }
        if (this._checkIsHasSpecialStr(this.state.textName)) {
            this.$toastShow('店铺名称带有特殊字符，请重新输入');
            return;
        }
        if (this.state.textName.length < 4 || this.state.textName.length > 16) {
            this.$toastShow('店铺名称仅限4~16位字符');
            return;
        }

        if (StringUtils.isEmpty(this.state.provinceCode) || StringUtils.isEmpty(this.state.cityCode)) {
            this.$toastShow('请选择店铺位置');
            return;
        }

        if (this.params.storeData) {
            SpellShopApi.updateStoreInfo({
                name: this.state.textName,
                headUrl: this.state.storeHeadUrlOrigin,
                provinceCode: this.state.provinceCode,
                cityCode: this.state.cityCode,
                areaCode: this.state.areaCode,
                profile: this.state.textProfile
            }).then(() => {
                this.$toastShow('修改成功');
                this.params.myShopCallBack && this.params.myShopCallBack();
                this.$navigateBack();
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
        } else {
            // 创建店铺，并设置店铺基础信息
            SpellShopApi.initStore({
                name: this.state.textName,
                headUrl: this.state.storeHeadUrlOrigin,
                status: 3,
                provinceCode: this.state.provinceCode,
                cityCode: this.state.cityCode,
                areaCode: this.state.areaCode,
                profile: this.state.textProfile
            }).then(() => {
                spellStatusModel.getUser(2);
                this.$navigate('spellShop/openShop/OpenShopSuccessPage');
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
        }
    };

    /*检验特殊字符串*/
    _checkIsHasSpecialStr(str) {
        let myReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/;
        if (!myReg.test(str)) {
            return true;
        }
        return false;
    }

    //点击头像
    _clickHeader = () => {
        BusinessUtils.getImagePicker((response) => {
            if (response && typeof response === 'object' && response.ok) {
                const { imageUrl } = response;
                if (imageUrl) {
                    this.setState({
                        storeHeadUrlOrigin: imageUrl
                    });
                }
            } else {
                this.$toastShow(response.msg);
            }
        });
    };

    /*选择区域*/
    _getCityPicker = () => {
        this.$navigate('mine/address/SelectAreaPage', {
            setArea: this.setArea.bind(this),
            tag: 'province',
            fatherCode: '0'
        });
    };

    setArea(provinceCode, provinceName, cityCode, cityName, areaCode, areaName, areaText) {
        this.setState({
            textArea: areaText,
            provinceCode: provinceCode,
            cityCode: cityCode,
            areaCode: areaCode
        });
    }

    /*店铺简介输入*/
    _onChangeText = (text) => {
        if (text.length > 180) {
            text = text.substring(0, 180);
        }
        this.setState({ textProfile: text });
    };

    _renderHeaderView = () => {
        const uri = this.state.storeHeadUrlOrigin;
        if (this.params.storeData) {
            return <TouchableOpacity style={styles.updateWhite} onPress={this._clickHeader}>
                <Image source={uri ? { uri } : openShop_image_pre} style={styles.updateImg}/>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.updateText} allowFontScaling={false}>修改头像</Text>
                    <Image source={arrow_right} style={styles.arrowImg}/>
                </View>
            </TouchableOpacity>;
        } else {
            return <View style={styles.whitePanel}>
                <TouchableOpacity onPress={this._clickHeader}>
                    <Image source={uri ? { uri } : openShop_image_pre} style={styles.headerImg}/>
                </TouchableOpacity>
            </View>;
        }
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardDismissMode='on-drag'>
                    {/*头像*/}
                    {this._renderHeaderView()}
                    {/*店铺*/}
                    <View style={styles.textContainer}>
                        <Text style={styles.textTitle} allowFontScaling={false}>店铺名称</Text>
                        <TextInput value={this.state.textName}
                                   onChangeText={(text) => {
                                       this.setState({
                                           textName: text
                                       });
                                   }}
                                   placeholder={'请输入店铺名称'}
                                   blurOnSubmit={false}
                                   style={[styles.textInput, { marginRight: 32 }]}/>
                    </View>
                    <View style={styles.viewLine}/>
                    {/*区域*/}
                    <View style={styles.textContainer}>
                        <Text style={styles.textTitle} allowFontScaling={false}>拼店区域</Text>
                        <TextInput value={this.state.textArea}
                                   placeholder={'请选择店铺位置'}
                                   blurOnSubmit={false}
                                   style={styles.textInput}
                                   editable={false}/>
                        <Image source={arrow_right} style={styles.arrowImg}/>
                        <TouchableOpacity style={styles.bntArea}
                                          onPress={this._getCityPicker}/>
                    </View>
                    {/*简介*/}
                    <View style={styles.profileContainer}>
                        <Text style={styles.profileTittle} allowFontScaling={false}>店铺简介</Text>
                        <TextInput value={this.state.textProfile}
                                   onChangeText={this._onChangeText}
                                   multiline
                                   placeholder={'可以简单介绍下你拼店的目标方向'}
                                   blurOnSubmit={false}
                                   style={styles.profileText}/>
                        <Text style={styles.profileTextAbsolute} allowFontScaling={false}>{`${this.state.textProfile.length}/180`}</Text>
                    </View>

                </ScrollView>
                {/*开店*/}
                {
                    this.params.storeData ? null : <TouchableWithoutFeedback onPress={this._complete}>
                        <View style={styles.btnRow}>
                            <Text style={styles.btnTitle} allowFontScaling={false}>开店</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    arrowImg: {
        marginLeft: 10,
        marginRight: 15
    },
    /*右  完成*/
    rightItem: {
        fontSize: 15,
        color: DesignRule.mainColor
    },
    // 照片
    //更新
    updateWhite: {
        height: px2dp(60),
        marginBottom: px2dp(10),
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    updateImg: {
        width: px2dp(40),
        height: px2dp(40),
        borderRadius: px2dp(20),
        marginLeft: 15
    },
    updateText: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle
    },
    //开店
    whitePanel: {
        height: px2dp(150),
        marginBottom: px2dp(13),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImg: {
        width: px2dp(80),
        height: px2dp(80),
        borderRadius: px2dp(40)
    },
    //文本栏 名称 区域
    textContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: px2dp(40),
        alignItems: 'center'
    },
    textTitle: {
        fontSize: 13,
        paddingLeft: 15,
        paddingRight: 30,
        color: DesignRule.textColor_mainTitle
    },
    textInput: {
        textAlign: 'right',
        color: DesignRule.textColor_secondTitle,
        fontSize: 13,
        flex: 1
    },

    viewLine: {
        height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg
    },

    bntArea: {
        position: 'absolute', bottom: 0, right: 0, left: 0, top: 0
    },

    //店铺简介
    profileContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        height: px2dp(200)
    },
    profileTittle: {
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 10,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    profileText: {
        flex: 1,
        textAlignVertical: 'top',
        paddingHorizontal: 15,
        color: DesignRule.textColor_secondTitle
    },
    profileTextAbsolute: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: DesignRule.textColor_instruction
    },
    //开店按钮
    btnRow: {
        marginBottom: ScreenUtils.safeBottom,
        height: 50,
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontSize: 17,
        color: 'white'
    }
});
