import React from 'react';
import {
    View,
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommRegistView from '../components/CommRegistView';


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
                }}>
                </View>
            </View>


        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        // this.$loadingShow();
        //
        // LoginApi.findMemberByPhone({
        //     code: code,
        //     device: this.params.device ? this.params.device : '',
        //     inviteId: '',//邀请id
        //     openid: this.params.openid ? this.params.openid : '',
        //     password: password,
        //     phone: phone,
        //     systemVersion: this.params.systemVersion ? this.params.systemVersion : '',
        //     wechatVersion: ''
        // }).then((data) => {
        //     this.$loadingDismiss()
        //     this.$navigateBack();
        //     bridge.$toast(data.msg);
        // }).catch((response) => {
        //     this.$loadingDismiss()
        //     bridge.$toast(response.msg);
        // });

    };
}


