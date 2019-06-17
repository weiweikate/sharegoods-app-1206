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
    InteractionManager, NativeAppEventEmitter
    // Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import DebugButton from './components/debug/DebugButton';
import { netStatus } from './comm/components/NoNetHighComponent';
import Navigator, { getCurrentRouteName } from './navigation/Navigator';
import { SpellShopFlag, SpellShopTab } from './navigation/Tab';
import { checkInitResult } from './pages/login/model/PhoneAuthenAction';
import loginModel from './pages/login/model/LoginModel';
import RouterMap, { navigate } from './navigation/RouterMap';
import user from '../src/model/user';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';
import bridge from './utils/bridge';
import TimerMixin from 'react-timer-mixin';
import geolocation from '@mr/rn-geolocation';
import store from '@mr/rn-store';
import ScreenUtils from './utils/ScreenUtils';
import codePush from 'react-native-code-push';
import chatModel from './utils/QYModule/QYChatModel';
import showPinFlagModel from './model/ShowPinFlag';

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
}


let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

@observer
class App extends Component {
    constructor(props) {
        super(props);
        // 移除启动页
        bridge.removeLaunch();
        // 初始化chat
        chatModel;
        this.state = {
            load: false,
            showOldBtn: false
        };
    }

    async componentWillMount() {
        // 禁止重启
        codePush.disallowRestart();
        this.subscription && this.subscription.remove();
        // code push
        codePush.sync({
            updateDialog: false,
            installMode: codePush.InstallMode.ON_NEXT_RESUME
        });
        netStatus.startMonitorNetworkStatus();
        // 环境配置
        apiEnvironment.loadLastApiSettingFromDiskCache();
        user.readUserInfoFromDisk();
        global.$routes = [];

    }

    componentDidMount() {
        this.subscription = NativeAppEventEmitter.addListener(
            'Event_navigateHtmlPage',
            (reminder) => {

                this.timer = setInterval(()=>{
                    if (global.$navigator){
                        navigate('HtmlPage', {uri: reminder.uri})
                        clearInterval(this.timer)
                    }
                },100)
            }

        );
        // 在加载完了，允许重启
        codePush.allowRestart();
        //初始化init  定位存储  和app变活跃 会定位
        InteractionManager.runAfterInteractions(() => {
            TimerMixin.setTimeout(() => {
                checkInitResult().then((data) => {
                    loginModel.setAuthPhone(data);
                }).catch((erro) => {
                    loginModel.setAuthPhone(null);
                });

                geolocation.init({
                    ios: 'f85b644981f8642aef08e5a361e9ab6b',
                    android: '4a3ff7c2164aaf7d67a98fb9b88ae0e6'
                }).then(() => {
                    return geolocation.getLastLocation();
                }).then(result => {
                    store.save('@mr/storage_MrLocation', result);
                }).catch((error) => {
                });
            }, 200);
            TimerMixin.setTimeout(() => {
                ScreenUtils.isNavigationBarExist((data) => {
                    ScreenUtils.setBarShow(data);
                });

                ScreenUtils.checkhasNotchScreen((data) => {
                    ScreenUtils.setHasNotchScreen(data);
                });

            }, 3000);
        });
    }

    render() {
        const prefix = 'meeruu://';
        const showDebugPanel = String(CONFIG.showDebugPanel);
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
                        global.$routes = currentState.routes;
                        this.setState({ curRouteName });
                    }}
                />
                <SpellShopFlag isShowFlag={showPinFlagModel.showFlag}/>
                <SpellShopTab isShowTab={showPinFlagModel.showFlag}/>
                {
                    showDebugPanel === 'true' ?
                        <DebugButton onPress={this.showDebugPage} style={{ backgroundColor: 'red' }}><Text
                            style={{ color: 'white' }}>调试页</Text></DebugButton> : null
                }
            </View>
        );
    }

    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
        });
        global.$navigator.dispatch(navigationAction);
    };
}

export default codePush(codePushOptions)(App);

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
