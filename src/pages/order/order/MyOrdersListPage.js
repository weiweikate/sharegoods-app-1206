import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
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
            // number: this.params.pageParams.number,
            states: {},
            selectTab: 10
        };
    }

    $navigationBarOptions = {
        title: '我的订单',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    $getPageStateOptions = () => {
        return {
            loadingState: 'success',
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.gotoSearchPage}>
                <Image source={search}/>
            </TouchableOpacity>
        );
    };

    gotoSearchPage = () => {
        this.$navigate('order/order/SearchPage', { keyWord: 'kafaka' });
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={{
                        width: ScreenUtils.width,
                        justifyContent: 'center',
                        height: 60
                    }}
                    //进界面的时候打算进第几个
                    initialPage={parseInt(this.state.index)}
                    tabBarBackgroundColor='white'
                    tabBarActiveTextColor={DesignRule.mainColor}
                    tabBarInactiveTextColor={DesignRule.textColor_instruction}
                    tabBarTextStyle={{ fontSize: 15 }}
                    tabBarUnderlineStyle={{ backgroundColor: DesignRule.mainColor, height: 2 }}
                    renderTabBar={() => (
                        this.renterTabBar()
                    )}>
                    <MyOrdersListView
                        tabLabel={'全部'} pageStatus={0} nav={this.$navigate}
                        selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={'待付款'} pageStatus={1}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={'待发货'} pageStatus={2}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={'待收货'} pageStatus={3}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={'已完成'} pageStatus={4}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>

                </ScrollableTabView>
            </View>
        );
    }

    renterTabBar = () => {
        return (
            <ScrollableTabBar
                style={{
                    borderWidth: 0.5

                }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ flex: 0.5, height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: ScreenUtils.safeBottom
    }
});

export default MyOrdersListPage;
