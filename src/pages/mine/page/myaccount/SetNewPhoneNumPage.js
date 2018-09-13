import {
    StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class SetNewPhoneNumPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '修改手机号'
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            tips: '',
            code: '',
            codeTxt: '获取验证码',
            codeTxtColor: '#D85674'
        };
    }

    _render() {
        return (<View style={{ flex: 1 }}>
            <View style={{ height: 40, justifyContent: 'center' }}>
                <UIText value={this.state.tips}
                        style={{
                            color: '#999999',
                            fontSize: 13,
                            marginLeft: 16
                        }}/>
            </View>
            <View style={{ backgroundColor: 'white', flexDirection: 'column' }}>
                <View style={styles.horizontalItem}>
                    <Text style={styles.itemLeftText}>新手机</Text>
                    <TextInput
                        style={styles.itemRightInput}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => this.setState({ telText: text })}
                        value={this.state.telText}
                        placeholder={'请输入新手机号'}
                        placeholderTextColor={'#C8C8C8'}
                    />
                </View>
                <View style={{ height: 0.5, backgroundColor: 'white', marginLeft: 15, marginRight: 15 }}></View>
                <View style={{
                    height: 44,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <UIText value={'验证码'} style={{ fontSize: 13, color: '#000000', marginLeft: 20 }}/>
                    <TextInput underlineColorAndroid={'transparent'}
                               style={{ flex: 1, padding: 0, fontSize: 13, color: '#000000', marginLeft: 20 }}
                               placeholder={'请输入验证码'}
                               placeholderTextColor={'#C8C8C8'}
                               onChangeText={(text) => this.setState({ code: text })}
                               value={this.state.code}
                               keyboardType={'phone-pad'}/>
                    <TouchableOpacity onPress={() => this._onGetCode()}>
                        <UIText value={this.state.codeTxt}
                                style={{ color: this.state.codeTxtColor, fontSize: 11, marginRight: 15 }}/>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={{
                marginTop: 54,
                backgroundColor: color.red,
                width: ScreenUtils.width - 84,
                height: 48,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }} onPress={() => this._toNext()}>
                <Text style={{ fontSize: 13, color: 'white' }}>绑定</Text>
            </TouchableOpacity>
        </View>);
    }

    _onGetCode = () => {
        this.setState({
            tips: '我们将发送验证码到您的新手机上，请注意查收'
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
        color: '#222222'
    },
    itemRightInput: {
        flex: 1,
        height: 40,
        padding: 0,
        color: '#999999',
        fontSize: 13
    }
});
