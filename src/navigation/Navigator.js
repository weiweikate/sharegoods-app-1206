import { NavigationActions, StackNavigator } from 'react-navigation';
import Router from './Stack';
import { Platform, NativeModules } from 'react-native';
import RouterMap from './RouterMap';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Analytics from '../utils/AnalyticsUtil';
import { trackViewScreen } from '../utils/SensorsTrack';
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
    //老用户登陆界面禁止
    if (state && action.type === NavigationActions.NAVIGATE) {
        let length = state.routes.length;
        let currentRoute = state.routes[length - 1];
        let nextRoute = action.routeName;
        if (currentRoute
            && nextRoute === RouterMap.LoginPage
            && currentRoute.routeName === RouterMap.OldUserLoginPage) {
            return null;
        }
    }

    if (action.type === NavigationActions.INIT) {
        const currentPage = 'HomePage';
        Analytics.onPageStart(currentPage);
        trackViewScreen('$AppViewScreen', {
            '$screen_name': currentPage
        });
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
        trackViewScreen('$AppViewScreen', {
            '$screen_name': currentPage
        });
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
