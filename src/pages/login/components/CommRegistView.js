import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image

} from 'react-native';

import React, { Component } from 'react';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import SMSTool from '../../../utils/SMSTool';
import { netStatusTool } from '../../../api/network/NetStatusTool';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
const dismissKeyboard = require('dismissKeyboard');

const {
    close_eye,
    open_eye,
} = res;

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
    isSelectProtocl = true;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            this.phoneNumber = '';
            return;
        }

        if (0 <= parseInt(phoneNmber.charAt(phoneNmber.length - 1)) &&
            parseInt(phoneNmber.charAt(phoneNmber.length - 1)) <= 9) {
            this.phoneNumber = phoneNmber;
        }
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
        this.registModel.phoneNumber = this.props.phone || '';
    }

    changeSelectState() {
        this.registModel.isSelectProtocl = !this.registModel.isSelectProtocl;
    }

    render() {
        return (
            <View>
                <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                    <View style={{
                        marginLeft: 30,
                        marginRight: 20,
                        height: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 5
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
                            underlineColorAndroid='transparent'
                            keyboardType='numeric'
                        />

                    </View>
                    <CommSpaceLine style={[Styles.lineStyle, { marginLeft: 30, marginRight: 30 }]}/>

                    <View style={{ height: 50, marginLeft: 30, marginRight: 30 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flex: 1
                        }}>
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
                                    keyboardType='numeric'
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.getVertifyCode();
                                }}
                                activeOpacity={1}
                            >
                                <Text style={{ color: DesignRule.mainColor, fontSize: 13 }}>
                                    {this.registModel.dowTime > 0 ? `${this.registModel.dowTime}秒后重新获取` : '获取验证码'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*下部输入框*/}
                <View style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    backgroundColor: 'white',
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
                        dismissKeyboard();
                        this.registModel.isSecuret = !this.registModel.isSecuret;
                    }}>
                        <Image
                            source={this.registModel.isSecuret ? close_eye : open_eye}
                            style={{ marginRight: 30, marginTop: 18 }}/>

                    </TouchableOpacity>
                </View>
                <View style={
                    [{
                        marginRight: 30,
                        marginLeft: 30,
                        marginTop: 40,
                        height: 50,
                        borderRadius: 25
                    },
                        this.registModel.isCanClick ? { backgroundColor: DesignRule.mainColor } : { backgroundColor: DesignRule.bgColor_grayHeader }]
                }>
                    <TouchableOpacity
                        onPress={this.loginClick}
                        activeOpacity={this.registModel.isCanClick ? 0.6 : 1}

                    >
                        <Text style={{
                            textAlign: 'center',
                            height: 45,
                            alignItems: 'center',
                            fontSize: 17,
                            color: 'white',
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
            return;
        }
        if (!netStatusTool.isConnected) {
            bridge.$toast('请检测网络是否连接');
            this.registModel.dowTime = 0;
            return;
        }
        if (StringUtils.checkPhone(this.registModel.phoneNumber)) {
            this.registModel.dowTime = 60;
            bridge.$toast('验证码已发送请注意查收');
            (new TimeDownUtils()).startDown((time) => {
                this.registModel.dowTime = time;
            });
            // let SMSType = this.props.viewType === 1 ? SMSTool.OldPhoneType : SMSTool.RegType;
            SMSTool.sendVerificationCode(this.props.viewType === 1 ? 2 : 1, this.registModel.phoneNumber);
        } else {
            bridge.$toast('手机格式不对');
        }
    };
    loginClick = () => {
        if (this.registModel.isCanClick) {
            this.props.loginClick(this.registModel.phoneNumber, this.registModel.vertifyCode, this.registModel.password);
        }
    };


}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: 'white'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
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
            backgroundColor: 'white',
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
