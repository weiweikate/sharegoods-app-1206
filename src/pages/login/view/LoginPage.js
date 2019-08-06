import BasePage from '../../../BasePage';
import React from 'react';
import { Image, NativeAppEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';
import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginModel from '../model/LoginModel';
import ProtocolView from '../components/Login.protocol.view';
import RouterMap, { replaceRoute, routeNavigate } from '../../../navigation/RouterMap';
import LinearGradient from 'react-native-linear-gradient';
import { getWxUserInfo, oneClickLoginValidation, wxLoginAction } from '../model/LoginActionModel';
import { checkInitResult, closeAuth, startLoginAuth } from '../model/PhoneAuthenAction';
import store from '@mr/rn-store';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;
const btnWidth = ScreenUtils.width - px2dp(60);

@observer
export default class LoginPage extends BasePage {

    constructor(props) {
        super(props);
        if (!loginModel.authPhone) {
            checkInitResult().then((isVerifyEnable) => {
                loginModel.setAuthPhone(isVerifyEnable);
            }).catch(e => {
                loginModel.setAuthPhone(null);
            });
        }

        // 获取最近一次输入的手机号
        store.get('@mr/lastPhone').then((data) => {
            loginModel.phoneNumber = data;
        }).catch(e => {
        });
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10 },
        headerStyle: { borderBottomWidth: 0 }
    };

    componentDidMount() {
        // 登录页面type
        this.subscription = NativeAppEventEmitter.addListener(
            'Event_Login_Type',
            (data) => {
                if (data.login_type === '1') {
                    // 微信登录
                    this.wxLogin();
                } else if (data.login_type === '2') {
                    // 手机号登录
                    replaceRoute(RouterMap.PhoneLoginPage, { ...this.params, needBottom: true });
                }
            }
        );
    }

    componentWillUnmount() {
        this.subscription && this.subscription.remove();
    }

    justLogin = () => {
        // 一键登录
        if (loginModel.authPhone) {
            // 可以一键登录
            this.startOneLogin();
        } else {
            this.$loadingShow();
            checkInitResult().then((isVerifyEnable) => {
                this.$loadingDismiss();
                loginModel.setAuthPhone(isVerifyEnable);
                if (isVerifyEnable) {
                    this.startOneLogin();
                } else {
                    this.$toastShow('请开启数据网络后重试');
                }
            }).catch(e => {
                this.$loadingDismiss();
            });
        }
    };

    startOneLogin = () => {
        startLoginAuth().then((data) => {
            this.$loadingShow();
            let { navigation } = this.props;
            oneClickLoginValidation(data, null, navigation, () => {
                this.$loadingDismiss();
            }, () => {
                this.$loadingDismiss();
            });
        }).catch((error) => {
            if (error.code === '555') {
                closeAuth();
            } else {
                replaceRoute(RouterMap.PhoneLoginPage, { ...this.params, needBottom: true });
            }
        });
    };

    wxLogin = () => {
        if (!loginModel.isSelectProtocol) {
            this.$toastShow('请先勾选用户协议');
            return;
        }
        // 微信授权登录
        getWxUserInfo((wxData) => {
            this.$loadingShow('加载中');
            wxLoginAction(wxData, (code, data) => {
                this.$loadingDismiss();
                if (code === 10000) {
                    this.$navigateBack();
                    this.params.callback && this.params.callback();
                } else if (code === 34005) {
                    // 绑定手机
                    this.$toastShow('请绑定手机号');
                    routeNavigate(RouterMap.PhoneLoginPage, {
                        ...this.params,
                        needBottom: false,
                        wxData
                    });
                }
            });
        });
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={res.login_logo}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: px2dp(-50) }}>
                    <View style={Styles.loginButton}/>
                    <LinearGradient colors={['#FF1C89', '#FD0129']}
                                    style={[Styles.loginButton, { marginTop: px2dp(15) }]}>
                        <TouchableOpacity
                            style={Styles.touchableStyle}
                            onPress={() => {
                                this.wxLogin();
                            }}>
                            <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'微信登录'}/>
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={{ height: px2dp(35), justifyContent: 'center' }}>
                        <UIText style={{
                            fontSize: px2dp(12)
                        }}/>
                    </View>
                </View>
                <View>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ width: px2dp(102) }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            其他登录方式
                        </Text>
                        <CommSpaceLine style={{ width: px2dp(102) }}/>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: px2dp(30), marginTop: px2dp(20) }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            // 手机号登录
                            replaceRoute(RouterMap.PhoneLoginPage, { ...this.params, needBottom: true });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.login_phone}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_instruction
                            }} value={'手机号登录'}/>
                        </TouchableOpacity>
                        {loginModel.authPhone ?
                            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                                // 一键登录
                                this.justLogin();
                            }}>
                                <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                       source={res.login_one}/>
                                <UIText style={{
                                    fontSize: px2dp(13),
                                    height: px2dp(25),
                                    color: DesignRule.textColor_instruction
                                }} value={'一键登录'}/>
                            </TouchableOpacity> : null
                        }
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => {
                            replaceRoute(RouterMap.PwdLoginPage, { ...this.params });
                        }}>
                            <Image style={{ width: px2dp(48), height: px2dp(48), marginBottom: px2dp(13) }}
                                   source={res.login_pwd}/>
                            <UIText style={{
                                fontSize: px2dp(13),
                                height: px2dp(25),
                                color: DesignRule.textColor_instruction
                            }} value={'密码登录'}/>
                        </TouchableOpacity>
                    </View>
                    <ProtocolView
                        textClick={(htmlUrl) => {
                            this.$navigate(RouterMap.HtmlPage, {
                                title: '用户协议内容',
                                uri: htmlUrl
                            });
                        }}
                        selectImageClick={(isSelect) => {
                            loginModel.saveIsSelectProtocol(isSelect);
                        }}
                    />
                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center'
        },
        loginLogo: {
            width: px2dp(62),
            height: px2dp(45),
            marginTop: px2dp(48)
        },
        lineBgStyle: {
            width: ScreenUtils.width,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: px2dp(25)
        },
        otherLoginTextStyle: {
            color: DesignRule.textColor_secondTitle,
            marginHorizontal: px2dp(6),
            fontSize: px2dp(13)
        },
        touchableStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        loginButton: {
            height: px2dp(42),
            borderRadius: px2dp(22),
            width: btnWidth
        }
    }
);
