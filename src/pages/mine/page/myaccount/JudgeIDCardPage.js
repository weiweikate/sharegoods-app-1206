import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import bridge from '../../../../utils/bridge';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import user from '../../../../model/user';
import MineAPI from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text, MRTextInput as TextInput} from '../../../../components/ui'
export default class SetNewPhoneNumPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '修改交易密码'
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            userName: user.realname,
            cardNum: ''
        };
    }

    _render() {
        return (<View style={{ flex: 1 }}>
            <View style={{ height: 38, justifyContent: 'center' }}>
                <UIText value={'身份认证'}
                        style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 13,
                            marginLeft: 16
                        }}/>
            </View>
            <View style={{ backgroundColor: 'white', flexDirection: 'column' }}>
                <View style={styles.horizontalItem}>
                    <Text style={styles.itemLeftText}>用户姓名</Text>
                    <TextInput
                        style={styles.itemRightInput}
                        onChangeText={(text) => this.setState({ userName: text })}
                        value={this.state.userName}
                        placeholder={'请输入用户姓名'}
                        placeholderTextColor={DesignRule.textColor_hint}
                    />
                </View>
                <View style={{ height: 0.5, backgroundColor: 'white', marginLeft: 15 }}/>
                <View style={styles.horizontalItem}>
                    <Text style={styles.itemLeftText}>证件号码</Text>
                    <TextInput
                        style={styles.itemRightInput}
                        onChangeText={(text) => this.setState({ cardNum: text })}
                        value={this.state.cardNum}
                        placeholder={'请输入证件号码'}
                        placeholderTextColor={DesignRule.textColor_hint}
                    />
                </View>
            </View>

            <TouchableOpacity style={{
                marginTop: 54,
                backgroundColor: DesignRule.mainColor,
                width: ScreenUtils.width - 84,
                height: 50,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
            }} onPress={() => this._toNext()}>
                <Text style={{ fontSize: 17, color: 'white' }}>确认</Text>
            </TouchableOpacity>
        </View>);
    }

    _onGetCode = (tel) => {
        //获取验证码
        if (StringUtils.checkPhone(tel)) {

            if(this.state.vertifyCodeTime <= 0){
                (new TimeDownUtils()).startDown((time) => {
                    this.setState({
                        vertifyCodeTime: time
                    });
                });
                bridge.$toast('验证码已发送请注意查收');
            }
        } else {
            bridge.$toast('手机格式不对');
        }
    };

    _toNext = () => {
        let userName = this.state.userName;
        let cardNum = this.state.cardNum;
        if (StringUtils.isEmpty(userName)) {
            bridge.$toast('请输入姓名');
            return;
        }
        if (StringUtils.isEmpty(cardNum)) {
            bridge.$toast('请输入证件号码');
            return;
        }
        // 验证身份
        MineAPI.judgeIdCard({
            realname: userName,
            idcard: cardNum
        }).then((data) => {
            this.$navigate('mine/account/SetOrEditPayPwdPage', {
                userName,
                cardNum,
                oldPwd: '',
                tips: '重新设置新的交易密码',
                title: '重置交易密码',
                from: 'edit'
            });
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

}

const styles = StyleSheet.create({
    horizontalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: 45,
        backgroundColor: 'white'
    },
    itemLeftText: {
        marginRight: 20,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    itemRightInput: {
        flex: 1,
        height: 40,
        padding: 0,
        color: DesignRule.textColor_mainTitle,
        fontSize: 13
    }
});
