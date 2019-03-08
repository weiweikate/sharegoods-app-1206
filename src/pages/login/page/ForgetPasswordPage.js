import React from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import CommRegistView from '../components/CommRegistView';
import LoginAPI from "../api/LoginApi";
import bridge from "../../../utils/bridge";

@observer
export default class ForgetPasswordPage extends BasePage {
    $navigationBarOptions = {
        title: '忘记密码'
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={1}
                    loginClick={(phone, code, password) => this.clickNext(phone, code, password)}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 11,
                    width: ScreenUtils.width
                }} />
            </View>


        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        this.$loadingShow();
        LoginAPI.resetPassword({
            authcode:'',
            code: code,
            device: this.params.device ? this.params.device : 'eeeeee',
            inviteId: '',//邀请id
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '11',
            wechatVersion: '11'
        }).then((data) => {
            this.$loadingDismiss()
            this.$navigateBack();
           bridge.$toast(data.msg);
        }).catch((response) => {
            this.$loadingDismiss()
            bridge.$toast(response.msg);
        });

    };
}


