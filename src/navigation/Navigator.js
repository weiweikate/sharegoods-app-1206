import { NavigationActions, StackNavigator } from 'react-navigation';
import { Platform, NativeModules } from 'react-native';
import RouterMap from './RouterMap';
import Router from './Stack';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Analytics from '../utils/AnalyticsUtil';
import bridge from '../utils/bridge';

const Navigator = StackNavigator(Router,
    {
        initialRouteName: 'Tab',
        initialRouteParams: {},
        headerMode: 'none',
        // mode: 'modal',
        navigationOptions: {
            gesturesEnabled: true
        },
        transitionConfig: (transitionProps, prevTransitionProps, isModal) => {
            return ({
                screenInterpolator: CardStackStyleInterpolator.forHorizontal
            });
        }
    }
);
// goBack 返回指定的router
const defaultStateAction = Navigator.router.getStateForAction;

Navigator.router.getStateForAction = (action, state) => {
    if (state && action.type === NavigationActions.BACK && state.routes.length === 1) {
        console.log('退出RN页面');
        const currentPage = getCurrentRouteName(state);
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
        const routes = [...state.routes];
        return {
            ...state,
            ...state.routes,
            index: routes.length - 1
        };
    }

    if (state && action.type === NavigationActions.NAVIGATE) {
        let length = state.routes.length;
        let currentRoute = state.routes[length - 1];
        let nextRoute = action.routeName;
        if (currentRoute
            && nextRoute === RouterMap.LoginPage
            && currentRoute.routeName === RouterMap.LoginPage) {
            return null;
        }
    }

    if (action.type === NavigationActions.INIT) {
        const currentPage = 'HomePage';
        Analytics.onPageStart(currentPage);
    }

    if (action.type === NavigationActions.NAVIGATE || action.type === NavigationActions.BACK) {
        const currentPage = getCurrentRouteName(state);
        console.log('getStateForAction currentpage end', currentPage);
        Analytics.onPageEnd(currentPage);
    }

    if (action.type === 'Navigation/COMPLETE_TRANSITION') {
        const currentPage = getCurrentRouteName(state);
        console.log('getStateForAction currentpage start', currentPage);
        Analytics.onPageStart(currentPage);
    }

    //支付页面路由替换，需要替换2个
    if (state && action.type === 'ReplacePayScreen') {
        const routes = state.routes.slice(0, state.routes.length - 2);
        routes.push(action);
        return {
            ...state,
            routes,
            index: routes.length - 1
        };
    }

    //支付页面路由替换，需要替换2个
    if (state && action.type === 'ReplacePaymentPage') {
        const routes = state.routes.slice(0, state.routes.length - 1);
        routes.push(action);
        return {
            ...state,
            routes,
            index: routes.length - 1
        };
    }



    //页面埋点

    if (state && action.type === NavigationActions.NAVIGATE || action.type === NavigationActions.BACK){
        const currentPage = getCurrentRouteName(state);
        console.log(`当前页面${currentPage}`);
    }


    // console.log('getStateForAction', action, state)
    return defaultStateAction(action, state);
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

export default Navigator;
