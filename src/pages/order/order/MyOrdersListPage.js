import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import MyOrdersListView from './../components/MyOrdersListView';
import ScreenUtils from '../../../utils/ScreenUtils';
import search from '../res/search.png';
import { color } from '../../../constants/Theme';

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
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor='#D51243'
                    tabBarInactiveTextColor='#999999'
                    tabBarTextStyle={{ fontSize: 15 }}
                    tabBarUnderlineStyle={{ backgroundColor: '#D51243', height: 2 }}
                    renderTabBar={() => (
                        this.renterTabBar()
                    )}>
                    <MyOrdersListView
                        tabLabel={'全部'} pageStatus={0} nav={this.props.navigation.navigate}
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
            <View style={{ flex: 0.5, height: 10, backgroundColor: color.page_background }}/>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginBottom: ScreenUtils.safeBottom
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        fontSize: 28
    },
    circle: {
        marginRight: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        backgroundColor: '#EB2224',
        borderColor: '#EB2224',
        borderStyle: 'dotted',
        borderRadius: 15
    }
});

export default MyOrdersListPage;
