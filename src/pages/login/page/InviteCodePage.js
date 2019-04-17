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


"use strict";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";
import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import BasePage from "../../../BasePage";
import DesignRule from "../../../constants/DesignRule";
import ScreenUtils from "../../../utils/ScreenUtils";
import UIText from "../../../components/ui/UIText";
import LoginAPI from "../api/LoginApi";
import bridge from "../../../utils/bridge";
import { MRTextInput as TextInput } from "../../../components/ui";
import { homeRegisterFirstManager } from "../../home/manager/HomeRegisterFirstManager";
import RouterMap from "../../../navigation/RouterMap";

class inviteModel {
    /*0代表验证码登录 1代表密码登录*/
    @observable
    inviteCode = "";

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
export default class InviteCodePage extends BasePage {

    inviteModel = new inviteModel();

    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: "",
        show: true,// false则隐藏导航
        leftNavItemHidden:true,
    };
    _jump = () => {
        bridge.$toast("注册成功");
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
            <View style={styles.mainBgStyle}>
                <View style={styles.contentStyle}>
                    <UIText
                        value={"填输入会员号"}
                        style={{
                            marginTop: 80,
                            fontSize: 23
                        }}
                    />
                    <TextInput
                        style={styles.inputTextStyle}
                        value={this.inviteModel.inviteCode}
                        onChangeText={text => this.inviteModel.saveInviteCode(text)}
                        placeholder='请输入邀请人会员号'
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                    <View style={styles.inputTextBottomLine}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            this.sureAction();

                        }}
                    >
                        <View
                            style={
                                [
                                    styles.sureBtnStyle,
                                    this.inviteModel.isCanClick ? {
                                            backgroundColor: DesignRule.mainColor
                                        } :
                                        {
                                            backgroundColor: "#bbb"
                                        }
                                ]}
                        >
                            <UIText
                                value={"确定"}
                                style={{
                                    color: "#fff",
                                    fontSize: 17
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContentStyle}>
                    <TouchableOpacity
                    onPress={()=>{this.$navigate(RouterMap.SelectMentorPage);}}
                    >
                        <View
                            style={styles.selectMentorBgStyle}
                        >
                            <UIText
                                value={"秀购为您推荐顾问"}
                                style={{
                                    color: DesignRule.textColor_instruction,
                                    fontSize: 13
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <UIText
                        value={"跳过"}
                        style={{
                            marginTop: ScreenUtils.px2dp(10),
                            color: DesignRule.textColor_instruction,
                            fontSize: 12
                        }}
                        onPress={
                            () => {
                                this._jump();
                            }
                        }
                    />
                </View>
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
                bridge.$toast("注册成功");
                homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
                this.$navigateBackToHome();
            }).catch(res => {
                this.$loadingDismiss();
                bridge.$toast(res.msg);
            });
        }
    };
}
const { px2dp } = ScreenUtils;
const styles = StyleSheet.create({
    mainBgStyle: {
        marginTop: px2dp(-3),
        backgroundColor: DesignRule.bgColor,
        justifyContent: "space-between",
        flexDirection: "column",
        flex: 1
    },
    contentStyle: {
        alignItems: "center",
        flexDirection: "column",
        flex: 1
    },
    inputTextStyle: {
        marginTop: px2dp(70),
        width: ScreenUtils.width - px2dp(80),
        paddingBottom: px2dp(7)
    },
    inputTextBottomLine: {
        height: 1,
        // marginTop: px2dp(5),
        width: ScreenUtils.width - px2dp(70),
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    bottomBtnStyle: {
        width: 200,
        height: 60,
        backgroundColor: DesignRule.mainColor
    },
    sureBtnStyle: {
        marginTop: px2dp(100),
        backgroundColor: DesignRule.mainColor,
        width: ScreenUtils.width - px2dp(60),
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomContentStyle: {
        height: ScreenUtils.px2dp(130),
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
    },
    selectMentorBgStyle: {
        borderRadius: 20,
        borderColor: DesignRule.textColor_placeholder,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        height: ScreenUtils.px2dp(40),
        width: ScreenUtils.width - 60
    }
});
