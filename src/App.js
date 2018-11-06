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
    Platform,
    Alert, Linking
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

import {
    isFirstTime,
    isRolledBack,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';

import _updateConfig from '../update.json';
const {appKey} = _updateConfig[Platform.OS];
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

        //热更新相关
        if (isFirstTime) {
            markSuccess()
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }
    }
    componentDidMount(){
        // this.checkUpdate()
    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {text: '是', onPress: ()=>{switchVersion(hash);}},
                {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
            ]);
        }).catch(err => {

            Alert.alert('提示', '更新失败.'+err);
        });
    };
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) {
                /**
                 * Alert.alert('提示', '您的应用版本已是最新.');
                 * 如果已是最新版本则什么也不需要做
                 * */
            } else {
                Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description+'\n'+info, [
                    {text: '是', onPress: ()=>{this.doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

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
