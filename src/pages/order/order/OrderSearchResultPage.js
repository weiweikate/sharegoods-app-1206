import React from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import MyOrdersListView from './../components/MyOrdersListView';
import DesignRule from '../../../constants/DesignRule';
import MineApi from '../../mine/api/MineApi';
import StringUtils from '../../../utils/StringUtils';

export default class OrderSearchResultPage extends BasePage {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            keyWord: this.props.navigation.state.params.keyWord,
            cancelReasons: []
        };
    }

    $navigationBarOptions = {
        title: '搜索结果',
        show: true// false则隐藏导航
    }

    $isMonitorNetworkStatus() {
        return true;
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
            <View style={styles.container}>
                {this.renderWideLine()}
                <MyOrdersListView
                    nav={this.$navigate}
                    keywords={this.state.keyWord}
                    navigation={this.props.navigation}
                    cancelReasons={this.state.cancelReasons}
                />
            </View>
        );
    }

    renderWideLine = () => {
        return (
            <View style={styles.wideStyle}/>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    wideStyle: {
        height: 10,
        backgroundColor: DesignRule.bgColor
    }
});

