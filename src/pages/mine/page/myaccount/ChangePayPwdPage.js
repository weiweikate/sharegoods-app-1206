import { View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import Password from '../../../../components/ui/PasswordInput';
import UIText from '../../../../components/ui/UIText';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';

export default class ChangePayPwdPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '重置交易密码'
    };

    // 构造
    constructor(props) {
        super(props);
        const { tips } = this.props.navigation.state.params;
        this.state = {
            tips: tips
        };
    }

    _render() {
        return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <UIText value={this.state.tips} style={{ fontSize: 17, color: '#222222', marginTop: 120 }}/>
            <Password maxLength={6} style={{ width: 345, marginTop: 30 }}
                      onEnd={(pwd) => this._onext(pwd)}></Password>
        </View>;
    }

    _onext = (pwd) => {
        const { oldPwd, userName, cardNum } = this.props.navigation.state.params;
        console.log(oldPwd);
        console.log(userName);
        console.log(cardNum);
        if (StringUtils.isEmpty(oldPwd)) {
            // 跳转到确认密码
            this.$navigate('mine/account/ChangePayPwdPage', {
                userName,
                cardNum,
                oldPwd: pwd,
                tips: '请确认新的交易密码'
            });
        } else {
            if (oldPwd != pwd) {
                bridge.$toast('两次输入的密码不一致');
                return;
            } else {
                MineAPI.updateSalesOldPwdByIDCard({
                    // idCard: cardNum,
                    // realname: userName,
                    idcard: '123',
                    realname: '123',
                    newPassword: pwd
                }).then((response) => {
                    // 修改成功
                    bridge.$toast('修改成功');
                    this.$navigateBack(-4);
                }).catch((data) => {
                    bridge.$toast(data.msg);
                });
            }
        }
    };
}
