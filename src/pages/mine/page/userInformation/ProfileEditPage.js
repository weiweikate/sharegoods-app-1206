/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/11/28.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';
import user from '../../../../model/user';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui';

const { px2dp } = ScreenUtils;
export default class ProfileEditPage extends BasePage {
    constructor(props) {
        super(props);
        this.commiting = false;
        this.state = {
            textNum: user.profile ? user.profile.length : 0,
            profile: user.profile
        };
    }

    $navigationBarOptions = {
        title: '编辑简介',
        show: true// false则隐藏导航
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._commitProfile();
            }}>
                <Text style={styles.navRightItemStyle}>
                    完成
                </Text>
            </TouchableWithoutFeedback>
        );
    };


    _commitProfile = () => {
        if(this.commiting){
            return;
        }
        this.commiting = true;
        MineAPI.updateUserById({ type: 6, profile: this.state.profile }).then((resp) => {
            this.$toastShow('编辑成功!');
            this.$navigateBack();
            this.commiting = false;
            MineAPI.getUser().then(res => {
                let data = res.data;
                user.saveUserInfo(data);
            }).catch(err => {
            });
        }).catch((error) => {
            this.commiting = false;
            this.$toastShow(error.msg);
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <Text style={styles.tipTextStyle}>
                    请填写您的介绍
                </Text>
                <View style={{
                    backgroundColor: DesignRule.white
                }}>
                    <TextInput style={styles.textInputStyle}
                               maxLength={90}
                               multiline={true}
                               value={this.state.profile}
                               onChangeText={(text) => {
                                   if (text) {
                                       this.setState({
                                           textNum: text.length,
                                           profile: text
                                       });
                                   } else {
                                       this.setState({
                                           textNum: 0,
                                           profile: null
                                       });
                                   }
                               }}
                    />
                    <Text style={styles.textLimitStyle}>
                        {`${this.state.textNum}/90`}
                    </Text>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navRightItemStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_threeTitle
    },
    tipTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24,
        includeFontPadding: false,
        marginVertical: px2dp(10),
        marginLeft: DesignRule.margin_page
    },
    textInputStyle: {
        height: px2dp(133),
        width: ScreenUtils.width,
        padding: DesignRule.margin_page,
        textAlignVertical: 'top'
    },
    textLimitStyle: {
        position: 'absolute',
        bottom: DesignRule.margin_page,
        right: DesignRule.margin_page
    }
});
