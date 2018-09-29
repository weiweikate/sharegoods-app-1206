/**
 * Created by damon on 2018/9/6.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import NavigatorBar from './components/pageDecorator/NavigatorBar/index';
import {
    LoadingHub,
    ToastView
} from './components/pageDecorator/BaseView';

import { renderViewByLoadingState } from './components/pageDecorator/PageState';
import { NavigationActions } from 'react-navigation';


export default class BasePage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
    }

    $navigationBarOptions = {
        title: '',
        show: true
    };

    render() {
        let navigationBarOptions = this.$navigationBarOptions || {};
        let isShowNavBar = navigationBarOptions.show !== undefined ? navigationBarOptions.show : true;
        let controlParams = this.$getPageStateOptions ? this.$getPageStateOptions() : null;

        return (
            <View style={styles.container}>
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


            {
                controlParams ? renderViewByLoadingState(controlParams, () => {
                    return this._render();
                }) : this._render()
            }
            <ToastView ref={(toast) => {
                this.$toast = toast;
            }}/>

            <LoadingHub ref={(loadingHub) => {
                this.$loadingHub = loadingHub;
            }}/>
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
    // 返回
    $navigateBack = (step) => {
        try {
            console.log('step', step);
            if (step) {
                let $routes = global.$routes || [];
                let router = $routes[$routes.length + step];
                let routerKey = router.key;
                const backAction = NavigationActions.back({ key: routerKey });
                this.props.navigation.dispatch(backAction);
            } else {
                this.props.navigation.goBack();
            }
        } catch (e) {
            console.warn(`$navigateBack error: ${e.toString()}`);
        }
    };

    $toastShow = (title, params) => {
        if (!this.$toast) {
            return;
        }
        this.$toast.showToast(title, params || {});
    };
    $toastDismiss = (callBack) => {
        if (!this.$toast) {
            return;
        }
        this.$toast.dismiss(typeof callBack === 'function' ? callBack : null);
    };
    $loadingShow = (msg, params) => {
        if (!this.$loadingHub) {
            return;
        }
        this.$toastDismiss();
        this.$loadingHub.loadingShow(msg, params || {});
    };
    $loadingDismiss = (callBack) => {
        if (!this.$loadingHub) {
            return;
        }
        this.$loadingHub.dismiss(typeof callBack === 'function' ? callBack : null);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6'
    }
});
