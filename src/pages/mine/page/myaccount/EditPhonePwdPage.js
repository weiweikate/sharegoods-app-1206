import {
    Image,
    TouchableOpacity, View, ScrollView, Keyboard
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import user from '../../../../model/user';
import shopCartStore from '../../../shopCart/model/ShopCartStore';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui';

const openEyeImage = res.button.open_eye;
const closeEyeImage = res.button.close_eye;

export default class EditPhonePwdPage extends BasePage {

    $navigationBarOptions = {
        title: '修改密码'
    };

    constructor(props) {
        super(props);
        this.state = {
            isOldSecuret: true,
            oldPwd: '',
            isNewSecuret: true,
            newPwd: '',
            isAgainSecuret: true,
            newPwdAgain: ''
        };
        this.isLoadding = false;
    }

    _render() {
        return <ScrollView style={{ flex: 1 }}>
            <UIText value={'请输入旧密码'}
                    style={{ fontSize: 13, color: DesignRule.textColor_hint, marginLeft: 20, marginTop: 15 }}/>
            <View style={{
                flexDirection: 'row',
                height: 48,
                backgroundColor: 'white',
                marginTop: 12,
                alignItems: 'center'
            }}>
                <UIText value={'旧密码'} style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 22 }}/>
                <TextInput
                    style={{ flex: 1, padding: 0, fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 14 }}
                    placeholder={'请输入旧密码'} placeholderTextColor={DesignRule.textColor_hint}
                    onChangeText={(text) => this.setState({ oldPwd: text })}
                    value={this.state.oldPwd}
                    keyboardType={'default'}
                    secureTextEntry={this.state.isOldSecuret}/>
                <TouchableOpacity onPress={() => {
                    Keyboard.dismiss();
                    this.setState({
                        isOldSecuret: !this.state.isOldSecuret
                    });
                }}>
                    <Image
                        source={this.state.isOldSecuret ? closeEyeImage : openEyeImage}
                        style={{ marginRight: 20 }}/>

                </TouchableOpacity>
            </View>
            <UIText value={'请设置新密码'}
                    style={{ fontSize: 13, color: DesignRule.textColor_hint, marginLeft: 20, marginTop: 15 }}/>
            <View style={{ backgroundColor: 'white', marginTop: 12, flexDirection: 'column' }}>
                <View style={{
                    flexDirection: 'row',
                    height: 48,
                    alignItems: 'center'
                }}>
                    <UIText value={'新密码'}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 22 }}/>
                    <TextInput style={{
                        flex: 1,
                        padding: 0,
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 14
                    }}
                               placeholder={'请输入新密码'} placeholderTextColor={DesignRule.textColor_hint}
                               onChangeText={(text) => this.setState({ newPwd: text })}
                               value={this.state.newPwd}
                               keyboardType={'default'}
                               secureTextEntry={this.state.isNewSecuret}/>
                    <TouchableOpacity onPress={() => {
                        Keyboard.dismiss();
                        this.setState({
                            isNewSecuret: !this.state.isNewSecuret
                        });
                    }}>
                        <Image
                            source={this.state.isNewSecuret ? closeEyeImage : openEyeImage}
                            style={{ marginRight: 20 }}/>

                    </TouchableOpacity>
                </View>
                <View style={{
                    height: 0.5,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginRight: 15,
                    marginLeft: 15
                }}/>
                <View style={{
                    flexDirection: 'row',
                    height: 48,
                    alignItems: 'center'
                }}>
                    <UIText value={'新密码'}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 22 }}/>
                    <TextInput style={{
                        flex: 1,
                        padding: 0,
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 14
                    }}
                               placeholder={'请再次输入新密码'} placeholderTextColor={DesignRule.textColor_hint}
                               onChangeText={(text) => this.setState({ newPwdAgain: text })}
                               value={this.state.newPwdAgain}
                               keyboardType={'default'}
                               secureTextEntry={this.state.isAgainSecuret}/>
                    <TouchableOpacity onPress={() => {
                        Keyboard.dismiss();
                        this.setState({
                            isAgainSecuret: !this.state.isAgainSecuret
                        });
                    }}>
                        <Image
                            source={this.state.isAgainSecuret ? closeEyeImage : openEyeImage}
                            style={{ marginRight: 20 }}/>

                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={{
                marginTop: 63,
                backgroundColor: DesignRule.mainColor,
                width: ScreenUtils.width - 84,
                height: 50,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
            }} onPress={() => this._done()}>
                <Text style={{ fontSize: 17, color: 'white' }}>完成</Text>
            </TouchableOpacity>
        </ScrollView>;
    }

    _done = () => {
        if (this.isLoadding === true) {
            return;
        }
        // 密码修改成功，请重新登录
        if (StringUtils.isEmpty(this.state.oldPwd)) {
            bridge.$toast('旧密码不能为空');
            return;
        }
        if (StringUtils.isEmpty(this.state.newPwd)) {
            bridge.$toast('新密码不能为空');
            return;
        }
        if (StringUtils.isEmpty(this.state.newPwdAgain)) {
            bridge.$toast('请再次输入新密码');
            return;
        }
        if (this.state.newPwdAgain !== this.state.newPwd) {
            bridge.$toast('请确保两次输入的新密码一致');
            return;
        }
        if (!StringUtils.checkPassword(this.state.newPwdAgain)) {
            bridge.$toast('新密码需数字、字母组合');
            return;
        }
        this.isLoadding == true;
        MineAPI.changePhonePwd({
            oldPassword: this.state.oldPwd,
            newPassword: this.state.newPwd
        }).then((data) => {
            // 退出登录
            MineAPI.signOut().then((response) => {
                if (response.code === 10000) {
                    // 正常退出，或者登录超时，都去清空数据
                    user.clearUserInfo();
                    //清空购物车
                    shopCartStore.data = [];
                    this.$navigateResetLogin();
                    bridge.$toast('密码修改成功，请重新登录');
                }
                this.isLoadding == false;
            }).catch(err => {
                bridge.$toast(err.msg);
                this.isLoadding == false;
                if (err.code === 10009) {
                    user.clearUserInfo();
                    shopCartStore.data = [];
                    this.$navigateResetLogin();
                    // this.$navigateReset();
                    // this.$navigate('login/login/LoginPage');
                }
            });
        }).catch((data) => {
            this.isLoadding == false;
            bridge.$toast(data.msg);
        });
    };
}
