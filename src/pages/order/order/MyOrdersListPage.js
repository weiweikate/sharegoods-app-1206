import React from 'react';
import { DeviceEventEmitter, Image, StyleSheet, TouchableOpacity } from 'react-native';
import BasePage from '../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from '@mr/react-native-scrollable-tab-view';
import MyOrdersListView from './../components/MyOrdersListView';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import MineApi from '../../mine/api/MineApi';
import StringUtils from '../../../utils/StringUtils';
import RouterMap from '../../../navigation/RouterMap';

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
            cancelReasons: []
        };
        this.selectTab = index;
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
            <TouchableOpacity activeOpacity={0.7} onPress={this.gotoSearchPage}>
                <Image source={search} style={{ width: 22, height: 22, marginRight: 10 }}/>
            </TouchableOpacity>
        );
    };

    gotoSearchPage = () => {
        this.$navigate(RouterMap.SearchPageOrder);
    };

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    componentDidMount() {
        //接收刷新的通知
        this.listener = DeviceEventEmitter.addListener('REFRESH_ORDER', () => {
            setTimeout(() => {//后台接口异步，先等待1s刷新
                let ref = this['reLoads_' + this.selectTab];
                ref && ref.onRefresh();
            }, 1000);
        });
        this.getCancelReasons();

    }

    //获取取消订单理由
    getCancelReasons = () => {
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(resp => {
            if (resp.code === 10000 && StringUtils.isNoEmpty(resp.data)) {
                let arrs = resp.data.map((item) => {
                    return item.value;
                });
                this.setState({
                    cancelReasons: arrs
                });
            }
        });
    };

    _render() {
        return (
            <ScrollableTabView
                onChangeTab={(obj) => {
                    this.selectTab = obj.i;
                    let ref = this['reLoads_' + this.selectTab];
                    ref && ref.onRefresh();
                }}
                style={styles.container}
                scrollWithoutAnimation={true}
                renderTabBar={this._renderTabBar}
                //进界面的时候打算进第几个
                initialPage={parseInt(this.state.index)}>
                {
                    ['全部', '待付款', '待发货', '待收货', '待晒单'].map((item, index) => {
                        return <MyOrdersListView
                            tabLabel={item}
                            pageStatus={index}
                            ref={(e) => this['reLoads_' + index] = e}
                            nav={this.$navigate}
                            navigation={this.props.navigation}
                            cancelReasons={this.state.cancelReasons}
                        />;
                    })
                }
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
