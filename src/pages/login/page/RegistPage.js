import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { observer } from 'mobx-react';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import CommRegistView from '../components/CommRegistView';
import ScreenUtils from '../../../utils/ScreenUtils';
import LoginApi from '../api/LoginApi';
import bridge from '../../../utils/bridge';

@observer
export default class RegistPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '注册'
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={0}
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
                    <TouchableOpacity>
                        <Image source={LoginAndRegistRes.openEyeImage}
                               style={{ width: 11, height: 11, marginRight: 5 }}/>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: ColorUtil.Color_666666 }}>
                        阅读并接受
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ color: ColorUtil.mainRedColor, fontSize: 11 }}>
                            《用户协议》
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>


        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        this.$loadingShow();
        LoginApi.findMemberByPhone({
            code: code,
            device: this.params.device ? this.params.device : '',
            inviteId: '',//邀请id
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '',
            wechatVersion: ''
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

