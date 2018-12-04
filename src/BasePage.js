/**
 * @author louis
 * @date on 2018/9/6
 * @describe basePage
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import NavigatorBar from './components/pageDecorator/NavigatorBar/index';

import { renderViewByLoadingState } from './components/pageDecorator/PageState';
import { NavigationActions } from 'react-navigation';
import { netStatus } from './comm/components/NoNetHighComponent';
import res from './comm/res';
import bridge from './utils/bridge';
import DesignRule from 'DesignRule';
import Toast from './utils/bridge';

export default class BasePage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.viewDidLoad = netStatus.isConnected;
        // alert(this.viewDidLoad)
        this.navigateTime = new Date().getTime()
    }

    $navigationBarOptions = {
        title: '',
        show: true
    };

    componentDidMount() {
        if (netStatus.isConnected === false) {
            return;
        }
    }

    $refreshData() {
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    _renderDefaultNoNet() {
        return (
            <View style={[this.props.style, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                <Image source={res.placeholder.netError}
                       style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}/>
                <Text
                    style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: DesignRule.fontSize_threeTitle_28,
                        includeFontPadding: false,
                        marginTop: 10
                    }}>
                    网络请求失败
                </Text>
                <Text
                    style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: DesignRule.fontSize_22,
                        marginTop: 5,
                        includeFontPadding: false
                    }}>
                    请检查你的网络
                </Text>
                <TouchableOpacity onPress={() => {
                    if (netStatus.isConnected) {
                        this.viewDidLoad = true;
                        this.$refreshData();
                        this.setState({ viewDidLoad: true });//为了触发render
                    }
                }}
                                  style={{
                                      height: 50,
                                      width: 150,
                                      borderRadius: 25,
                                      borderColor: DesignRule.bgColor_btn,
                                      borderWidth: DesignRule.lineHeight,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginTop: 20
                                  }}
                >
                    <Text style={{
                        color: DesignRule.bgColor_btn,
                        fontSize: DesignRule.fontSize_mediumBtnText
                    }}>重新加载</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderContianer() {
        let controlParams = this.$getPageStateOptions ? this.$getPageStateOptions() : null;
        return (
            controlParams ? renderViewByLoadingState(controlParams, () => {
                return this._render();
            }) : this._render()
        );
    }

    render() {
        let navigationBarOptions = this.$navigationBarOptions || {};
        let isShowNavBar = navigationBarOptions.show !== undefined ? navigationBarOptions.show : true;
        // let controlParams = this.$getPageStateOptions ? this.$getPageStateOptions() : null;

        return (
            <View style={DesignRule.style_container}>
                {
                    isShowNavBar && <NavigatorBar {...navigationBarOptions}
                                                  renderRight={this.$NavBarRenderRightItem || null}
                                                  navigation={this.props.navigation}
                                                  leftPressed={() => (this.$NavBarLeftPressed || this.$NavigationBarDefaultLeftPressed).call(this)}
                                                  rightPressed={() => (this.$NavBarRightPressed || this.$NavigationBarDefaultRightPressed).call(this)}
                                                  ref={(bar) => {
                                                      this.$navigatorBar = bar;
                                                  }}/>
                }
                {this.$isMonitorNetworkStatus() && netStatus.isConnected === false && this.viewDidLoad === false ?
                    this._renderDefaultNoNet() :
                    this.renderContianer()}
            </View>
        );
    }

    // 默认点击左侧
    $NavigationBarDefaultLeftPressed = (callBack) => {
        try {
            this.props.navigation.goBack();
            callBack && typeof callBack === 'function' && callBack();
        } catch (error) {
            console.warn('$NavigationBarDefaultLeftPressed error ' + error.toString());
        }
    };
    // 默认点击右侧事件
    $NavigationBarDefaultRightPressed = () => {
        console.warn('mark sure you had set $NavigationBarDefaultRightPressed func');
    };
    // 隐藏左边item
    $NavigationBarHiddenLeftItem = (hidden, callBack) => {

        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.hiddenLeftItem(hidden, callBack);
    };
    // 隐藏右边item
    $NavigationBarHiddenRightItem = (hidden, callBack) => {

        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.hiddenRightItem(hidden, callBack);
    };
    //更换右边title
    $NavigationBarResetRightTitle = (newTitle, callBack) => {
        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.changeRightTitle(newTitle, callBack);
    };
    // 更换title
    $NavigationBarResetTitle = (newTitle, callBack) => {

        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.changeTitle(newTitle, callBack);
    };
    // 路由跳转
    $navigate = (routeName, params) => {
        try {
            if (!routeName) {
                return;
            }
            let time = new Date().getTime()
            if (time - this.navigateTime < 1000) {
                return;
            }
            this.navigateTime = time
            console.log('navigate time ' + this.navigateTime)
            params = params || {};
            if (this.props.screenProps) {
                this.props.screenProps.rootNavigation.navigate(routeName, {
                    preRouteName: this.props.screenProps.rootNavigation.state.routeName,
                    ...params
                });
            } else {
                this.props.navigation.navigate(routeName, {
                    preRouteName: this.props.navigation.state.routeName,
                    ...params
                });
            }
        } catch (e) {
            console.warn(`js_navigate error: ${e.toString()}`);
        }
    };

    $navigateBackToHome = () => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('HomePage');
    };

    //返回拼店
    $navigateBackToStore = () => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('MyShop_RecruitPage');
    };

    // 返回到首页
    $navigateReset = (routeName = 'Tab', params) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: routeName,
                    params: params
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };
    // 返回到登录页面
    $navigateResetLogin = () => {
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' }),
                NavigationActions.navigate({ routeName: 'login/login/LoginPage' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    // 返回
    $navigateBack = (step) => {
        try {
            console.log('step', step);
            let $routes = global.$routes || [];
            let routerKey = null;
            if (typeof step === 'number') {
                let router = $routes[$routes.length + step];
                routerKey = router.key;
            } else if (typeof step === 'string') {
                for (let i = 0; i < $routes.length - 1; i++) {

                    if (step === $routes[i].routeName) {
                        routerKey = $routes[i + 1].key;
                        break;
                    }
                }
            }
            if (routerKey) {
                const backAction = NavigationActions.back({ key: routerKey });
                this.props.navigation.dispatch(backAction);
            } else {
                this.props.navigation.goBack();
            }

        } catch (e) {
            console.warn(`$navigateBack error: ${e.toString()}`);
        }
    };

    $toastShow = (title) => {
        bridge.$toast(title);
    };
    $loadingShow = (msg, timeout = 0, callback = () => {
    }) => {
        Toast.showLoading(msg, timeout, callback());
    };
    $loadingDismiss = (callBack) => {
        Toast.hiddenLoading(callBack);
    };
}

// @NoNetHighComponent
// class Container extends Component  {
//
//      render(){
//          return(this.props._render());
//      }
// }
