/*
* 首页查询
*/

import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';

const { px2dp, statusBarHeight, headerHeight } = ScreenUtils;
import UIText from '../../../components/ui/UIText';
import DesignRule from '../../../constants/DesignRule';
import User from '../../../model/user';
import res from '../res/index';

const logoRed = res.home_icon_logo_red;
const searchImg = res.icon_search;
const messageImg = res.message;

export default ({ navigation, hasMessage }) =>
    <View style={styles.navBar}>
        <View style={styles.navContent}>
            <Image source={logoRed} style={styles.logo}/>
            <TouchableWithoutFeedback onPress={() => {
                navigation('home/search/SearchPage');
            }}>
                <View style={[styles.searchBox, { backgroundColor: '#F2F2F2' }]}>
                    <Image source={searchImg} style={styles.searchIcon}/>
                    <UIText style={styles.inputText} value={'请输入关键词搜索'}/>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                if (!User.isLogin) {
                    navigation('login/login/LoginPage');
                    return;
                }
                navigation('message/MessageCenterPage');
            }}>
                <View style={{ height: 32, width: 32, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={messageImg} style={styles.msgIcon}/>
                    {hasMessage ? <View style={{
                        width: 10,
                        height: 10,
                        backgroundColor: DesignRule.mainColor,
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        borderRadius: 5
                    }}/> : null}
                </View>
            </TouchableWithoutFeedback>
        </View>
    </View>

let styles = StyleSheet.create({
    navBar: {
        flexDirection: 'column',
        height: headerHeight - (ScreenUtils.isIOSX ? 10 : 0),
        backgroundColor: 'white'
    },
    navContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        paddingTop: statusBarHeight - (ScreenUtils.isIOSX ? 10 : 0),
        marginLeft: px2dp(15),
        marginRight: px2dp(11)
    },
    logo: {
        height: 22,
        width: 30
    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        flex: 1,  // 类似于android中的layout_weight,设置为1即自动拉伸填充
        borderRadius: 15,  // 设置圆角边
        alignItems: 'center',
        marginLeft: px2dp(10),
        marginRight: px2dp(5),
        opacity: 0.8
    },
    msgIcon: {
        height: 24,
        width: 24
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 16,
        height: 16
    },
    inputText: {
        flex: 1,
        color: DesignRule.textColor_placeholder,
        fontSize: px2dp(12)
    }
});
