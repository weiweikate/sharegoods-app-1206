/**
 验证码输入页面
 **/
import React, {} from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import BasePage from '../../../BasePage';
import Styles from '../style/InputPhoneNum.Style';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import StringUtils from '../../../utils/StringUtils';
import VerifyCode from '../components/VerifyCodeInput';
import RouterMap from '../../../navigation/RouterMap';
import { netStatusTool } from '../../../api/network/NetStatusTool';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import SMSTool from '../../../utils/SMSTool';
import { registAction } from '../model/LoginActionModel';
import { track, TrackApi } from '../../../utils/SensorsTrack';
import { mediatorCallFunc } from '../../../SGMediator';
// import CustomNumKeyBoard from '../../../comm/components/CustomNumKeyBoard'

const { px2dp } = ScreenUtils;

export default class InputCode extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            downTime: 60,
            verifyCode: ''
            // showKeyBoard: true
        };
        TrackApi.verifySMSPage();
    }

    $navigationBarOptions = {
        title: '输入手机号',
        show: true
    };

    componentDidMount() {
        (new TimeDownUtils()).startDown((time) => {
            this.setState({
                downTime: time
            });
        });
    }

    _render() {
        const { phoneNum } = this.params;
        return (
            <View style={Styles.bgContent}>
                <View style={Styles.contentStyle}>
                    <Text style={Styles.topTitleStyle}>
                        请输入短信验证码
                    </Text>
                    <Text style={Styles.topTipTitleStyle}>
                        我们已发送短信验证码到你的手机
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        {StringUtils.encryptPhone(phoneNum)}
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                        <VerifyCode
                            onChangeText={(text) => {
                                this._finshInputCode(text);
                            }}
                            verifyCodeLength={4}
                        />

                        <View style={{ marginTop: px2dp(10), flexDirection: 'row' }}>
                            {this.state.downTime > 0 ?
                                <Text style={Styles.authHaveSendCodeBtnStyle}>
                                    {this.state.downTime}s后可点击
                                </Text> :
                                null
                            }
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                    paddingTop: px2dp(0),
                                    marginLeft: px2dp(5),
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this._reSendClickAction();
                                }}
                            >
                                <Text
                                    style={this.state.downTime > 0 ?
                                        [Styles.authHaveSendCodeBtnStyle, { textDecorationLine: 'underline' }]
                                        : [Styles.authReSendCodeStyle]}
                                >
                                    重新发送
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * 重新发送验证码
     * @private
     */
    _reSendClickAction = () => {

        track('GetVerifySMS', { 'pagePosition': 2 });
        const { phoneNum } = this.params;
        const { downTime } = this.state;
        if (downTime > 0) {
            return;
        }
        if (!netStatusTool.isConnected) {
            bridge.$toast('请检查网络是否连接');
            return;
        }
        bridge.$toast('验证码发送，请稍后...');
        (new TimeDownUtils()).startDown((time) => {
            this.setState({
                downTime: time
            });
        });
        SMSTool.sendVerificationCode(1, phoneNum)
            .then((resp) => {
                bridge.$toast('验证码发送成功,请注意查收');
            })
            .catch(error => {
                this.$toastShow(error.msg);
            });
    };

    _finshInputCode = (text) => {
        if (text.length === 4) {
            const { phoneNum, nickName, headerImg } = this.params;
            let params = {
                ...this.params,
                code: text,
                phone: phoneNum,
                nickname: nickName,
                headImg: headerImg
            };
            registAction(params, (res) => {
                if (res.code === 10000) {
                    // user.untiedWechat(nickName,this.params.appOpenid,this.params.unionid)
                    this.$navigate(RouterMap.InviteCodePage);
                    TrackApi.phoneSignUpSuccess({ 'signUpPhone': phoneNum });
                    mediatorCallFunc('Home_RequestNoviceGift')
                } else {
                    this.$toastShow(res.msg);
                }
            });
        }
    };

}
