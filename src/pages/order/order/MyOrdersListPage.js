import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import MyOrdersListView from './../components/MyOrdersListView';
import ScreenUtils from '../../../utils/ScreenUtils';
import search from '../res/search.png';
import { color } from '../../../constants/Theme';

class MyOrdersListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.navigation.state.params.index ? this.props.navigation.state.params.index : 0,
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

    loadPageData() {
        //网络请求，业务处理
    }

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
                    style={{ width: ScreenUtils.width, justifyContent: 'center', height: 60 }}
                    //进界面的时候打算进第几个
                    initialPage={parseInt(this.state.index)}
                    tabBarActiveTextColor='red'
                    tabBarTextStyle={{ fontSize: 30, color: 'white' }}

                    renderTabBar={() => (
                        this.renterTabBar()
                    )}>
                    <MyOrdersListView
                        tabLabel={{ label: '全部' }} pageStatus={0} nav={this.$navigate}
                        selectTab={this.state.selectTab}/>

                    <MyOrdersListView
                        tabLabel={{ label: '待支付', badge: this.state.states.toBePaid }} pageStatus={1}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={{ label: '待发货', badge: this.state.states.toBePaid }} pageStatus={2}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={{ label: '待收货', badge: this.state.states.toBePaid }} pageStatus={3}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>
                    <MyOrdersListView
                        tabLabel={{ label: '已完成', badge: this.state.states.toBePaid }} pageStatus={4}
                        nav={this.$navigate}
                        onLoadTabNumber={this.getStatesNumber} selectTab={this.state.selectTab}/>

                </ScrollableTabView>
            </View>
        );
    }

    renterTabBar = () => {
        return (
            <TabBar
                underlineColor='red'
                backgroundColor='white'
                tabMargin={35}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderWidth: 0.5
                }}/>

        );
    };
    renderWideLine = () => {
        return (
            <View style={{ flex: 1, height: 10, backgroundColor: color.page_background }}/>
        );
    };
    renderModal = () => {
        return (
            <View>
                {/*页面显示弹窗*/}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'

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
