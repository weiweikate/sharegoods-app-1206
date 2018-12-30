import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import bridge from '../../../../utils/bridge';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import MineAPI from '../../api/MineApi';
import user from '../../../../model/user';
import SMSTool from '../../../../utils/SMSTool';
import DesignRule from 'DesignRule';
import {MRText as Text, MRTextInput as TextInput} from '../../../../components/ui'

export default class SetNewPhoneNumPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '修改手机号'
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            telText: '',
            tips: '',
            code: '',
            vertifyCodeTime: 0
        };
    }

    _render() {
        return (<View style={{ flex: 1 }}>
            <View style={{ height: 40, justifyContent: 'center' }}>
                <UIText value={this.state.tips}
                        style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 13,
                            marginLeft: 16
                        }}/>
            </View>
            <View style={{ backgroundColor: 'white', flexDirection: 'column' }}>
                <View style={styles.horizontalItem}>
                    <Text style={styles.itemLeftText}>新手机</Text>
                    <TextInput
                        style={styles.itemRightInput}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '');
                            this.setState({ telText: newText });
                        }}
                        value={this.state.telText}
                        placeholder={'请输入新手机号'}
                        placeholderTextColor={DesignRule.textColor_hint}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{ height: 0.5, backgroundColor: 'white', marginLeft: 15, marginRight: 15 }}/>
                <View style={{
                    height: 44,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <UIText value={'验证码'} style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 20 }}/>
                    <TextInput style={{ flex: 1, padding: 0, fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 20 }}
                               placeholder={'请输入验证码'}
                               placeholderTextColor={DesignRule.textColor_hint}
                               onChangeText={(text) => {
                                   const newText = text.replace(/[^\d]+/, '');
                                   this.setState({ code: newText });
                               }}
                               value={this.state.code}
                               keyboardType={'numeric'}/>
                    <TouchableOpacity onPress={() => this._onGetCode(this.state.telText)}
                                      disabled={this.state.vertifyCodeTime > 0 ? true : false}>
                        <UIText value={this.state.vertifyCodeTime > 0 ? this.state.vertifyCodeTime + '秒后重新获取' : '获取验证码'}
                                style={{ color: '#D85674', fontSize: 13, marginRight: 15 }}/>
                    </TouchableOpacity>
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
                <Text style={{ fontSize: 17, color: 'white' }}>绑定</Text>
            </TouchableOpacity>
        </View>);
    }

    _onGetCode = (tel) => {
        //获取验证码
        if (StringUtils.checkPhone(tel)) {
            if (this.state.vertifyCodeTime <= 0){
                SMSTool.sendVerificationCode(SMSTool.SMSType.NewPhoneType, tel).then((data) => {
                    (new TimeDownUtils()).startDown((time) => {
                        this.setState({
                            vertifyCodeTime: time
                        });
                    });
                    this.setState({
                        tips: '我们将发送验证码到您的新手机上，请注意查收'
                    });
                    bridge.$toast('验证码已发送请注意查收');
                }).catch((data) => {
                    bridge.$toast(data.msg);
                });
            }
        } else {
            bridge.$toast('手机格式不对');
        }
    };

    _toNext = () => {
        let tel = this.state.telText;
        let code = this.state.code;
        const { oldNum, oldCode } = this.props.navigation.state.params;
        if (StringUtils.isEmpty(tel)) {
            bridge.$toast('请输入手机号');
            return;
        } else {
            if (oldNum === tel) {
                bridge.$toast('请输入新的手机号');
                return;
            }
        }
        if (StringUtils.isEmpty(code)) {
            bridge.$toast('请输入验证码');
            return;
        }
        if (StringUtils.checkPhone(tel)) {
            // 验证
            MineAPI.updatePhone({
                verificationCode: this.state.code,
                oldVerificationCode: oldCode,
                phone: this.state.telText
            }).then((data) => {
                user.changePhone(tel);
                bridge.$toast('绑定成功');
                this.$navigateBack(-2);
            }).catch((data) => {
                bridge.$toast(data.msg);
            });
        } else {
            bridge.$toast('手机格式不对');
            return;
        }
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
