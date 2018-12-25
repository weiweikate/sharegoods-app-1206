import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import LoginAPI from '../api/LoginApi';
// import StringUtils from '../../../utils/StringUtils';
import DesignRule from 'DesignRule';
import res from '../res';
import { MRText as Text, MRTextInput as TextInput } from '../../../components/ui';

const {
    close_eye,
    open_eye,
    other: {
        tongyong_logo_nor
    }
} = res;

class OldUserLoginModel {
    @observable
    phoneNumber = '';
    @observable
    password = '';
    @observable
    isSecuret = true;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            this.phoneNumber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = '';
            return;
        }
        this.password = password;
    }

    @computed
    get isCanClick() {
        if ((this.phoneNumber.length > 3) && (this.password.length >= 1)) {
            return true;
        } else {
            return false;
        }
    }
}

@observer
export default class OldUserLoginPage extends BasePage {
    oldUserLoginModel = new OldUserLoginModel();

    constructor(props) {
        super(props);
    }

    // 导航配置
    $navigationBarOptions = {
        title: '老用户激活'
    };
    /*render右上角*/
    // $NavBarRenderRightItem = () => {
    //     return (
    //         <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
    //             注册
    //         </Text>
    //     );
    // };
    /*注册事件*/
    registBtnClick = () => {
        this.$navigate('login/login/RegistPage');

    };

    $isMonitorNetworkStatus() {
        return false;
    }

    _render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                <View style={{ backgroundColor: DesignRule.bgColor }}>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 79, height: 79 }} source={tongyong_logo_nor}/>
                    </View>

                    <View style={{ marginLeft: 20, marginRight: 30, marginTop: 60 }}>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.oldUserLoginModel.phoneNumber}
                            onChangeText={text => {
                                this.oldUserLoginModel.savePhoneNumber(text);
                            }}
                            placeholder='请输入用户名'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />
                        <CommSpaceLine style={Styles.lineStyle}/>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 30, marginTop: 40 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput
                                style={Styles.inputTextStyle}
                                value={this.oldUserLoginModel.password}
                                onChangeText={text => {
                                    this.oldUserLoginModel.savePassword(text);
                                }}
                                placeholder='请输入密码'
                                underlineColorAndroid={'transparent'}
                                keyboardType='default'
                                secureTextEntry={this.oldUserLoginModel.isSecuret}
                            />
                            <TouchableOpacity onPress={() => {
                                this.oldUserLoginModel.isSecuret = !this.oldUserLoginModel.isSecuret;
                            }}>
                                <Image style={Styles.seePasswordImageStyle}
                                       source={this.oldUserLoginModel.isSecuret ? close_eye : open_eye}/>
                            </TouchableOpacity>
                        </View>
                        <CommSpaceLine style={Styles.lineStyle}/>
                    </View>
                    <View
                        style={[Styles.oldUserLoginBtnStyle, this.oldUserLoginModel.isCanClick ? { backgroundColor: DesignRule.mainColor } : { backgroundColor: DesignRule.bgColor_grayHeader }]}>
                        <TouchableOpacity onPress={this.loginClick}>
                            <Text style={{
                                textAlign: 'center',
                                alignItems: 'center',
                                color: '#fff',
                                fontSize: 17,
                                paddingTop: 15

                            }}>
                                下一步
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={
                            [Styles.bottomTimeStyle,
                                {marginTop:40}
                            ]
                        }
                    >
                        朵女郎激活时间: 2018.12.30-2019.1.10
                    </Text>
                    <Text
                        style={
                            Styles.bottomTimeStyle
                        }
                    >
                        激活后可免费领取1688元礼包及其他朵粉专享福利
                    </Text>
                    <Text
                        style={
                            Styles.bottomTimeStyle
                        }
                    >
                        逾期激活将取消朵粉所有专享福利
                    </Text>
                    <Text
                        style={
                            Styles.bottomTimeStyle
                        }
                    >
                        且后期只能以新用户注册
                    </Text>
                </View>
                {/*<Image*/}
                {/*style={{*/}
                {/*width: ScreenUtils.width,*/}
                {/*position: 'absolute',*/}
                {/*bottom: 0,*/}
                {/*height: 80*/}
                {/*}}*/}
                {/*source={loginAndRegistRes.loginBottomImage}*/}
                {/*resizeMode='cover'/>*/}
                <Text
                    style={
                        Styles.bottomKeFuTextStyle
                    }>
                    客服电话:400-969-6365
                </Text>
            </View>
        );
    }

    /*d点击登录*/
    loginClick = () => {
        if (this.oldUserLoginModel.isCanClick) {
            this.$loadingShow();
            LoginAPI.existedUserVerify(
                {
                    authcode: '',
                    code: '',
                    device: '',
                    headImg: '',
                    nickname: '',
                    openid: '',
                    password: this.oldUserLoginModel.password,
                    phone: '',
                    systemVersion: '',
                    username: this.oldUserLoginModel.phoneNumber,
                    wechatCode: '',
                    wechatVersion: ''
                }).then((data) => {
                console.warn(data);
                this.$loadingDismiss();
                if (data.code === 10000) {
                    //存在老用户返回的code
                    this.$navigate('login/login/SetPasswordPage', {
                        code: data.data.code,
                        phone: this.oldUserLoginModel.phoneNumber
                    });
                } else {
                    this.$toast(data.msg);
                }
            }).catch((data) => {
                this.$loadingDismiss();
                this.$toastShow(data.msg);
            });
        }
        // this.$navigate("login/login/SetPasswordPage");
    };

}
const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: '#fff'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
        },
        otherLoginBgStyle: {
            marginBottom: -20,
            height: 200

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        oldUserLoginBtnStyle: {
            marginLeft: 30,
            width: ScreenUtils.width - 60,
            marginTop: 40,
            height: 50,
            borderRadius: 25
        },
        lineStyle: {
            marginTop: 3,
            marginLeft: 10
        },
        inputTextStyle: {
            marginLeft: 20,
            width: 120,
            fontSize: 14,
            fontWeight: '400'
        },
        bottomTimeStyle: {
            marginTop: 10,
            height: 20,
            width: ScreenUtils.width - 40,
            textAlign: 'center',
            fontSize: 12,
            color: DesignRule.textColor_secondTitle,
            marginLeft:20
        },
        bottomKeFuTextStyle: {
            width: ScreenUtils.width,
            position: 'absolute',
            bottom: 50,
            fontSize: 12,
            color: DesignRule.textColor_secondTitle,
            textAlign: 'center'
        }
    }
);

