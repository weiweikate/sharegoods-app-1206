import {
     View, TouchableOpacity
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import { TimeDownUtils } from '../../../../utils/TimeDownUtils';
import bridge from '../../../../utils/bridge';
import MineAPI from '../../api/MineApi';
import SMSTool from '../../../../utils/SMSTool';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text, MRTextInput as TextInput} from '../../../../components/ui'
/**
 * @author chenxiang
 * @date on 2018/9/18
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
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
            vertifyCodeTime: 0,
            isSend: false,
            tip: ''
        };
        this.isLoadding = false;
    }

    componentDidMount() {
       MineAPI.getDays({}).then((data)=>{
           if (this.state.tip.length === 0){
               this.setState({tip: '注：解绑后的手机号，' + data.data + '天内不可进行注册新账户'})
           }
       })
    }

    _render() {
        const { oldNum } = this.props.navigation.state.params;
        let show_num = oldNum;
        if (oldNum.length === 11){
            show_num = oldNum.slice(0, 3) + '****' + oldNum.slice(7, 11);
        }

        let show_num_str = '修改手机号需要验证： ' + show_num + '手机号';
        if (this.state.isSend){
            show_num_str = '短信验证码已发送到绑定手机' + show_num;
        }
        return (<View style={{ flex: 1 }}>
            <UIText value={show_num_str}
                    style={{
                        color: DesignRule.textColor_instruction,
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
                <UIText value={'验证码'} style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 20 }}/>
                <TextInput style={{ flex: 1, padding: 0, fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 20 }}
                           placeholder={'请输入验证码'} placeholderTextColor={DesignRule.textColor_hint}
                           onChangeText={(text) => {
                               const newText = text.replace(/[^\d]+/, '');
                               this.setState({ code: newText });
                           }}
                           value={this.state.code}
                           keyboardType={'numeric'}/>
                <TouchableOpacity onPress={() => this._onGetCode(oldNum)}
                                  disabled={this.state.vertifyCodeTime > 0 ? true : false}>
                    <UIText value={this.state.vertifyCodeTime > 0 ? this.state.vertifyCodeTime + '秒后重新获取' : '获取验证码'}
                            style={{ color: '#D85674', fontSize: 13, marginRight: 15 }}/>
                </TouchableOpacity>
            </View>
            <UIText value={this.state.tip}
                    style={{
                        color: 'red',
                        fontSize: 12,
                        marginTop: 15,
                        marginLeft: 16
                    }}/>
            <TouchableOpacity style={{
                marginTop: 42,
                backgroundColor: this.state.code.length === 0 ? '#E3E3E3' : DesignRule.mainColor,
                width: ScreenUtils.width - 84,
                height: 50,
                marginLeft: 42,
                marginRight: 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
            }} onPress={() => this._toNext(oldNum)}
                              disabled={this.state.code.length === 0 ? true : false}>
                <Text style={{ fontSize: 17, color: 'white' }}>下一步</Text>
            </TouchableOpacity>
        </View>);
    }

    _onGetCode = (oldNum) => {
        //获取验证码
        if (StringUtils.checkPhone(oldNum)) {
            if (this.state.vertifyCodeTime <= 0){
                SMSTool.sendVerificationCode(SMSTool.SMSType.OldPhoneType, oldNum).then((data) => {
                    (new TimeDownUtils()).startDown((time) => {
                        this.setState({
                            vertifyCodeTime: time,
                            isSend: true
                        });
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

    _toNext = (oldNum) => {
        if (this.isLoadding === true) {
            return;
        }
        // 调用接口验证验证码是否正确，正确next
        if (StringUtils.isEmpty(this.state.code)) {
            bridge.$toast('验证码不能为空');
            return;
        }
        this.isLoadding = true;
        MineAPI.judgeCode({
            verificationCode: this.state.code,
            phone: oldNum
        }).then((data) => {
            this.isLoadding = false;
            this.$navigate('mine/account/SetNewPhoneNumPage', {
                oldNum: oldNum,
                oldCode: this.state.code
            });
        }).catch((data) => {
            this.isLoadding = false;
            // if (data.code === 10003){
            //     this.setState({tip: '验证码错误，请重新输入'})
            // }
            bridge.$toast(data.msg);
        });
    };
}
