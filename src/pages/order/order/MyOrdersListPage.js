import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import MyOrdersListView from './../components/MyOrdersListView';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';

const { search } = res;

/**
 * @author chenxiang
 * @date on 2018/9/7
 * @describe 订单列表
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */

class MyOrdersListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            index: this.params.index ? this.params.index : 0,
            key: 1,
            selectTab:10
        };
    }

    $navigationBarOptions = {
        title: '我的订单',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.gotoSearchPage}>
                <Image source={search}/>
            </TouchableOpacity>
        );
    };

    gotoSearchPage = () => {
        this.$navigate('order/order/SearchPage');
    };

    _render() {
        return (
            <ScrollableTabView
                onChangeTab={(obj) => {
                    this.setState({ selectTab: obj.i });
                }}
                style={styles.container}
                renderTabBar={this._renderTabBar}
                //进界面的时候打算进第几个
                initialPage={parseInt(this.state.index)}>
                <MyOrdersListView
                    tabLabel={'全部'} pageStatus={0} selectTab={this.state.selectTab}
                    nav={this.$navigate}/>
                <MyOrdersListView
                    tabLabel={'待付款'} pageStatus={1} selectTab={this.state.selectTab}
                    nav={this.$navigate}/>
                <MyOrdersListView
                    tabLabel={'待发货'} pageStatus={2} selectTab={this.state.selectTab}
                    nav={this.$navigate}/>
                <MyOrdersListView
                    tabLabel={'待收货'} pageStatus={3} selectTab={this.state.selectTab}
                    nav={this.$navigate}/>
                <MyOrdersListView
                    tabLabel={'已完成'} pageStatus={4} selectTab={this.state.selectTab}
                    nav={this.$navigate}/>

            </ScrollableTabView>
        );
    }

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
        marginBottom: ScreenUtils.safeBottom
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
        fontSize: 15
    },
    tabBarUnderline: {
        width: 45,
        height: 2,
        marginHorizontal: (ScreenUtils.width - 45 * 5) / 10,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 1
    }
});

export default MyOrdersListPage;
