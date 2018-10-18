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
import user from '../../../model/user';

@observer
export default class RegistPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '注册'
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            gouxuan: true
        };
    }

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={0}
                    loginClick={(phone, code, password) => this.clickNext(phone, code, password)}
                    ref={'topView'}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 11,
                    width: ScreenUtils.width
                }}>
                    <TouchableOpacity onPress={() => {
                        this.refs.topView.changeSelectState();
                        this.setState({
                            gouxuan: !this.state.gouxuan
                        });
                    }}>
                        <Image
                            source={this.state.gouxuan ? LoginAndRegistRes.reg_GouXuan : LoginAndRegistRes.reg_WeiXuan}
                            style={{ width: 11, height: 11, marginRight: 5 }}/>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: ColorUtil.Color_666666 }}>
                        阅读并接受
                    </Text>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('HtmlPage', {
                            title: '用户协议内容',
                            uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
                        });
                    }}>
                        <Text style={{ color: ColorUtil.mainRedColor, fontSize: 11 }}
                              onPress={() => {
                                  this.$navigate('HtmlPage', {
                                      title: '用户协议内容',
                                      uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
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
            bridge.$toast('请先勾选用户协议');
            return;
        }
        console.log(this.params)
        this.$loadingShow();
        LoginApi.findMemberByPhone({
            code: code,
            device: this.params.device ? this.params.device : '',
            inviteId: '',//邀请id
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '',
            wechatVersion: '',
            nickname:this.params.nickName
        }).then((data) => {
            if (data.code === 10000) {
                user.saveUserInfo(data.data);
                user.untiedWechat(this.params.nickName, this.params.openid);
                this.$navigateBack();
                bridge.$toast('登录成功');
            } else {
                bridge.$toast(data.msg);
            }
            this.$loadingDismiss();

            bridge.$toast(data.msg);
        }).catch((response) => {
            this.$loadingDismiss();
            bridge.$toast(response.msg);
        });

    };
}

