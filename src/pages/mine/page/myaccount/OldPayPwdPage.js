import { View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import Password from '../../../../components/ui/PasswordInput';
import UIText from '../../../../components/ui/UIText';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';

export default class OldPayPwdPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '修改交易密码'
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
            <UIText value={this.state.tips} style={{ fontSize: 17, color: DesignRule.textColor_mainTitle, marginTop: 120 }}/>
            <Password maxLength={6} style={{ width: 345, marginTop: 30 }}
                      onEnd={(pwd) => this._onext(pwd)} />
        </View>;
    }

    _onext = (pwd) => {
        const { oldPwd } = this.props.navigation.state.params;
        if (StringUtils.isEmpty(oldPwd)) {
            // 判断密码是否正确，正确则跳转到新页面输入新密码
            MineAPI.judgeSalesPassword({
                newPassword: pwd,
                type: '3'
            }).then((response) => {
                // 跳转到输入新密码
                this.$navigate('mine/account/OldPayPwdPage', {
                    oldPwd: pwd,
                    tips: '请输入新的支付密码'
                });
            }).catch((data) => {
                bridge.$toast(data.msg);
            });
        } else {
            if (oldPwd === pwd) {
                bridge.$toast('新密码不能与旧密码相同');
                return;
            }
            MineAPI.updateSalesOldPwd({
                oldPassword: oldPwd,
                newPassword: pwd
            }).then((response) => {
                // 修改成功
                bridge.$toast('修改成功');
                this.$navigateBack(-2);
            }).catch((data) => {
                bridge.$toast(data.msg);
            });
        }
    };
}
