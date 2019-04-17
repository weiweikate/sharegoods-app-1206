/**
 * @author xzm
 * @date 2019/3/26
 */

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback, Keyboard, DeviceEventEmitter

} from 'react-native';
import BasePage from '../../../../BasePage';

import { MRText as Text } from '../../../../components/ui';

import ScreenUtils from '../../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import MineApi from '../../api/MineApi';
import PasswordInput from './../../components/PasswordInput';

import DesignRule from '../../../../constants/DesignRule';

export default class BankCardPasswordPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: this.params && this.params.title,
        show: true
    };


    inputText = (value) => {
        if (value.length === 6) {
            Keyboard.dismiss();
            this.finishedAction(value);
            this.passwordInput && this.passwordInput.clear();
        }
    };

    finishedAction = (password) => {
        if (this.params.type === 'delete') {
            let id = this.params.selectBankCard.id;
            MineApi.deleteUserBank({ id: id, password: password }).then((data) => {
                DeviceEventEmitter.emit('unbindBank', id);
                this.props.navigation.goBack();
                this.$toastShow('银行卡删除成功');
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
            return;
        }

        if (this.params.type === 'bind') {
            MineApi.judgeSalesPassword({ newPassword: password, type: 6 }).then((data) => {
                this.props.navigation.replace('mine/bankCard/AddBankCardPage');
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
            return;
        }
    };

    _render = () => {
        return (
            <View style={styles.contain}>
                <Text style={styles.titleStyle}>
                    输入交易密码
                </Text>
                <Text style={styles.tipStyle}>
                    验证身份
                </Text>
                <PasswordInput
                    ref={(ref) => {
                        this.passwordInput = ref;
                    }}
                    style={styles.password}
                    maxLength={6}
                    onChange={value => this.inputText(value)}
                />
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
                }}>
                    <Text style={styles.forgetStyle}>
                        忘记密码
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: DesignRule.bgColor
    },
    titleStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(23),
        marginTop: px2dp(85)
    },
    tipStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(15),
        marginTop: px2dp(15)
    },
    password: {
        width: ScreenUtils.width - px2dp(24),
        height: px2dp(57),
        marginTop: px2dp(70)
    },
    forgetStyle: {
        color: '#4A90E2',
        fontSize: px2dp(16),
        marginTop: px2dp(15)
    }
});
