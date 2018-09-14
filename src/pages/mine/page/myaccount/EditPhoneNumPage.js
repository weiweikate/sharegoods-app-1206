import {
    Text, TextInput, View, TouchableOpacity
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import bridge from '../../../../utils/bridge';

export default class EditPhoneNumPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '修改手机号'
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            vertifyCodeTime: 0
        };
    }

    _render() {
        const { oldNum } = this.props.navigation.state.params;
        return (<View style={{ flex: 1 }}>
            <UIText value={'短信验证码将发送至绑定手机： ' + oldNum}
                    style={{
                        color: '#999999',
                        fontSize: 13,
                        marginTop: 15,
                        marginLeft: 16
                    }}/>
            <View style={{
                height: 44,
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                marginTop: 10
            }}>
                <UIText value={'验证码'} style={{ fontSize: 13, color: '#000000', marginLeft: 20 }}/>
                <TextInput underlineColorAndroid={'transparent'}
                           style={{ flex: 1, padding: 0, fontSize: 13, color: '#000000', marginLeft: 20 }}
                           placeholder={'请输入验证码'} placeholderTextColor={'#C8C8C8'}
                           onChangeText={(text) => this.setState({ code: text })}
                           value={this.state.code}
                           keyboardType={'phone-pad'}/>
                <TouchableOpacity onPress={() => this._onGetCode(oldNum)}
                                  disabled={this.state.vertifyCodeTime > 0 ? true : false}>
                    <UIText value={this.state.vertifyCodeTime > 0 ? this.state.vertifyCodeTime + '秒后重新获取' : '获取验证码'}
                            style={{ color: '#D85674', fontSize: 11, marginRight: 15 }}/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={{
                marginTop: 42,
                backgroundColor: color.red,
                width: ScreenUtils.width - 84,
                height: 48,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }} onPress={() => this._toNext(oldNum)}>
                <Text style={{ fontSize: 13, color: 'white' }}>下一步</Text>
            </TouchableOpacity>
        </View>);
    }

    _onGetCode = (oldNum) => {
        //获取验证码
        if (StringUtils.checkPhone(oldNum)) {
            (new TimeDownUtils()).startDown((time) => {
                this.setState({
                    vertifyCodeTime: time
                });
            });
            bridge.$toast('验证码已发送请注意查收');
        } else {
            bridge.$toast('手机格式不对');
        }
    };

    _toNext = (oldNum) => {
        // 调用接口验证验证码是否正确，正确next
        if (StringUtils.isEmpty(this.state.code)) {
            bridge.$toast('验证码不能为空');
            return;
        }
        this.$navigate('mine/account/SetNewPhoneNumPage', {
            oldeNum: oldNum
        });
    };

}
