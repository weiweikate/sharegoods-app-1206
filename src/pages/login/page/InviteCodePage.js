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
    TextInput,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import UIText from '../../../comm/components/UIText';
import LoginAPI from '../api/LoginApi';
import { NavigationActions } from 'react-navigation';


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
                <View
                    style={{
                        backgroundColor: '#fff',
                        marginLeft: 10,
                        width: ScreenUtils.width - 20,
                        // justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50,
                        marginTop: 30
                    }}>
                    <UIText
                        style={{
                            marginLeft: 15
                        }}
                        value={'授权码录入'}
                    />

                    <TextInput
                        style={styles.inputTextStyle}
                        value={this.inviteModel.inviteCode}
                        onChangeText={text => this.inviteModel.saveInviteCode(text)}
                        placeholder='请输入邀请人授权码'
                        underlineColorAndroid={'transparent'}
                        // keyboardType='numeric'
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
                                backgroundColor: 'red',
                                width: 300,
                                height: 50,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center'

                            },
                                this.inviteModel.isCanClick ? {
                                        backgroundColor: 'red'
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


            </View>
        );

    }

//    action
    sureAction = () => {

        this.$loadingShow();
        if (this.inviteModel.isCanClick) {
            LoginAPI.updateUserCodeById(
                {
                    upCode: this.inviteModel.inviteCode
                }
            ).then(result => {
                this.$loadingDismiss();
                let resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }).catch(reason => {
                this.$loadingDismiss();
                this.$toastShow(reason.msg);
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
        backgroundColor: 'red'
    }

});
