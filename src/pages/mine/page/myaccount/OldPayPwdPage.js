import { View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import Password from '../../../../components/ui/PasswordInput';
import UIText from '../../../../components/ui/UIText';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';
import RouterMap from '../../../../navigation/RouterMap';

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
            tips: tips,
            msg: null
        };
    }

    _render() {
        return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <UIText value={this.state.tips}
                    style={{ fontSize: 17, color: DesignRule.textColor_mainTitle, marginTop: 120 }}/>
            <Password maxLength={6} style={{
                width: ScreenUtils.autoSizeWidth(345),
                marginTop: 30,
                height: ScreenUtils.autoSizeWidth(45)
            }}
                      onEnd={(pwd) => this._onext(pwd)} ref={(ref) => {
                this.paw = ref;
            }}/>
            <UIText value={this.state.msg}
                    style={{ fontSize: 15, color: DesignRule.mainColor, marginTop: 15 }}/>
        </View>;
    }

    _onext = (pwd) => {
        const { oldPwd } = this.props.navigation.state.params;
        if (StringUtils.isEmpty(oldPwd)) {
            this.paw.clean();
            // 判断密码是否正确，正确则跳转到新页面输入新密码
            MineAPI.judgeSalesPassword({
                newPassword: pwd,
                type: '3'
            }).then((response) => {
                // 跳转到输入新密码
                this.$navigate(RouterMap.OldPayPwdPage, {
                    oldPwd: pwd,
                    tips: '请输入新的支付密码'
                });
                this.setState({ msg: '' });
            }).catch((data) => {
                this.paw && this.paw.changeRedBorderColor();
                this.setState({ msg: data.msg });
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
                this.$navigateBack(2);
            }).catch((data) => {
                this.paw && this.paw.changeRedBorderColor();
                this.setState({ msg: data.msg });
            });
        }
    };
}
