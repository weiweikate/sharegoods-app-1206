import React from 'react';
import { Image, View } from 'react-native';
import BasePage from '../../../BasePage';
import Styles from '../style/Login.style';
import { createLoginButton, loginBtnType } from '../components/Login.button.view';
import res from '../res';
import RouterMap from '../../../navigation/RouterMap';
import { getWxUserInfo, oneClickLoginValidation, wxLoginAction } from '../model/LoginActionModel';
import { TrackApi } from '../../../utils/SensorsTrack';
import { startLoginAuth } from '../model/PhoneAuthenAction';
import { observer } from 'mobx-react';
import loginModel from '../model/LoginModel';

const {
    other: {
        tongyong_logo_nor
    }
} = res;

@observer
export default class Login extends BasePage {

    constructor(props) {
        super(props);
        TrackApi.loginPage();
        this.state = {
            isSelectProtocol: true,
            //如果从app内部h5过来登录的，可能存在此字段
            campaignType: this.params.campaignType ? this.params.campaignType : null,
            spm: this.params.spm ? this.params.spm : null
        };
    }

    // 导航配置
    static navigationOptions = {
        gesturesEnabled: false
    };

    $isMonitorNetworkStatus() {
        return false;
    }

    componentDidMount() {

    }

    _render() {
        return (
            <View style={Styles.bgContent}>
                {/*上部分视图*/}
                <View style={Styles.topBgContent}>
                    <View style={Styles.topImageBgView}>
                        <Image
                            style={Styles.topImageView}
                            source={tongyong_logo_nor}
                        />
                    </View>
                </View>
                {/*中部视图*/}
                {
                    <View style={Styles.middleBgContent}>
                        {
                            createLoginButton(loginBtnType.wxLoginBtnType, '微信授权登录', () => {
                                this._clickAction(loginBtnType.wxLoginBtnType);
                            }, true)
                        }
                    </View>

                }
                {/*下部分视图*/}
                <View style={Styles.bottomBgContent}>
                    {

                        loginModel.authPhone ? createLoginButton(loginBtnType.localPhoneNumLoginType, '一键登录', () => {
                            this._clickAction(loginBtnType.localPhoneNumLoginType);
                        }, false) : null
                    }
                    {
                        createLoginButton(loginBtnType.registerBtnType, '注册新账号', () => {
                            this._clickAction(loginBtnType.registerBtnType);
                            // this.$navigate(RouterMap.InputPhoneNum);
                        })
                    }
                    {
                        createLoginButton(loginBtnType.otherLoginBtnType, '其他登录方式', () => {
                            this._clickAction(loginBtnType.otherLoginBtnType);
                        })
                    }
                </View>
            </View>
        );
    }

    _clickAction = (btnType) => {
        if (!this.state.isSelectProtocol) {
            this.$toastShow('请先勾选用户协议');
            return;
        }
        if (btnType === loginBtnType.wxLoginBtnType) {
            this._wxLogin();
        } else if (btnType === loginBtnType.localPhoneNumLoginType) {
            startLoginAuth().then((data) => {
                let { navigation } = this.props;
                oneClickLoginValidation(loginModel.authPhone, data, navigation);
            }).catch((error) => {
                this.$toastShow('认证失败,请选择其他登录方式');
            });
        } else if (btnType === loginBtnType.registerBtnType) {
            TrackApi.LoginClick();
            this.$navigate(RouterMap.InputPhoneNum,
                {
                    campaignType: this.state.campaignType,
                    spm: this.state.spm

                });
        } else {
            this.$navigate(RouterMap.OtherLoginPage,
                {
                    campaignType: this.state.campaignType,
                    spm: this.state.spm
                });
        }
    };
    _wxLogin = () => {
        getWxUserInfo((wxData) => {
            this.$loadingShow('加载中');
            wxLoginAction(wxData, (code, data) => {
                this.$loadingDismiss();
                if (code === 10000) {
                    this.$navigateBack();
                    this.params.callback && this.params.callback();
                } else if (code === 34005) {
                    // 绑定手机号
                    this.$navigate(RouterMap.InputPhoneNum, data);
                }
            });
        });
    };
}
