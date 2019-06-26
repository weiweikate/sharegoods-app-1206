import React from 'react';
import {
    // Switch,
    View, Image, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import user from '../../../../model/user';
import { observer } from 'mobx-react';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import RouterMap, { routeNavigate } from '../../../../navigation/RouterMap';
import { PageType } from '../myaccount/JudgePhonePage';
// import SettingModel from "../../model/SettingModel";

const arrow_right = res.button.arrow_right;
const PhonePwdStatus = {
    Undefined: 0,
    UnSet: 1,
    Setted: 2
};
@observer
export default class AccountSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '账号与安全'
    };

    constructor(props) {
        super(props);
        this.state = {
            phonePwdStatus: PhonePwdStatus.Undefined
        };
    }

    componentDidMount() {
        MineAPI.checkPhonePwd({}).then((data) => {
            if (data.data === true) {
                this.setState({ phonePwdStatus: PhonePwdStatus.Setted });
            } else {
                this.setState({ phonePwdStatus: PhonePwdStatus.UnSet });
            }
        }).catch((err) => {
            this.$toastShow(err.msg);
        });
    }

    renderLine = () => {
        return (
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 15,
                marginRight: 15
            }}/>
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPhoneNum(user.phone)}>
                    <UIText value={'修改手机号'} style={[styles.blackText, { flex: 1 }]}/>
                    <UIText value={user.phone}
                            style={{ fontSize: 13, color: DesignRule.textColor_secondTitle, marginRight: 8 }}/>
                    <Image source={arrow_right} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{
                    height: 0.5,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginLeft: 15,
                    marginRight: 15
                }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPwd()}>
                    <UIText value={this.state.phonePwdStatus === 1 ? '设置密码' : '修改密码'} style={styles.blackText}/>
                    <Image source={arrow_right} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{
                    height: 0.5,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginLeft: 15,
                    marginRight: 15
                }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPayPwd()}>
                    <UIText value={'交易密码设置'} style={styles.blackText}/>
                    <Image source={arrow_right} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{
                    height: 0.5,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginLeft: 15,
                    marginRight: 15
                }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditWechat(user.unionid)}>
                    <UIText value={'微信账号'} style={[styles.blackText, { flex: 1 }]}/>
                    <UIText value={StringUtils.isEmpty(user.unionid) ? '未绑定' : (user.wechatName || '无昵称')}
                            style={{ fontSize: 13, color: DesignRule.textColor_secondTitle, marginRight: 8 }}/>
                    <Image source={arrow_right} resizeMode={'contain'}/>
                </TouchableOpacity>

                {/*{this.renderLine()}*/}
                {/*<View style={{*/}
                    {/*height: 15,*/}
                    {/*backgroundColor: DesignRule.bgColor,*/}
                {/*}}/>*/}
                {/*<TouchableOpacity style={styles.viewStyle}>*/}
                    {/*<UIText value={'通过短信联系我'} style={styles.blackText}/>*/}
                    {/*<Switch value={SettingModel.messageState}*/}
                            {/*onTintColor={'#00D914'}*/}
                            {/*thumbTintColor={Platform.OS === 'android' ? 'white' : ''}*/}
                            {/*tintColor={DesignRule.textColor_hint}*/}
                            {/*onValueChange={() => {*/}
                                {/*if(SettingModel.messageState) {*/}

                                    {/*Alert.alert('确认关闭', '若关闭短信通道，你的秀迷将不能再通过发送短信联系您哦~',*/}
                                        {/*[*/}
                                            {/*{*/}
                                                {/*text: '取消', onPress: () => {*/}
                                                {/*}*/}
                                            {/*},*/}
                                            {/*{*/}
                                                {/*text: '确定', onPress: () => {*/}
                                                    {/*SettingModel.messageClick();*/}
                                                {/*}*/}
                                            {/*}*/}
                                        {/*]*/}
                                    {/*);*/}
                                {/*}else {*/}
                                    {/*SettingModel.messageClick();*/}
                                {/*}*/}
                            {/*}}/>*/}
                {/*</TouchableOpacity>*/}

                {/*{this.renderLine()}*/}
                {/*<TouchableOpacity style={styles.viewStyle}>*/}
                    {/*<UIText value={'展示微信号'} style={styles.blackText}/>*/}
                    {/*<Switch value={SettingModel.WXChatState}*/}
                            {/*onTintColor={'#00D914'}*/}
                            {/*thumbTintColor={Platform.OS === 'android' ? 'white' : ''}*/}
                            {/*tintColor={DesignRule.textColor_hint}*/}
                            {/*onValueChange={() => {*/}
                                {/*if(SettingModel.WXChatState){*/}
                                    {/*Alert.alert('确认关闭', '若关闭微信通道，你的秀迷将不能通过微信联系到您哦～',*/}
                                        {/*[*/}
                                            {/*{*/}
                                                {/*text: '取消', onPress: () => {*/}
                                                {/*}*/}
                                            {/*},*/}
                                            {/*{*/}
                                                {/*text: '确定', onPress: () => {*/}
                                                    {/*SettingModel.wxChatClick();                                                }*/}
                                            {/*}*/}
                                        {/*]*/}
                                    {/*);*/}
                                {/*}else {*/}
                                    {/*SettingModel.wxChatClick();*/}
                                {/*}*/}
                            {/*}}/>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    }

    _toEditPhoneNum = (tel) => {
        routeNavigate(RouterMap.EditPhoneNumPage, {
            oldNum: tel
        });
    };
    _toEditPwd = () => {
        let { phonePwdStatus } = this.state;
        if (phonePwdStatus === PhonePwdStatus.UnSet) {
            Alert.alert('未设置登录密码',
                '你还没有设置登录密码',
                [
                    {
                        onPress: () => {
                        }, text: '稍后就去'
                    },
                    {
                        onPress: () => {
                            this.$navigate(RouterMap.JudgePhonePage, { title: PageType.setLoginPW });
                        }, text: '马上设置'
                    }
                ]);
            return;
        }

        if (phonePwdStatus === PhonePwdStatus.Setted) {
            routeNavigate(RouterMap.EditPhonePwdPage);
            return;
        }
        MineAPI.checkPhonePwd({}).then((data) => {
            if (data.data === true) {
                this.setState({ phonePwdStatus: PhonePwdStatus.Setted });
                routeNavigate(RouterMap.EditPhonePwdPage);
            } else {
                this.setState({ phonePwdStatus: PhonePwdStatus.UnSet });
                Alert.alert('未设置登录密码',
                    '你还没有设置登录密码',
                    [
                        {
                            onPress: () => {
                            }, text: '稍后就去'
                        },
                        {
                            onPress: () => {
                                this.$navigate(RouterMap.JudgePhonePage, { title: PageType.setLoginPW });
                            }, text: '马上设置'
                        }
                    ]);
            }
        }).catch((err) => {
            this.$toastShow(err.msg);
        });

    };
    _toEditPayPwd = () => {
        console.log(user);
        if (user.hadSalePassword) {
            // 设置过交易密码,
            this.$navigate(RouterMap.EditPayPwdPage);
        } else {
            // 验证手机号
            this.$navigate(RouterMap.JudgePhonePage, {
                title: '设置交易密码'
            });
        }
    };
    _toEditWechat = (unionid) => {
        if (StringUtils.isEmpty(unionid)) {
            bridge.$loginWx((data) => {
                MineAPI.updateUserById({
                    ...data,
                    type: 4,
                    openid: data.openid,
                    wechatName: data.nickName
                }).then((resp) => {
                    if (resp.code === 10000) {
                        user.untiedWechat(data.nickName, data.appOpenid, data.unionid);
                        bridge.$toast('绑定成功');
                    } else {
                        bridge.$toast(resp.msg);
                    }
                }).catch((error) => {
                    bridge.$toast(error.msg);
                });
            });
        } else {
            Alert.alert('确定解绑微信账号？', '解绑微信账号后，将无法使用微信登录该账号', [
                {
                    text: '取消', onPress: () => {
                        style: 'cancel';
                    }
                },
                {
                    text: '确定', onPress: () => {
                        MineAPI.untiedWechat({}).then((response) => {
                            user.untiedWechat('', '', '');
                            bridge.$toast('解绑成功');
                        }).catch((data) => {
                            bridge.$toast(data.msg);
                        });
                    }
                }
            ], { cancelable: true });
        }
    };

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        marginTop: 11
    },
    viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 21,
        paddingRight: 23,
        backgroundColor: 'white',
        height: 44,
        alignItems: 'center'
    },
    blackText: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    }
});
