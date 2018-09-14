import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert

} from 'react-native';

import React, { Component } from 'react';

import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import ColorUtil from '../../../utils/ColorUtil';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';

class CommModel {

    //0代表注册,1代表设置账号密码 2忘记密码
    @observable
    viewType = 0;
    @observable
    phoneNumber = '';
    @observable
    vertifyCode = '';
    @observable
    password = '';
    @observable
    dowTime = 0;
    @observable
    isSecuret = true;
    @observable
    isSelectProtocl=true;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            this.phoneNumber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = '';
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            this.vertifyCode = '';
            return;
        }
        this.vertifyCode = vertifyCode;
    }


    @computed
    get isCanClick() {
        if (this.phoneNumber.length === 11 && this.vertifyCode.length > 0 && this.password.length >= 6 && this.isSelectProtocl) {
            return true;
        } else {
            return false;
        }
    }

}

@observer
export default class CommRegistView extends Component {
    registModel = new CommModel();

    constructor(props) {
        super(props);
        this.state = {
            viewType: props.viewType
        };
    }
    changeSelectState(){
        this.registModel.isSelectProtocl = !this.registModel.isSelectProtocl;
    }
    render() {
        return (
            <View style={{ backgroundColor: ColorUtil.Color_f7f7f7 }}>
                <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                    <View style={{
                        marginLeft: 30,
                        marginRight: 20,
                        marginTop: 60,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{ marginRight: 20 }}>
                            手机号
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.registModel.phoneNumber}
                            onChangeText={text => {
                                this.registModel.savePhoneNumber(text);
                            }}
                            placeholder='请输入手机号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />

                    </View>
                    <CommSpaceLine style={[Styles.lineStyle, { marginLeft: 30, marginRight: 30 }]}/>


                    <View style={{ marginTop: 20, height: 40, marginLeft: 30, marginRight: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 20 }}>
                                    验证码
                                </Text>
                                <TextInput
                                    style={Styles.inputTextStyle}
                                    value={this.registModel.vertifyCode}
                                    onChangeText={text => {
                                        this.registModel.saveVertifyCode(text);
                                    }}
                                    placeholder='请输入验证码'
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='default'

                                />
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.getVertifyCode();
                            }}>
                                <Text style={{ color: ColorUtil.mainRedColor }}>
                                    {this.registModel.dowTime > 0 ? `${this.registModel.dowTime}秒后重新获取` : '获取验证码'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*下部输入框*/}
                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    height: 50,
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 30, marginRight: 30 }}>
                            新密码
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.registModel.password}
                            onChangeText={text => {
                                this.registModel.savePassword(text);
                            }}
                            placeholder='支持数字,字母'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                            secureTextEntry={this.registModel.isSecuret}
                        />
                    </View>

                    <TouchableOpacity onPress={() => {
                        this.registModel.isSecuret = !this.registModel.isSecuret;
                    }}>
                        <Image
                            source={this.registModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}
                            style={{ marginRight: 30, marginTop: 18 }}/>

                    </TouchableOpacity>

                </View>

                <View style={
                    [{
                        marginRight: 30,
                        marginLeft: 30,
                        marginTop: 40,
                        height: 45,
                        backgroundColor: ColorUtil.mainRedColor,
                        borderRadius: 5
                    },
                        this.registModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }]
                }>
                    <TouchableOpacity onPress={this.loginClick}>
                        <Text style={{
                            textAlign: 'center',
                            height: 45,
                            alignItems: 'center',
                            fontSize: 14,
                            color: '#fff',
                            paddingTop: 15,
                            fontWeight: '600'
                        }}>

                            {this.state.viewType ? '完成' : '下一步'}
                        </Text>
                    </TouchableOpacity>
                </View>



            </View>
        );
    }

    /*获取验证码*/
    getVertifyCode = () => {
        if (this.registModel.dowTime > 0) {
            Alert.alert(
                '提示',
                '操作过于频繁稍后重试',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (StringUtils.checkPhone(this.registModel.phoneNumber)) {
            (new TimeDownUtils()).startDown((time) => {
                this.registModel.dowTime = time;
            });
            bridge.$toast('验证码已发送请注意查收');
        } else {
            bridge.$toast('手机格式不对');
        }
    };

    loginClick = () => {
        this.props.loginClick(this.registModel.phoneNumber, this.registModel.vertifyCode, this.registModel.password);
    };
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: '#fff'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        otherLoginBgStyle: {
            marginBottom: -20,
            height: 200

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        lineStyle: {
            marginTop: 5

        },
        inputTextStyle: {
            marginLeft: 20,
            width: 120,
            fontSize: 14,
            fontWeight: '400'
        }
    }
);
