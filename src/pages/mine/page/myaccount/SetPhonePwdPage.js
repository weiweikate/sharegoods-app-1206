import {
    TouchableOpacity,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import { MRText as Text} from '../../../../components/ui';
import PasswordInputText from './PasswordInputText';
const title = '请设置登录密码';
const tip = '请设置6-8位数字字母组合密码，不含特殊符号';

export default class EditPhonePwdPage extends BasePage {

    $navigationBarOptions = {
        title: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            newPwd: '',
            newPwdAgain: ''
        };
        this.isLoadding = false;
    }

    _render() {
        let {newPwd, newPwdAgain} = this.state;
        let enabled = newPwd.length>0 && newPwdAgain.length>0 ;
        return(
            <KeyboardAvoidingView style={{alignItems: 'center'}}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.tip}>{tip}</Text>
                <PasswordInputText placeholder={'请输入新密码'} onChangeText={(text)=>{this.setState({newPwd: text})}}/>
                <PasswordInputText placeholder={'请再次输入密码'} onChangeText={(text)=>{this.setState({newPwdAgain: text})}}/>
                <TouchableOpacity style={[{
                    backgroundColor: enabled ? DesignRule.mainColor: '#cccccc',
                    enabled: enabled
                }, styles.btn]} onPress={() => this._done()}>
                    <Text style={{ fontSize: 17, color: 'white' }}>完成</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }

    _done = () => {
        if (this.isLoadding === true) {
            return;
        }
       let {newPwd, newPwdAgain} = this.state;
        if (StringUtils.isEmpty(newPwd)) {
            bridge.$toast('密码不能为空');
            return;
        }
        if (StringUtils.isEmpty(newPwdAgain)) {
            bridge.$toast('请再次输入密码');
            return;
        }
        if (newPwdAgain !== newPwd) {
            bridge.$toast('请确保两次输入的密码一致');
            return;
        }
        if (!StringUtils.checkPassword(newPwdAgain)) {
            bridge.$toast('新密码需数字、字母组合');
            return;
        }
        this.isLoadding == true;
        MineAPI.changePhonePwd({
            newPassword: newPwd
        }).then((data) => {
            this.$navigateBack(-2);
            this.isLoadding == false;
        }).catch((data) => {
            this.isLoadding == false;
            bridge.$toast(data.msg);
        });
    };
}


const styles = StyleSheet.create({
    btn: {
        marginTop: 63,
        width: ScreenUtils.width - 84,
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    title: {
        fontSize: 23,
        color: DesignRule.textColor_mainTitle,
        marginTop: ScreenUtils.autoSizeWidth(80)
    },
    tip: {
        fontSize: 11,
        color: DesignRule.textColor_placeholder,
        marginTop: 10,
        marginBottom: ScreenUtils.autoSizeWidth(25)
    }
});
