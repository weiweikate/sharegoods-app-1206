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
    Image,
    TouchableOpacity
} from 'react-native';
import NavigatorBar from './components/pageDecorator/NavigatorBar/index';
import {
    MRText as Text
} from './components/ui';

import { renderViewByLoadingState } from './components/pageDecorator/PageState';
import { StackActions, NavigationActions } from 'react-navigation';
import { netState } from '@mr/rn-request';
import res from './comm/res';
import bridge from './utils/bridge';
import DesignRule from './constants/DesignRule';
import Toast from './utils/bridge';
import RouterMap, { GoToTabItem, navigateBack, replaceRoute, routeNavigate, routePush } from './navigation/RouterMap';

export default class BasePage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.viewDidLoad = netState.isConnected;
        // alert(this.viewDidLoad)
        this.navigateTime = new Date().getTime();
    }

    $navigationBarOptions = {
        title: '',
        show: true
    };

    componentDidMount() {
        if (netState.isConnected === false) {
            return;
        }
    }

    $refreshData() {
    }

    $renderSuperView = () => {
        this.setState({});
    };


    $isMonitorNetworkStatus() {
        return false;
    }

    _renderDefaultNoNet() {
        return (
            <View style={[this.props.style, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                <Image source={res.placeholder.netError}
                       style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                       resizeMode={'contain'}
                />
                <Text
                    style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: DesignRule.fontSize_threeTitle_28,
                        includeFontPadding: false,
                        marginTop: 10
                    }} allowFontScaling={false}>
                    网络请求失败
                </Text>
                <Text
                    style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: DesignRule.fontSize_22,
                        marginTop: 5,
                        includeFontPadding: false
                    }} allowFontScaling={false}>
                    请检查你的网络
                </Text>
                <TouchableOpacity onPress={() => {
                    if (netState.isConnected) {
                        this.viewDidLoad = true;
                        this.$refreshData();
                        this.setState({ viewDidLoad: true });//为了触发render
                    }
                }}
                                  style={{
                                      height: 36,
                                      width: 115,
                                      borderRadius: 18,
                                      borderColor: DesignRule.bgColor_btn,
                                      borderWidth: DesignRule.lineHeight * 1.5,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginTop: 20
                                  }}
                >
                    <Text style={{
                        color: DesignRule.bgColor_btn,
                        fontSize: DesignRule.fontSize_mediumBtnText
                    }} allowFontScaling={false}>重新加载</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 跳转登录页面
     */
    gotoLoginPage = (params = {}) => {
        routeNavigate(RouterMap.LoginPage, params);
    };

    renderContianer() {
        let controlParams = this.$getPageStateOptions ? this.$getPageStateOptions() : null;
        return (
            controlParams ? renderViewByLoadingState(controlParams, () => {
                return this._render();
            }) : this._render()
        );
    }

    $renderSecondLeftItem() {
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
                                                  renderTitle={this.$NavBarRenderTitle || null}
                                                  navigation={this.props.navigation}
                                                  leftPressed={() => (this.$NavBarLeftPressed || this.$NavigationBarDefaultLeftPressed).call(this)}
                                                  rightPressed={() => (this.$NavBarRightPressed || this.$NavigationBarDefaultRightPressed).call(this)}
                                                  ref={(bar) => {
                                                      this.$navigatorBar = bar;
                                                  }}

                    />
                }
                {this.$isMonitorNetworkStatus() && netState.isConnected === false && this.viewDidLoad === false ?
                    this._renderDefaultNoNet() :
                    this.renderContianer()}

                {this.$renderSecondLeftItem()}
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

    $navigate = (...arg) => {
        routePush(...arg);
    };

    // 重置、返回到首页
    $navigateBackToHome = () => {
        GoToTabItem(0);
    };

    //返回拼店
    $navigateBackToStore = () => {
        GoToTabItem(2);
    };

    // 返回到登录页面
    $navigateResetLogin = () => {
        const resetAction = StackActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: RouterMap.Tab }),
                NavigationActions.navigate({ routeName: RouterMap.LoginPage })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    // 返回
    $navigateBack = (step) => {
        navigateBack(step);
    };

    // 路由替换
    $navigateReplace = (routeName, params) => {
        replaceRoute(routeName, params);
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
