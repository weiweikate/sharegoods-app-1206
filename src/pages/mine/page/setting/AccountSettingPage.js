import React from 'react';
import {
    View, Image, TouchableOpacity, StyleSheet
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import arrow_right from '../../../mine/res/customerservice/icon_06-03.png';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';

@observer
export default class AccountSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '账号与安全'
    };

    constructor(props) {
        super(props);
        this.state = {
            wechat: 'dfuodu'
        };
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
                <TouchableOpacity style={styles.viewStyle} onPress={() => this._toEditWechat(this.state.wechat)}>
                    <UIText value={'微信账号'} style={[styles.blackText, { flex: 1 }]}/>
                    <UIText value={this.state.wechat} style={{ fontSize: 13, color: '#666666', marginRight: 8 }}/>
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
