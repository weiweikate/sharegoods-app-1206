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
    View,
    Platform,
InteractionManager
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import RouterMap from './navigation/RouterMap';
import user from '../src/model/user';
import DebugButton from './components/debug/DebugButton';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';
import appData from './model/appData';
import { netStatus } from './comm/components/NoNetHighComponent';
import bridge from './utils/bridge';
import TimerMixin from 'react-timer-mixin';
// import hotUpdateUtil from './utils/HotUpdateUtil';

import geolocation from '@mr/geolocation';
import Navigator, { getCurrentRouteName } from './navigation/Navigator';
import Storage from './utils/storage';

if (__DEV__) {
    const modules = require.getModules();
    const moduleIds = Object.keys(modules);
    const loadedModuleNames = moduleIds
      .filter(moduleId => modules[moduleId].isInitialized)
      .map(moduleId => modules[moduleId].verboseName);
    const waitingModuleNames = moduleIds
      .filter(moduleId => !modules[moduleId].isInitialized)
      .map(moduleId => modules[moduleId].verboseName);

    // make sure that the modules you expect to be waiting are actually waiting
    console.log(
      'loaded:',
      loadedModuleNames.length,
      'waiting:',
      waitingModuleNames.length
    );

    // grab this text blob, and put it in a file named packager/moduleNames.js
    // console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);
}


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
        //初始化init  定位存储  和app变活跃 会定位

        InteractionManager.runAfterInteractions(() => {
            TimerMixin.setTimeout(() => {
                geolocation.init({
                    ios: 'f85b644981f8642aef08e5a361e9ab6b',
                    android: '4a3ff7c2164aaf7d67a98fb9b88ae0e6'
                }).then(() => {
                    return geolocation.getLastLocation();
                }).then(result => {
                    Storage.set('storage_MrLocation', result);
                });
            }, 2000);
        });

        //热更新 先注释掉
        bridge.removeLaunch();
        // hotUpdateUtil.isNeedToCheck();
        // hotUpdateUtil.checkUpdate();
    }

    render() {
        const prefix = Platform.OS == 'android' ? 'meeruu://com.meeruu.sharegoods.mobile/' : 'meeruu://';
        return (
            <View style={styles.container}>
                <Navigator
                    uriPrefix={prefix}
                    screenProps={this.props.params}
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
