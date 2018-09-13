import React from 'react';
import {
    View
    // Text,
    // TextInput,
    // StyleSheet,
    // TouchableOpacity,
    // Image, Alert
} from 'react-native';
// import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
// import { observable, action, computed } from 'mobx';
// import LoginAndRegistRes from '../res/LoginAndRegistRes';
// import ColorUtil from '../../../utils/ColorUtil';
// import bridge from '../../../utils/bridge';
// import { TimeDownUtils } from '../../../utils/TimeDownUtils';
// import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
// import LoginApi from '../api/LoginApi';
import CommRegistView from '../components/CommRegistView';

// class ForgetPasswordModel {
//     @observable
//     phoneNumber = '';
//     @observable
//     password = '';
//     @observable
//     vertifyCode = '';
//     @observable
//     isSecuret = true;
//     @observable
//     dowTime = 0;
//
//     @action
//     savePhoneNumber(phoneNmber) {
//         if (!phoneNmber) {
//             phoneNmber = '';
//             return;
//         }
//         this.phoneNumber = phoneNmber;
//     }
//
//     @action
//     savePassword(password) {
//         if (!password) {
//             password = '';
//             return;
//         }
//         this.password = password;
//     }
//
//     @action
//     saveVertifyCode(vertifyCode) {
//         if (!vertifyCode) {
//             vertifyCode = '';
//             return;
//         }
//         this.vertifyCode = vertifyCode;
//     }
//
//     @computed
//     get isCanClick() {
//         if (this.phoneNumber.length < 11 && this.vertifyCode.length > 0 && this.password.length >= 6) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }

@observer
export default class ForgetPasswordPage extends BasePage {
    // forgetPasswordModel = new ForgetPasswordModel();
    // 导航配置
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


