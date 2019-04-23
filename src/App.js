/**
 * @author louis
 * @date on 2018/9/3
 * @describe rn入口
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

import React, { Component } from "react";
import { observer } from "mobx-react";
import {
    StyleSheet,
    Text,
    View,
    InteractionManager
    // Image
} from "react-native";
import { NavigationActions } from "react-navigation";
import RouterMap from "./navigation/RouterMap";
import user from "../src/model/user";
import DebugButton from "./components/debug/DebugButton";
import apiEnvironment from "./api/ApiEnvironment";
import CONFIG from "../config";
import { netStatus } from "./comm/components/NoNetHighComponent";
import bridge from "./utils/bridge";
import TimerMixin from "react-timer-mixin";

import geolocation from "@mr/rn-geolocation";
import Navigator, { getCurrentRouteName } from "./navigation/Navigator";
import Storage from "./utils/storage";
import { login, logout } from "./utils/SensorsTrack";
import ScreenUtils from "./utils/ScreenUtils";
import codePush from "react-native-code-push";

import { SpellShopFlag } from "./navigation/Tab";
import chatModel from "./utils/QYModule/QYChatModel";
import WebViewBridge from "@mr/webview";
import { beginChatType, QYChatTool } from "./utils/QYModule/QYChatTool";

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
        "loaded:",
        loadedModuleNames.length,
        "waiting:",
        waitingModuleNames.length
    );
}

@observer
class App extends Component {
    constructor(props) {
        super(props);
        chatModel;
        // codepush
        codePush.sync({
            updateDialog: false,
            installMode: codePush.InstallMode.ON_NEXT_RESTART
        });

        this.state = {
            load: false,
            showOldBtn: false,
            isShowShopFlag: true
        };
        user.readToken();
        if (user.isLogin) {
            // 启动时埋点关联登录用户,先取消关联，再重新关联
            logout();
            login(user.code);
        }
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
                geolocation.init({
                    ios: "f85b644981f8642aef08e5a361e9ab6b",
                    android: "4a3ff7c2164aaf7d67a98fb9b88ae0e6"
                }).then(() => {
                    return geolocation.getLastLocation();
                }).then(result => {
                    Storage.set("storage_MrLocation", result);
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
        // 移除启动页
        bridge.removeLaunch();
        this.preView && this.preView.isLoaded();
    }

    render() {
        const prefix = "meeruu://";
        const { isShowShopFlag } = this.state;
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
                        this.setState({ curRouteName, isShowShopFlag: currentState.routes.length === 1 });
                    }}
                />
                <SpellShopFlag isShow={isShowShopFlag}/>
                {
                    showDebugPanel === "true" ?
                        <DebugButton onPress={this.showDebugPage} style={{ backgroundColor: "red" }}><Text
                            style={{ color: "white" }}>调试页</Text></DebugButton> : null
                }
                {/*{*/}
                    {/*<DebugButton onPress={this.lianjie111} style={{ backgroundColor: "red" }}><Text*/}
                        {/*style={{ color: "white" }}>客服</Text></DebugButton>*/}
                {/*}*/}

                <PreComponent ref={(ref)=>{this.preView = ref}}/>
            </View>
        );
    }

    // lianjie111 = () => {
    //     QYChatTool.beginQYChat(
    //         {
    //             urlString: 'hzmrwlyxgs-gys222.qiyukf.com',// 供应商域名地址 暂时无用
    //             title: '供应商222', // 供应商名称  后台给
    //             shopId: "gys222",   //供应商id 用户连接供应商 后台传入
    //             chatType: beginChatType.BEGIN_FROM_PRODUCT,  //发起请求类型 详见枚举数据源
    //             data: {
    //                 title: '网易七鱼', //商品或订单title
    //                 desc: '网易七鱼是网易旗下一款专注于解决企业与客户沟通的客服系统产品。',  //描述
    //                 pictureUrlString: 'http://qiyukf.com/main/res/img/index/barcode.png',// 商品或订单图片连接
    //                 urlString: 'http://qiyukf.com/',// 商品或者url
    //                 note: '￥10000',   //商品价格或者订单号等
    //             }
    //         }
    //     )
    //     // const navigationAction = NavigationActions.navigate({
    //     //     routeName: 'payment/TextWxPay'
    //     // });
    //     // global.$navigator.dispatch(navigationAction);
    // };


    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
        });
        global.$navigator.dispatch(navigationAction);
    };
}
export default codePush(App);

class PreComponent extends Component {
    constructor(props) {
        super(props);
        this.state = ({ isLoaded: false });
    }

    isLoaded = () => {
        this.setState({ isLoaded: true });
    }
    render() {
        if (this.state.isLoaded === true) {
            return <View />
        }
        return (
            <View style={{ height: 2, width: 1 }}>
                <WebViewBridge/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    debugBtn: {
        width: 60,
        height: 35,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    oldLoginBtnStyle: {
        width: 120,
        height: 43,
        paddingLeft: 10
    }
});
