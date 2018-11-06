
import { NavigationActions, StackNavigator } from 'react-navigation'
import Router from './Stack'
import { Platform, NativeModules } from 'react-native'
import RouterMap from './RouterMap'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

const Navigator = StackNavigator(Router,
    {
        initialRouteName: 'Tab',
        initialRouteParams: {},
        headerMode: 'none',
        // mode: 'modal',
        navigationOptions: {
            gesturesEnabled: true
        },
        transitionConfig: (transitionProps,prevTransitionProps,isModal) =>{
                return({
                    screenInterpolator: CardStackStyleInterpolator.forHorizontal
                })
        }
    }
);
// goBack 返回指定的router
const defaultStateAction = Navigator.router.getStateForAction;

Navigator.router.getStateForAction = (action, state) => {
    if (state && action.type === NavigationActions.BACK && state.routes.length === 1) {
        console.log('退出RN页面');
        // Android物理回退键到桌面
        if (Platform.OS !== 'ios') {
            NativeModules.commModule.nativeTaskToBack();
        }
        const routes = [...state.routes];
        return {
            ...state,
            ...state.routes,
            index: routes.length - 1
        };
    }

    if (state && action.type === NavigationActions.NAVIGATE) {
        let length =  state.routes.length
        let currentRoute = state.routes[length - 1]
        let nextRoute = action.routeName
        console.log('currentRoute',action,  currentRoute.routeName, nextRoute, currentRoute && currentRoute.routeName === RouterMap.LoginPage)
        if (currentRoute
            && nextRoute === RouterMap.LoginPage
            && currentRoute.routeName === RouterMap.LoginPage) {
            return null
        }
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
}

export default Navigator
