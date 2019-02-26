/**
 * @author louis
 * @date on 2018/9/3
 * @describe rn入口
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    StyleSheet,
    Text,
    View,
    InteractionManager
    // Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import RouterMap from './navigation/RouterMap';
import user from '../src/model/user';
import DebugButton from './components/debug/DebugButton';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';
import { netStatus } from './comm/components/NoNetHighComponent';
import bridge from './utils/bridge';
import TimerMixin from 'react-timer-mixin';

import geolocation from '@mr/rn-geolocation';
import Navigator, { getCurrentRouteName } from './navigation/Navigator';
import Storage from './utils/storage';
// import LoginAPI from './pages/login/api/LoginApi';
// import OldImag from './home_icon.png';
import oldUserLoginSingleModel from './model/oldUserLoginModel';
import { login, logout } from './utils/SensorsTrack';
import ScreenUtils from './utils/ScreenUtils';
import codePush from "react-native-code-push";
// import { olduser } from './pages/home/model/HomeRegisterFirstManager';

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

@observer
class App extends Component {
    constructor(props) {
        super(props);

        codePush.sync({
            updateDialog: false,
            installMode: codePush.InstallMode.ON_NEXT_RESUME
        });

        this.state = {
            load: false,
            showOldBtn: false
        };
        user.readToken();
        if (user.isLogin) {
            // 启动时埋点关联登录用户,先取消关联，再重新关联
            logout();
            login(user.code);
        }
        //检测是否老用户登陆
        oldUserLoginSingleModel.checkIsShowOrNot(false);
    }

    async componentWillMount() {
        netStatus.startMonitorNetworkStatus();

        // 环境配置
        await apiEnvironment.loadLastApiSettingFromDiskCache();
        await user.readUserInfoFromDisk();
        global.$routes = [];
    }

    componentDidMount() {
        //初始化init  定位存储  和app变活跃 会定位

        InteractionManager.runAfterInteractions(() => {
            TimerMixin.setTimeout(() => {
                ScreenUtils.isNavigationBarExist((data) => {
                    ScreenUtils.setBarShow(data);
                });

                ScreenUtils.checkhasNotchScreen((data) => {
                    ScreenUtils.setHasNotchScreen(data);
                });

                geolocation.init({
                    ios: 'f85b644981f8642aef08e5a361e9ab6b',
                    android: '4a3ff7c2164aaf7d67a98fb9b88ae0e6'
                }).then(() => {
                    return geolocation.getLastLocation();
                }).then(result => {
                    Storage.set('storage_MrLocation', result);
                }).catch((error) => {
                });
            }, 200);
        });
        // 移除启动页
        bridge.removeLaunch();
    }

    render() {
        const prefix = 'meeruu://';
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
                        this.setState({ curRouteName });
                        // 拦截当前router的名称
                        console.log(curRouteName);
                        global.$routes = currentState.routes;
                    }}/>
                {
                    CONFIG.showDebugPanel ?
                        <DebugButton onPress={this.showDebugPage} style={{ backgroundColor: 'red' }}><Text
                            style={{ color: 'white' }}>调试页</Text></DebugButton> : null
                }
            </View>
        );
    }

    gotoLogin = () => {
        oldUserLoginSingleModel.JumpToLogin(RouterMap.LoginPage);
    };
    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
        });
        global.$navigator.dispatch(navigationAction);
    };
}

export default codePush(App);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    debugBtn: {
        width: 60,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    oldLoginBtnStyle: {
        width: 120,
        height: 43,
        paddingLeft: 10
    }
});
