/**
 * Created by zhanglei on 2018/6/19.
 */
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import { color } from '../../../constants/Theme';
import MyOrdersListView from './../components/MyOrdersListView';

class OrderSearchResultPage extends BasePage {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            keyWord: this.props.navigation.state.params.keyWord
        };
    }

    $navigationBarOptions = {
        title: '搜索结果',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderWideLine()}
                <MyOrdersListView
                    nav={this.$navigate}
                    orderNum={this.state.keyWord}
                />
            </View>
        );
    }

    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    }
});

export default OrderSearchResultPage;
