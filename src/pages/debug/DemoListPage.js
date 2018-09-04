import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import API from "../../api/index";


export default class DemoListPage extends Component {

    // 页面配置
    static jrPageOptions = {
        navigationBarOptions: {
            title: 'demo',
        }
    };

    /*jr_getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    console.log('reloadBtnClick');
                },
            }
        };
    };*/

    constructor(props) {
        super(props);
        this.state = {
            total: 0,//团队总人数
            noLogin: 0,//长期未登录人数
            overLevel: 0,//等级超过我的人数
            direct: 0,//直接邀请人数
            levelList: [],
            leftWidth: 30,

            loadingState: '',
            refreshing: false,
            netFailedInfo: null,
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text>111</Text>
                </View>
            </ScrollView>
        );
    }

    loadPageData = () => {
        API.apiDemoList({a:1}).then(result => {
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
