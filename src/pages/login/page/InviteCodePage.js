/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by feng on 2018/11/3.
 *
 */


'use strict';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import UIText from '../../../components/ui/UIText';
import LoginAPI from '../api/LoginApi';
// import { NavigationActions } from 'react-navigation';
import bridge from '../../../utils/bridge';
import {MRText as Text, MRTextInput as TextInput} from '../../../components/ui'
import { homeRegisterFirstManager } from '../../home/model/HomeRegisterFirstManager';

class inviteModel {
    /*0代表验证码登录 1代表密码登录*/
    @observable
    inviteCode = '';

    @action
    saveInviteCode(code) {
        this.inviteCode = code;
    }

    @computed
    get isCanClick() {
        if (this.inviteCode.length > 3) {
            return true;
        } else {
            return false;
        }
    }

}

@observer
export default class  extends BasePage {

    inviteModel = new inviteModel();

    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: '授权码录入',
        show: true// false则隐藏导航
    };

    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
    };

    jump = () => {
        bridge.$toast("注册成功")
        LoginAPI.givePackage().then(result => {
            homeRegisterFirstManager.setShowRegisterModalUrl(result.data.give);
            this.$navigateBackToHome();
        }).catch(error => {
            this.$navigateBackToHome();
        });
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={[
                DesignRule.style_container
                , styles.contentStyle

            ]}>
                <UIText
                    value={'授权码录入'}
                    style={{
                        marginTop: 20,
                        width: ScreenUtils.width - 50
                    }}
                />
                <View
                    style={{
                        backgroundColor: '#fff',
                        marginLeft: 10,
                        width: ScreenUtils.width - 20,
                        // justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50,
                        marginTop: 20
                    }}>
                    {/*<UIText*/}
                    {/*style={{*/}
                    {/*marginLeft: 15*/}
                    {/*}}*/}
                    {/*value={'请输入邀请人授权码'}*/}
                    {/*/>*/}
                    <TextInput
                        style={styles.inputTextStyle}
                        value={this.inviteModel.inviteCode}
                        onChangeText={text => this.inviteModel.saveInviteCode(text)}
                        placeholder='请输入邀请人授权码'
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        this.sureAction();
                    }}
                >
                    <View
                        style={
                            [{
                                marginTop: 100,
                                backgroundColor: DesignRule.mainColor,
                                width: 300,
                                height: 50,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center'

                            },
                                this.inviteModel.isCanClick ? {
                                        backgroundColor: DesignRule.mainColor
                                    } :
                                    {
                                        backgroundColor: '#bbb'
                                    }
                            ]}
                    >
                        <UIText
                            value={'确定'}
                            style={{
                                color: '#fff',
                                fontSize: 17
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <UIText
                    value={'选择顾问'}
                    style={{
                        marginTop:20,
                        color: DesignRule.textColor_instruction,
                        fontSize: 12
                    }}
                    onPress={
                        ()=>{
                            this.$navigateBack()
                        }
                    }

                />
            </View>
        );

    }

    sureAction = () => {
        if (this.inviteModel.isCanClick) {
            this.$loadingShow();
            LoginAPI.mentorBind({
                code: this.inviteModel.inviteCode
            }).then(res => {
                this.$loadingDismiss();
                bridge.$toast('注册成功');
                homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
                this.$navigateBackToHome();
            }).catch(res => {
                this.$loadingDismiss();
                bridge.$toast(res.msg);
            });
        }
    };
}

const styles = StyleSheet.create({
    contentStyle: {
        alignItems: 'center',
        flexDirection: 'column'
    },

    inputTextStyle: {
        marginLeft: 15,
        width: 150

    },
    bottomBtnStyle: {
        width: 200,
        height: 60,
        backgroundColor: DesignRule.mainColor
    },
    rightTopTitleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    }

});
