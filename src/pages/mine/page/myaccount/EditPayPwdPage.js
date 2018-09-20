import {
    Text, TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';

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
                borderColor: color.red,
                borderWidth: 0.7,
                height: 48,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }} onPress={() => this._forget()}>
                <Text style={{ fontSize: 14, color: color.red }}>记得原交易密码</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                marginTop: 21,
                backgroundColor: color.red,
                width: ScreenUtils.width - 84,
                height: 48,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }} onPress={() => this._doNext()}>
                <Text style={{ fontSize: 14, color: 'white' }}>忘记原交易密码</Text>
            </TouchableOpacity>
        </View>;
    }

    _forget = () => {
        this.$navigate('mine/account/OldPayPwdPage', {
            oldPwd: '',
            tips: '请输入旧的支付密码'
        });
    };

    _doNext = () => {
        this.$navigate('mine/account/JudgePhonePage');
    };
}
