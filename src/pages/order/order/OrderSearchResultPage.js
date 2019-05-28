import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import MyOrdersListView from './../components/MyOrdersListView';
import DesignRule from '../../../constants/DesignRule';

export default class OrderSearchResultPage extends BasePage {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            keyWord: this.props.navigation.state.params.keyWord
        };
    }

    $navigationBarOptions = {
        title: '搜索结果',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    _render() {
        return (
            <View style={styles.container}>
                {this.renderWideLine()}
                <MyOrdersListView
                    nav={this.$navigate}
                    orderNum={this.state.keyWord}
                    navigation={this.props.navigation}
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

