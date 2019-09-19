//设置我的店铺基础信息 或者 修改店铺信息
//gesturesEnabled 手势由外部控制
//navigation 会传递一个isChangeStoreInfo bool true表示为修改店铺信息
//isChangeStoreInfo true表示修改信息  false表示第一个创建

import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import BasePage from '../../../BasePage';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../../../comm/res';
import { MRText as Text, MRTextInput as TextInput } from '../../../components/ui';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import AvatarImage from '../../../components/ui/AvatarImage';
import RouterMap from '../../../navigation/RouterMap';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;
const arrow_right = res.button.arrow_right_black;

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
        const { storeData } = this.params;
        if (storeData) {
            const { storeCode } = storeData;
            this.$loadingShow();
            SpellShopApi.app_store({ pathValue: `/${storeCode}` }).then((data) => {
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
        const { storeHeadUrlOrigin, textName, provinceCode, cityCode } = this.state;
        if (StringUtils.isEmpty(storeHeadUrlOrigin)) {
            this.$toastShow('店铺头像不能为空');
            return;
        }

        if (StringUtils.isEmpty(textName)) {
            this.$toastShow('请输入店铺名称');
            return;
        }
        if (this._checkIsHasSpecialStr(textName)) {
            this.$toastShow('店铺名称带有特殊字符，请重新输入');
            return;
        }
        if (textName.length < 4 || textName.length > 16) {
            this.$toastShow('店铺名称仅限4~16位字符');
            return;
        }

        if (StringUtils.isEmpty(provinceCode) || StringUtils.isEmpty(cityCode)) {
            this.$toastShow('请选择店铺位置');
            return;
        }
        const { storeData, isSplit } = this.params;
        bridge.showLoading();
        if (storeData) {
            SpellShopApi.app_store_update({
                pathValue: `/${storeData.storeCode}`,
                name: textName,
                headUrl: storeHeadUrlOrigin,
                provinceCode: provinceCode,
                cityCode: cityCode,
                profile: this.state.textProfile
            }).then(() => {
                bridge.hiddenLoading();
                this.$toastShow('修改成功');
                this.params.myShopCallBack && this.params.myShopCallBack();
                this.$navigateBack();
            }).catch((error) => {
                bridge.hiddenLoading();
                this.$toastShow(error.msg);
            });
        } else if (isSplit) {
            SpellShopApi.app_store_split({
                name: textName,
                headUrl: storeHeadUrlOrigin,
                provinceCode: provinceCode,
                cityCode: cityCode,
                profile: this.state.textProfile
            }).then(() => {
                bridge.hiddenLoading();
                this.$navigate(RouterMap.OpenShopSuccessPage);
            }).catch((error) => {
                bridge.hiddenLoading();
                this.$toastShow(error.msg);
            });
        } else {
            SpellShopApi.app_store_open({
                name: textName,
                headUrl: storeHeadUrlOrigin,
                provinceCode: provinceCode,
                cityCode: cityCode,
                profile: this.state.textProfile
            }).then(() => {
                bridge.hiddenLoading();
                this.$navigate(RouterMap.OpenShopSuccessPage);
            }).catch((error) => {
                bridge.hiddenLoading();
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
            const { imageUrl } = response;
            if (imageUrl) {
                this.setState({
                    storeHeadUrlOrigin: imageUrl[0] || ''
                });
            }
        }, 1, true);
    };

    /*选择区域*/
    _getCityPicker = () => {
        this.$navigate(RouterMap.AddressSelectPage, {
            callBack: this.setArea.bind(this),
            tittle: '选择区域'
        });
    };

    setArea(provinceName, provinceCode, cityName, cityCode) {
        this.setState({
            textArea: `${provinceName}${cityName}`,
            provinceCode: provinceCode,
            cityCode: cityCode
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
                <AvatarImage style={styles.updateImg} source={{ uri: uri }} borderRadius={px2dp(20)}/>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.updateText} allowFontScaling={false}>修改头像</Text>
                    <Image resizeMode={'contain'} source={arrow_right} style={styles.arrowImg}/>
                </View>
            </TouchableOpacity>;
        } else {
            return <View style={styles.whitePanel}>
                <TouchableOpacity onPress={this._clickHeader}>
                    <AvatarImage style={styles.headerImg} source={{ uri: uri }} borderRadius={px2dp(40)}/>
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
                        <Image resizeMode={'contain'} source={arrow_right} style={styles.arrowImg}/>
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
                        <Text style={styles.profileTextAbsolute}
                              allowFontScaling={false}>{`${this.state.textProfile.length}/180`}</Text>
                    </View>

                </ScrollView>
                {/*开店*/}
                {
                    this.params.storeData ? null : <NoMoreClick onPress={this._complete}>
                        <View style={styles.btnRow}>
                            <Text style={styles.btnTitle} allowFontScaling={false}>开店</Text>
                        </View>
                    </NoMoreClick>
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
        marginRight: 15,
        height: 10
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
