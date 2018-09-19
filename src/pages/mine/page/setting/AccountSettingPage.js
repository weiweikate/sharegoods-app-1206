import React from 'react';
import {
    View, Image, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import arrow_right from '../../../mine/res/customerservice/icon_06-03.png';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';

@observer
export default class AccountSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '账号与安全'
    };

    constructor(props) {
        super(props);
    }

    _render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPhoneNum(user.phone)}>
                    <UIText value={'修改手机号'} style={[styles.blackText, { flex: 1 }]}/>
                    <UIText value={user.phone} style={{ fontSize: 13, color: '#666666', marginRight: 8 }}/>
                    <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: '#eeeeee', marginLeft: 15, marginRight: 15 }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPwd()}>
                    <UIText value={'修改密码'} style={styles.blackText}/>
                    <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: '#eeeeee', marginLeft: 15, marginRight: 15 }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditPayPwd()}>
                    <UIText value={'交易密码设置'} style={styles.blackText}/>
                    <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: '#eeeeee', marginLeft: 15, marginRight: 15 }}/>
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditWechat(user.wechatId)}>
                    <UIText value={'微信账号'} style={[styles.blackText, { flex: 1 }]}/>
                    <UIText value={user.wechatId} style={{ fontSize: 13, color: '#666666', marginRight: 8 }}/>
                    <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                </TouchableOpacity>
            </View>
        );
    }

    _toEditPhoneNum = (tel) => {
        this.$navigate('mine/account/EditPhoneNumPage', {
            oldNum: tel
        });
    };
    _toEditPwd = () => {
        this.$navigate('mine/account/EditPhonePwdPage');
    };
    _toEditPayPwd = () => {
        this.$navigate('mine/account/EditPayPwdPage');
    };
    _toEditWechat = (wechat) => {
        if (StringUtils.isEmpty(wechat)) {
            bridge.$toast('未绑定微信账号');
            return;
        }
        Alert.alert('确定解绑微信账号？', '解绑微信账号后，将无法使用微信登录该账号', [
            {
                text: '取消', onPress: () => {
                    style: 'cancel';
                }
            },
            {
                text: '确定', onPress: () => {
                    MineAPI.untiedWechat({}).then((response) => {
                        user.untiedWechat(wechat);
                        bridge.$toast('解绑成功');
                    }).catch((data) => {
                        bridge.$toast(data.msg);
                    });
                }
            }
        ], { cancelable: true });
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
        backgroundColor: color.white,
        height: 44,
        alignItems: 'center'
    },
    blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#222222'
    }
});
