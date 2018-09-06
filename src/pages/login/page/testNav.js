import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

export default class testNav extends Component {

    /*页面配置*/
    static $PageOptions = {
        navigationBarOptions: {
            title: null
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: false
    };

    constructor(props) {
        super(props);
        this.state = {
            test: '200'
        };
    }

    render() {
        return (
            <View>
                <Text onPress={() => {
                    this.setState({ test: 300 });
                }}>
                    {this.state.test}
                </Text>
            </View>
        );
    }
}

