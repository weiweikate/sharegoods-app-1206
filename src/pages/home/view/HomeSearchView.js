/*
* 首页查询
*/

import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import UIText from '../../../components/ui/UIText';
import res from '../res/index';
import { observer } from 'mobx-react';
import { routePush } from '../../../navigation/RouterMap';
import StringUtils from '../../../utils/StringUtils';
import { homeModule } from '../model/Modules';
import DesignRule from '../../../constants/DesignRule';
import user from '../../../model/user';
import bridge from '../../../utils/bridge';

const { px2dp, statusBarHeight, headerHeight } = ScreenUtils;

const searchImg = res.icon_search;

@observer
export default class HomeSearchView extends Component {

    _jumpPage(data) {
        if (!data) {
            bridge.$toast('获取数据失败！');
            return;
        }
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        const params = homeModule.paramsNavigate(data);
        routePush(router, { ...params });
    }

    render() {
        const resLogo = StringUtils.isEmpty(homeModule.titleImg)
            ? res.home_icon_logo_red : res.home_icon_logo_white;
        const resDou = StringUtils.isEmpty(homeModule.douData.icon)
            ? res.dou_red : { uri: homeModule.douData.icon };
        const colorDou = StringUtils.isEmpty(homeModule.titleImg) ? DesignRule.mainColor : '#fff';
        const colorIput = StringUtils.isEmpty(homeModule.titleImg) ? DesignRule.textColor_placeholder : '#fff';
        return (
            <View style={styles.navBar}>
                <View style={styles.navContent}>
                    <Image source={resLogo}
                           style={styles.logo}/>
                    <TouchableOpacity
                        onPress={() => {
                            routePush('home/search/SearchPage');
                        }}
                        activeOpacity={0.8}
                        style={{ flex: 1 }}>
                        <View style={[styles.searchBox, { backgroundColor: '#F2F2F2' }]}>
                            <Image source={searchImg} style={styles.searchIcon}/>
                            <UIText style={[styles.inputText, { color: colorIput }]} value={'请输入关键词'}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this._jumpPage(homeModule.douData)}>
                        <Image source={resDou}
                               style={styles.dou}/>
                    </TouchableOpacity>
                    <UIText style={[styles.douText, { color: colorDou }]}
                            value={(user.isLogin ? 1234 : '我的') + '秀豆'}/>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    navBar: {
        flexDirection: 'column',
        height: headerHeight,
        zIndex: 5
    },
    navContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        paddingTop: statusBarHeight,
        marginHorizontal: px2dp(15)
    },
    logo: {
        height: 22,
        width: 30
    },
    dou: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    douText: {
        fontSize: 14,
        marginLeft: 5,
        fontWeight: 'bold'
    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        borderRadius: 15,  // 设置圆角边
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px2dp(10),
        opacity: 0.6
    },
    msgIcon: {
        height: 24,
        width: 24
    },
    searchIcon: {
        marginRight: 8,
        width: 16,
        height: 16
    },
    inputText: {
        fontSize: px2dp(12)
    }
});
