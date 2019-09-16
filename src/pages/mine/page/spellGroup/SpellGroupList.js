/**
 * @author zhoujianxin
 * @date on 2019/9/2.
 * @desc 拼团页列表
 * @org www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';
import res from '../../res';
import SpellGroupView from './components/SpellGroupView'
import { observer } from 'mobx-react';
import TimeModel from '../../model/TimeModel';
import user from '../../../../model/user';
import RouterMap from '../../../../navigation/RouterMap';
import {track, trackEvent} from '../../../../utils/SensorsTrack';

@observer
export default class SpellGroupList extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            selectTab: 0,
        };
    }

    componentDidMount() {
        track(trackEvent.ViewMyGroupbuy);
        if(!user.isLogin){
            this.$navigate(RouterMap.LoginPage);
        }

    }

    componentWillUnmount() {
        TimeModel.stopSpellGroupTime()
    }

    _render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={styles.container}
                    scrollWithoutAnimation={false}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                    <SpellGroupView tabLabel={'全部'} title={'全部'} params={0} navigate={this.$navigate}/>
                    <SpellGroupView tabLabel={'拼团中'} title={'拼团中'} params={2} navigate={this.$navigate}/>
                    <SpellGroupView tabLabel={'拼团成功'} title={'拼团成功'} params={3} navigate={this.$navigate}/>
                    <SpellGroupView tabLabel={'拼团失败'} title={'拼团失败'} params={-1} navigate={this.$navigate}/>
                </ScrollableTabView>
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.headerWrapper}>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigateBack();
                }}>
                    <View style={{
                        paddingLeft: 5,
                        height: 40,
                        justifyContent: 'center',
                        flex: 1
                    }}>
                        <Image source={res.button.back_black}
                               style={{width: 30, height: 30}}/>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={{
                    color: DesignRule.textColor_mainTitle_222,
                    fontSize: 17,
                    includeFontPadding: false
                }}>
                    我的拼团
                </Text>

                <View style={[{flex: 1}]}/>
            </View>
        );
    };

    /**
    * @func
    * @param {currentItem | Object} 当前点击项
    * @return {Object}
    */
    _renderTabBar = () => {
        return <DefaultTabBar
            backgroundColor={'white'}
            activeTextColor={DesignRule.mainColor}
            inactiveTextColor={DesignRule.textColor_instruction}
            textStyle={styles.tabBarText}
            underlineStyle={styles.tabBarUnderline}
            style={styles.tabBar}
            tabStyle={styles.tab}
        />;
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerWrapper: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: ScreenUtils.statusBarHeight,
        height: 44,
    },
    tabBar: {
        width: ScreenUtils.width,
        height: 48,
        borderWidth: 0.5,
        borderColor: DesignRule.lineColor_inWhiteBg
    },
    tab: {
        paddingBottom: 0
    },
    tabBarText: {
        fontSize: 16
    },
    tabBarUnderline: {
        width: 48,
        height: 2,
        marginHorizontal: (ScreenUtils.width - 48 * 4) / 8,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 1
    },
});
