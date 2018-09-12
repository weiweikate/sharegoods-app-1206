import React, { Component } from 'react';
import {
    Text, View, ScrollView, TouchableHighlight, StyleSheet
} from 'react-native';


const DemoList = [
    {
        title: '登录页面',
        uri: 'login/login/LoginPage'
    },
    {
        title: '我的订单',
        uri: 'order/order/MyOrdersListPage',
        params: {
            index: 0
        }
    },
    {
        title: '搜索页面',
        uri: 'home/search/SearchPage'
    }
];
export default class HomePage extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ height: 80 }}></View>
                {
                    DemoList.map(item => {
                        const { title, uri, params } = item;
                        return (
                            <View key={title} style={styles.rowCell}>
                                <TouchableHighlight
                                    style={{ flex: 1 }}
                                    underlayColor="#e6e6e6"
                                    onPress={() => {
                                        this.redirect(uri, params);
                                    }}
                                >
                                    <View style={styles.eventRowsContainer}>
                                        <Text style={{ color: '#474747' }}>{title}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        );
                    })
                }
            </ScrollView>

        );
    }


    redirect = (uri, params) => {
        this.props.navigation.navigate(uri, params || {});
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    // 行样式
    rowCell: {
        paddingLeft: 10,
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        borderBottomColor: '#dedede'
    }
});
