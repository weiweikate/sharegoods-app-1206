import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import {MRText as Text} from '../../../../components/ui'

export default class EditPayPwdPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '交易密码修改'
    };

    _render() {
        return <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity style={{
                marginTop: 160,
                width: ScreenUtils.width - 84,
                borderColor: DesignRule.mainColor,
                borderWidth: 0.7,
                height: 50,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
            }} onPress={() => this._know()}>
                <Text style={{ fontSize: 17, color: DesignRule.mainColor }}>记得原交易密码</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                marginTop: 21,
                backgroundColor: DesignRule.mainColor,
                width: ScreenUtils.width - 84,
                height: 50,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
            }} onPress={() => this._forget()}>
                <Text style={{ fontSize: 17, color: 'white' }}>忘记原交易密码</Text>
            </TouchableOpacity>
        </View>;
    }

    _know = () => {
        this.$navigate('mine/account/OldPayPwdPage', {
            oldPwd: '',
            tips: '请输入旧的支付密码'
        });
    };

    _forget = () => {
        this.$navigate('mine/account/JudgePhonePage', {
            title: '修改交易密码'
        });
    };
}
