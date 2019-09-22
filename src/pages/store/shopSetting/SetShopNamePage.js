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
import LinearGradient from 'react-native-linear-gradient';

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
        return <View style={styles.whitePanel}>
            <TouchableOpacity onPress={this._clickHeader}>
                <AvatarImage style={styles.headerImg} source={{ uri: uri }}/>
            </TouchableOpacity>
        </View>;
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardDismissMode='on-drag'>
                    {/*头像*/}
                    {this._renderHeaderView()}
                    {/*店铺*/}
                    <Text style={styles.textTitle}>请填写店铺名称</Text>
                    <View style={styles.textContainer}>
                        <TextInput value={this.state.textName}
                                   onChangeText={(text) => {
                                       this.setState({
                                           textName: text
                                       });
                                   }}
                                   placeholder={'请输入4-16位汉字/字母作为拼店店名'}
                                   blurOnSubmit={false}
                                   style={[styles.textInput, { marginRight: 32 }]}/>
                    </View>
                    {/*区域*/}
                    <Text style={styles.textTitle}>您的拼店所在区域</Text>
                    <View style={styles.textContainer}>
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
                    <Text style={styles.textTitle}>简单介绍下您的拼店店铺</Text>
                    <View style={styles.profileContainer}>
                        <TextInput value={this.state.textProfile}
                                   onChangeText={this._onChangeText}
                                   multiline
                                   placeholder={'可以简单介绍下你拼店的目标方向'}
                                   blurOnSubmit={false}
                                   style={styles.profileText}/>
                        <Text style={styles.profileTextAbsolute}>{`${this.state.textProfile.length}/180`}</Text>
                    </View>

                </ScrollView>
                {/*开店*/}
                {
                    this.params.storeData ? null : <NoMoreClick style={styles.btnRow} onPress={this._complete}>
                        <LinearGradient style={styles.btn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']} onPress={this._complete}>
                            <Text style={styles.btnTitle}>开店</Text>
                        </LinearGradient>
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
    //开店
    whitePanel: {
        height: px2dp(123),
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImg: {
        width: px2dp(76), height: px2dp(76), borderRadius: px2dp(38), overflow: 'hidden'
    },
    //文本栏 名称 区域
    textTitle: {
        fontSize: 13, paddingLeft: 15, color: DesignRule.textColor_secondTitle, paddingBottom: 10
    },
    textContainer: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 15, marginBottom: 20,
        backgroundColor: 'white', height: px2dp(44), borderRadius: 10
    },
    textInput: {
        color: DesignRule.textColor_mainTitle, fontSize: 13, paddingLeft: 15, flex: 1
    },
    bntArea: {
        position: 'absolute', bottom: 0, right: 0, left: 0, top: 0
    },

    //店铺简介
    profileContainer: {
        backgroundColor: 'white', height: px2dp(120), borderRadius: 10, marginHorizontal: 15
    },
    profileText: {
        flex: 1, textAlignVertical: 'top', paddingHorizontal: 15, color: DesignRule.textColor_mainTitle
    },
    profileTextAbsolute: {
        position: 'absolute', bottom: 10, right: 10, color: DesignRule.textColor_instruction
    },
    //开店按钮
    btnRow: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom, height: 49, backgroundColor: 'white'
    },
    btn: {
        width: px2dp(345), height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center'
    },
    btnTitle: {
        fontSize: 16, color: 'white'
    }

});
