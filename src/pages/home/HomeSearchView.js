/*
* 首页查询
*/

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp, statusBarHeight } = ScreenUtils;
import logoRed from './res/home_icon_logo_red.png';
import logoWhite from './res/home_icon_logo_white.png';
import searchImg from './res/icon_search.png';
import msgBlack from './res/message_black.png';
import msgWhite from './res/message_white.png';
import UIText from '../../components/ui/UIText';

export default ({ navigation, whiteIcon }) =>
    <View style={styles.navBar}>
        <View style={styles.navContent}>
            <Image source={whiteIcon ? logoWhite : logoRed} style={styles.logo}/>
            <TouchableOpacity style={[styles.searchBox, { backgroundColor: whiteIcon ? 'white' : '#E4E5E6' }]}
                              onPress={() => navigation.navigate('home/search/SearchPage')}>
                <Image source={searchImg} style={styles.searchIcon}/>
                <UIText style={styles.inputText} value={'请输入关键词搜索'}/>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('message/MessageCenterPage')}>
                <Image source={whiteIcon ? msgWhite : msgBlack} style={styles.scanIcon}/>
            </TouchableWithoutFeedback>
        </View>
        {
            whiteIcon ? null :
                <View style={{ height: 0.5, backgroundColor: '#eee' }}/>}
    </View>

let styles = StyleSheet.create({
    navBar: {
        flexDirection: 'column',
        height: statusBarHeight + 44,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 4
    },
    navContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        paddingTop: statusBarHeight,
        marginLeft: px2dp(15),
        marginRight: px2dp(15)
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
        marginLeft: 8,
        marginRight: 10,
        opacity: 0.8
    },
    scanIcon: {
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
        color: '#666666',
        fontSize: 14
    }
});
