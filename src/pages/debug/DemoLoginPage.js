import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import API from "../../api/index";


export default class DemoLoginPage extends Component {

    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: '登录',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: '',
            refreshing: false,
            netFailedInfo: null,
        };
    }

    componentDidMount() {
        console.log('DemoLoginPage');
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text onPress={this.login}>点击登录</Text>
                    <Text onPress={this.goBack}>返回</Text>
                </View>
            </ScrollView>
        );
    }

    goBack = () => {
        this.$navigateBack();
    };
    login = () => {
        API.apiDemoList({a: 1}).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('catch error', error);
        });

        API.apiDemoList({a: 1}).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('catch error', error);
        });
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
