import { createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Animated, Easing, NativeModules, Platform } from 'react-native';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
/**
 * 以下两个对象不可以颠倒引入，会导致全局路由RouterMap不可用
 */
import RouterMap from './RouterMap';
import Router from './Stack';
import Analytics from '../utils/AnalyticsUtil';
import bridge from '../utils/bridge';
import showPinFlagModel from '../model/ShowPinFlag';

//无需转场动画的页面
const noAnimatedPage = [
    RouterMap.SearchResultPage,
    RouterMap.SearchPage,
    RouterMap.SearchPageOrder,
    RouterMap.CheckBigImagesView,
    RouterMap.P_ScoreSwiperPage,
    RouterMap.ShowDetailImagePage
];
/***
 * 无转场动画
 */
const noAnimatedTransition = (toTransitionProps, fromTransitionProps) => {
    const isBack = !!fromTransitionProps && fromTransitionProps.navigation.state.index >= toTransitionProps.navigation.state.index;
    const routeName = isBack ? fromTransitionProps.scene.route.routeName : toTransitionProps.scene.route.routeName;
    //指定无转场动画的页面
    if (noAnimatedPage.indexOf(routeName) > -1) {
        return {
            screenInterpolator: StackViewStyleInterpolator.forNoAnimation,
            transitionSpec: {
                duration: 10
            }
        };
    }
};

const RootStack = createStackNavigator(Router,
    {
        initialRouteName: 'Tab',
        initialRouteParams: {},
        headerMode: 'none',
        defaultNavigationOptions: {
            gesturesEnabled: true
        },
        cardShadowEnabled: true,
        cardOverlayEnabled: true,
        transitionConfig: (toTransitionProps, fromTransitionProps) => {
            let transition = noAnimatedTransition(toTransitionProps, fromTransitionProps);
            if (transition) {
                return transition;
            }
            return {
                transitionSpec: {
                    duration: 260,
                    easing: Easing.out(Easing.poly(3.6)),
                    timing: Animated.timing,
                    useNativeDriver: true
                },
                screenInterpolator: ((Platform.OS === 'android' && Platform.Version < 29) || Platform.OS === 'ios')
                    ? StackViewStyleInterpolator.forHorizontal : null
            };
        }
    }
);


// goBack 返回指定的router
const defaultStateAction = RootStack.router.getStateForAction;
RootStack.router.getStateForAction = (action, lastState) => {
    const { type, routeName, params } = action;
    const currentPage = getCurrentRouteName(lastState);
    // 页面回退场景
    if (lastState && (type === NavigationActions.BACK) && (lastState.routes.length === 1)) {
        console.log('退出RN页面');
        console.log(`当前页面${currentPage}`);
        if (currentPage === 'HomePage') {
            // Android物理回退键到桌面
            if (Platform.OS === 'android') {
                if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                    NativeModules.commModule.nativeTaskToBack();
                } else {
                    bridge.$toast('再按一次返回键退出应用');
                }
                this.lastBackPressed = Date.now();
            }
        }
        const routes = [...lastState.routes];
        return {
            ...lastState,
            ...lastState.routes,
            index: routes.length - 1
        };
    }
    // 页面navigate场景
    if (lastState && ((type === NavigationActions.NAVIGATE) || (type === StackActions.COMPLETE_TRANSITION))) {
        // 拼店显示flag逻辑
        if (routeName === 'HomePage' || routeName === 'ShowListPage'
            || routeName === 'ShopCartPage' || routeName === 'MinePage') {
            // showPinFlagModel.saveShowFlag(true);
            showPinFlagModel.saveShowFlag(false);
        } else {
            showPinFlagModel.saveShowFlag(false);
        }
        Analytics.onPageStart(currentPage);
    }

    // push模式防止重复跳转到同一个页面
    if (lastState &&
        (type === StackActions.PUSH) &&   //此处原先使用NavigationActions.NAVIGATE
        routeName === lastState.routes[lastState.routes.length - 1].routeName &&
        JSON.stringify(params) === JSON.stringify(lastState.routes[lastState.routes.length - 1].params)) {
        return null;
    }

    if (lastState && (type === NavigationActions.INIT)) {
        Analytics.onPageStart('HomePage');
    }

    if (lastState && (type === NavigationActions.NAVIGATE || type === NavigationActions.BACK)) {
        console.log('getStateForAction currentpage end', currentPage);
        Analytics.onPageEnd(currentPage);
    }

    //支付页面路由替换，需要替换2个
    if (lastState && (type === 'ReplacePayScreen')) {
        const routes = lastState.routes.slice(0, lastState.routes.length - 2);
        routes.push(action);
        return {
            ...lastState,
            routes,
            index: routes.length - 1
        };
    }
    return defaultStateAction(action, lastState);
};

export const getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
};
const Navigator = createAppContainer(RootStack);
export default Navigator;
