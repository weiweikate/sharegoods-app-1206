import { View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import Password from '../../../../components/ui/PasswordInput';
import UIText from '../../../../components/ui/UIText';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import user from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class SetOrEditPayPwdPage extends BasePage {

    // 构造
    constructor(props) {
        super(props);
        const { tips, title } = this.props.navigation.state.params;
        this.$navigationBarOptions.title = title;
        this.state = {
            tips: tips,
            msg: null
        };
    }

    _render() {
        return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <UIText value={this.state.tips}
                    style={{ fontSize: 17, color: DesignRule.textColor_mainTitle, marginTop: 120 }}/>
            <Password maxLength={6} style={{ width: ScreenUtils.autoSizeWidth(345), marginTop: 30 , height:ScreenUtils.autoSizeWidth(45)}}
                      onEnd={(pwd) => this._onext(pwd)} ref={(ref)=> {this.paw = ref}}/>
            <UIText value={this.state.msg}
                    style={{ fontSize: 15, color: DesignRule.mainColor, marginTop: 15 }}/>
        </View>;
    }

    _onext = (pwd) => {
        const { oldPwd, userName, cardNum, from, title, code } = this.props.navigation.state.params;
        if (StringUtils.isEmpty(oldPwd)) {
            this.paw.clean();
            if (from === 'edit') {
                // 跳转到确认密码
                this.$navigate('mine/account/SetOrEditPayPwdPage', {
                    userName,
                    cardNum,
                    oldPwd: pwd,
                    title,
                    tips: '请确认新的交易密码',
                    from
                });
            } else {
                // 跳转到确认密码
                this.$navigate('mine/account/SetOrEditPayPwdPage', {
                    oldPwd: pwd,
                    title,
                    tips: '请再次输入一次交易支付密码',
                    code,
                    from
                });
            }
        } else {
            if (oldPwd !== pwd) {
                this.paw && this.paw.changeRedBorderColor();
                this.setState({msg: '两次输入的密码不一致,请重新输入'});
                return;
            } else {
                if (from === 'edit') {
                    MineAPI.updateSalesOldPwdByIDCard({
                        idcard: cardNum,
                        realname: userName,
                        newPassword: pwd
                    }).then((response) => {
                        // 修改成功
                        bridge.$toast('修改成功');
                        this.$navigateBack(-4);
                    }).catch((data) => {
                        this.paw && this.paw.changeRedBorderColor();
                        this.setState({msg: data.msg});
                    });
                } else {
                    MineAPI.initSalesPassword({
                        verificationCode: code,
                        newPassword: pwd
                    }).then((response) => {
                            // 设置支付密码成功成功,跳转成功页面
                            user.setHadSalePassword(true);
                            this.$navigate('mine/account/SetPayPwdSuccessPage');
                        }
                    ).catch((data) => {
                        this.paw && this.paw.changeRedBorderColor();
                        this.setState({msg: data.msg});
                    });
                }
            }
        }
    };
}
