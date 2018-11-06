/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import RouterMap from './navigation/RouterMap';
import user from '../src/model/user';
import DebugButton from './components/debug/DebugButton';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';
import appData from './model/appData';
import { netStatus } from './comm/components/NoNetHighComponent';
import signTestTool from './signTestTool';

import hotUpdateUtil from './utils/HotUpdateUtil'

import Navigator, { getCurrentRouteName } from './navigation/Navigator'

export default class App extends Component {
    constructor(props) {
        appData.setStatusBarHeight(props.statusBarHeight);

        super(props);
        this.state = {
            load: false
        };
        user.readToken();
    }

    async componentWillMount() {
        netStatus.startMonitorNetworkStatus();
        await apiEnvironment.loadLastApiSettingFromDiskCache();
        await user.readUserInfoFromDisk();
        global.$navigator = this.refs.Navigator;
        global.$routes = [];

    }
    componentDidMount(){
        //热更新 先注释掉
        hotUpdateUtil.checkUpdate();
    }

    render() {
        return (
            <View style={styles.container}>
                <Navigator screenProps={this.props.params}
                    ref='Navigator'
                    onNavigationStateChange={(prevState, currentState) => {
                        let curRouteName = getCurrentRouteName(currentState);
                        // 拦截当前router的名称
                        console.log(curRouteName);
                        const currentScreen = getCurrentRouteName(currentState);
                        const prevScreen = getCurrentRouteName(prevState);
                        global.$routes = currentState.routes;
                        if (prevScreen !== currentScreen) {
                            //console.log('从页面' + prevScreen + '跳转页面' + currentScreen);
                        }

                    }}/>
                {
                    CONFIG.showDebugPanel ? <DebugButton onPress={this.showDebugPage}><Text
                        style={{ color: 'white' }}>调试页</Text></DebugButton> : null
                }
                {/*{*/}
                {/*CONFIG.showDebugPanel ? <DebugButton onPress={this.signTestFunc}><Text*/}
                {/*style={{ color: 'white' }}>验签调试</Text></DebugButton> : null*/}
                {/*}*/}
            </View>
        );
    }

    signTestFunc = () => {
        // signTestTool.beginTest(); post
        signTestTool.testSignGet(); //get
    };

    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
            //routeName:'debug/DemoLoginPage'
        });
        this.refs.Navigator.dispatch(navigationAction);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    debugBtn: {
        width: 60,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
