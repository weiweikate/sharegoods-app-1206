import React from 'react';
import {
    View,
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommRegistView from '../components/CommRegistView';
import LoginAPI from "../api/LoginApi";
import bridge from "../../../utils/bridge";


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
                }} />
            </View>


        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        console.warn(this.params);
        this.$loadingShow();
        LoginAPI.existedUserLogin({
            authcode:this.params.code ? this.params.code : '',
            code: code,
            device:this.params.device ? this.params.device : 'eeeeee',
            headImg:'',
            nickname:'',
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '11',
            username:'',
            wechatCode:'',
            wechatVersion: ''
        }).then(data=>{
            this.$loadingDismiss();

            // console.warn(data);
            this.$navigateBack(-2);
        }).catch(data=>{
            this.$loadingDismiss()
             if (data.code === 34007 ){
                bridge.$toast('该手机号已经注册,请更换新的手机号');
            } else {
                this.$toast(data.msg);
            }
            console.warn(data);

        });
    };
}


