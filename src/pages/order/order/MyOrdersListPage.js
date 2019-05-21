import React from 'react';
import { StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import MyOrdersListView from './../components/MyOrdersListView';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import MineApi from '../../mine/api/MineApi';
import StringUtils from '../../../utils/StringUtils';

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
        let index = this.params.index ? this.params.index : 0;
        this.state = {
            index: index,    //默认第一页
            selectTab: index,//当前选中的
            cancelReasons: []
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

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    componentDidMount() {
        //接收刷新的通知
        this.listener = DeviceEventEmitter.addListener('REFRESH_ORDER', ()=> {
            this.reLoads && this.reLoads.onRefresh();
        })
        this.getCancelReasons();

    }
    //获取取消订单理由
    getCancelReasons = () => {
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(resp => {
            if (resp.code === 10000 && StringUtils.isNoEmpty(resp.data)) {
                let arrs = resp.data.map((item) => {
                    return item.value
                });
                this.setState({
                    cancelReasons: arrs
                });
            }
        })
    }

    _render() {
        return (
            <ScrollableTabView
                onChangeTab={(obj) => {
                    this.setState({ selectTab: obj.i });
                }}
                style={styles.container}
                scrollWithoutAnimation={true}
                renderTabBar={this._renderTabBar}
                //进界面的时候打算进第几个
                initialPage={parseInt(this.state.index)}>
                {
                    ['全部', '待付款', '待发货', '待收货','待晒单'].map((item, index) => {
                        return  <MyOrdersListView
                            tabLabel = {item}
                            pageStatus = {index}
                            selectTab = {this.state.selectTab}
                            ref = {(e) => this.reLoads = e}
                            nav = {this.$navigate}
                            navigation = {this.props.navigation}
                            cancelReasons = {this.state.cancelReasons}
                        />
                    })
                }
            </ScrollableTabView>
        );
    }

    _renderTabBar = () => {
        return <DefaultTabBar
            backgroundColor = {'white'}
            activeTextColor = {DesignRule.mainColor}
            inactiveTextColor = {DesignRule.textColor_instruction}
            textStyle = {styles.tabBarText}
            underlineStyle = {styles.tabBarUnderline}
            style = {styles.tabBar}
            tabStyle = {styles.tab}
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
