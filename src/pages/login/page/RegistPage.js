import React from 'react';
import {
    View,
    TouchableOpacity,
    Image, DeviceEventEmitter
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import CommRegistView from '../components/CommRegistView';
import ScreenUtils from '../../../utils/ScreenUtils';
import LoginApi from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import UserModel from '../../../model/user';
import DeviceInfo from 'react-native-device-info';
import DesignRule from '../../../constants/DesignRule';
import { homeModule } from '../../home/model/Modules';
import res from '../res';
import JPushUtils from '../../../utils/JPushUtils';
import { login, track, TrackApi, trackEvent } from '../../../utils/SensorsTrack';
import { MRText as Text } from '../../../components/ui';
import apiEnvironment from '../../../api/ApiEnvironment';

const {
    red_button_s,
    red_button_u
} = res;

/**
 * @author huyufeng
 * @date on 2018/9/7
 * @describe 注册页
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
@observer
export default class RegistPage extends BasePage {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.$navigationBarOptions.title = this.params.title || '注册';
        this.state = {
            gouxuan: true
        };
        TrackApi.registerPage();
    }

    $isMonitorNetworkStatus() {
        return false;
    }

    _render() {
        const htmlUrl = apiEnvironment.getCurrentH5Url() + '/static/protocol/service.html';
        return (
            <View style={{
                flex: 1,
                justifyContent: 'space-between'
            }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={0}
                    phone={''}
                    loginClick={(phone, code, password) => {
                        this.$loadingShow();
                        setTimeout(()=>{this.clickNext(phone, code, password)},200)
                    }}
                    ref={'topView'}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 80,
                    width: ScreenUtils.width
                }}>
                    <TouchableOpacity onPress={() => {
                        this.refs.topView.changeSelectState();
                        this.setState({
                            gouxuan: !this.state.gouxuan
                        });
                    }}>
                        <Image
                            source={this.state.gouxuan ? red_button_s : red_button_u}
                            style={{ width: 11, height: 11, marginRight: 5 }}/>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: DesignRule.textColor_secondTitle }}>
                        阅读并接受
                    </Text>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('HtmlPage', {
                            title: '用户协议内容',
                            uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
                        });
                    }}>
                        <Text style={{ color: DesignRule.mainColor, fontSize: 11 }}
                              onPress={() => {
                                  this.$navigate('HtmlPage', {
                                      title: '用户协议内容',
                                      uri: htmlUrl
                                  });
                              }}
                        >
                            《用户协议》
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        if (!this.state.gouxuan) {
            this.$loadingDismiss();
            bridge.$toast('请先勾选用户协议');
            return;
        }
        console.log(this.params);
        this.params = this.params || {};
        track(trackEvent.signUp, { signUpMethod: 'App注册' });
        LoginApi.findMemberByPhone({
            ...this.params,
            code: code,
            device: (this.params && this.params.device) ? this.params.device : '',
            inviteId: '',//邀请id
            appOpenid: (this.params && this.params.appOpenid) ? this.params.appOpenid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '',
            wechatVersion: '',
            nickname: this.params.nickName,
            headImg: this.params.headerImg ? this.params.headerImg : '',
        }).then((data) => {
            if (data.code === 10000) {
                //推送
                JPushUtils.updatePushTags();
                JPushUtils.updatePushAlias();
                this.toLogin(phone, code, password, data.give);
            } else {
                bridge.$toast(data.msg);
            }
            this.$loadingDismiss();
            // bridge.$toast(data.msg);
        }).catch((response) => {
            this.$loadingDismiss();
            bridge.$toast(response.msg);
        });

    };
    toLogin = (phone, code, password, isGive) => {
        LoginApi.passwordLogin({
            authcode: '22',
            code: '',
            device: '44',
            password: password,
            phone: phone,
            systemVersion: DeviceInfo.getSystemVersion(),
            username: '',
            wechatCode: '',
            wechatVersion: ''
        }).then((data) => {
            this.$loadingDismiss();
            UserModel.saveUserInfo(data.data);
            UserModel.saveToken(data.data.token);
            DeviceEventEmitter.emit('homePage_message', null);
            DeviceEventEmitter.emit('contentViewed', null);
            homeModule.loadHomeList();
            //埋点登录成功
            login(data.data.code);
            // this.$navigate('login/login/GetRedpacketPage');
            bridge.setCookies(data.data);
            //推送
            JPushUtils.updatePushTags();
            JPushUtils.updatePushAlias();
            /**
             * 跳转导师选择页面
             */
            this.$navigate('login/login/SelectMentorPage', { isHaveRedPocket: isGive });
        }).catch((data) => {
            this.$loadingDismiss();
            bridge.$toast(data.msg);
        });
    };
}

