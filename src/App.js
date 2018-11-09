/**
 * @author louis
 * @date on 2018/9/3
 * @describe rn入口
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import RouterMap from './navigation/RouterMap';
import user from '../src/model/user';
import DebugButton from './components/debug/DebugButton';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';
import appData from './model/appData';
import { netStatus } from './comm/components/NoNetHighComponent';

// import hotUpdateUtil from './utils/HotUpdateUtil';

import Navigator, { getCurrentRouteName } from './navigation/Navigator';

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
        global.$routes = [];

    }

    componentDidMount() {
        //热更新 先注释掉
        // hotUpdateUtil.isNeedToCheck();
    }

    render() {
        return (
            <View style={styles.container}>
                <Navigator screenProps={this.props.params}
                           ref={(e) => {
                               global.$navigator = e;
                           }}
                           onNavigationStateChange={(prevState, currentState) => {
                               let curRouteName = getCurrentRouteName(currentState);
                               // 拦截当前router的名称
                               console.log(curRouteName);
                               global.$routes = currentState.routes;
                           }}/>
                {
                    CONFIG.showDebugPanel ? <DebugButton onPress={this.showDebugPage}><Text
                        style={{ color: 'white' }}>调试页</Text></DebugButton> : null
                }
            </View>
        );
    }

    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
            //routeName:'debug/DemoLoginPage'
        });
        global.$navigator.dispatch(navigationAction);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    debugBtn: {
        width: 60,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
