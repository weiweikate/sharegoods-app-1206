import React from 'react';
import {
    View,
    DeviceEventEmitter
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommRegistView from '../components/CommRegistView';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import { homeRegisterFirstManager } from '../../home/manager/HomeRegisterFirstManager';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import UserModel from '../../../model/user';
import { homeModule } from '../../home/model/Modules';
import JPushUtils from '../../../utils/JPushUtils';
import { login } from '../../../utils/SensorsTrack';


@observer
export default class SetPasswordPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '设置账号及密码'
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    viewType={2}
                    loginClick={(phone, code, password) => this.clickNext(phone, code, password)}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 11,
                    width: ScreenUtils.width
                }}/>
            </View>


        );
    }

    $isMonitorNetworkStatus() {
        return false;
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        console.warn(this.params);
        this.$loadingShow();
        LoginAPI.existedUserLogin({
            authcode: this.params.code ? this.params.code : '',
            code: code,
            device: this.params.device ? this.params.device : 'eeeeee',
            headImg: '',
            nickname: '',
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: DeviceInfo.getSystemVersion(),
            username: '',
            wechatCode: '',
            wechatVersion: ''
        }).then(data => {
            this.$loadingDismiss();
            if (data.give) {
                homeRegisterFirstManager.setShowRegisterModalUrl(data.give);
            }
            this.toLogin(phone, code, password, data.give);
        }).catch(data => {
            this.$loadingDismiss();
            let msg = data.msg;
            if (data.code === 34007) {
                msg = '该手机号已经注册,请更换新的手机号';
            }
            bridge.$toast(msg);
        });
    };

    toLogin = (phone, code, password, isGive) => {
        LoginAPI.passwordLogin({
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
            this.$toastShow('激活成功');
            UserModel.saveUserInfo(data.data);
            UserModel.saveToken(data.data.token);
            DeviceEventEmitter.emit('homePage_message', null);
            DeviceEventEmitter.emit('contentViewed', null);
            homeModule.loadHomeList();
            // this.$navigate('login/login/GetRedpacketPage');
            bridge.setCookies(data.data);
            //埋点登录成功
            login(data.data.code);
            //推送
            JPushUtils.updatePushTags();
            JPushUtils.updatePushAlias();
            homeRegisterFirstManager.setShowRegisterModalUrl(data.data.give);
            this.$navigateBackToHome();
        }).catch((data) => {
            this.$loadingDismiss();
            bridge.$toast(data.msg);
        });
    };
}


