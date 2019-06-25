/**
 *
 * @providesModule RouterMap
 * @flow
 */
import { PageKey } from './Stack';
import { NavigationActions, StackActions } from 'react-navigation';
import apiEnvironment from '../api/ApiEnvironment';
import StringUtils from '../utils/StringUtils';
import {DeviceEventEmitter} from 'react-native'
let timeStamp = null;
let errWebtimeStamp = null;
let perRouteName = null;

console.log(PageKey);

const RouterMap = {
    Tab: 'Tab',
    HtmlPage: 'HtmlPage',
    DebugLoginPage: 'debug/DemoLoginPage',
    DebugDemoPage: 'debug/DemoListPage',
    DebugFetchHistoryPage: 'debug/FetchHistoryPage',
    DebugUserInfoPage: 'debug/UserInfoPage',
    DebugRequestDetailPage: 'debug/RequestDetailPage',
    DebugPanelPage: 'debug/DebugPanelPage',
    ...PageKey
};

function hasRoute(routeName) {
    let $routes = global.$routes || [];
    for (let i = 0, len = $routes.length; i < len - 1; i++) {
        if (routeName === $routes[i].routeName) {
            return true;
        }
    }
    return false;
}

// 出栈到指定页面，不存在则回退到上一步
function popToRouteName(routeName) {
    if (hasRoute(routeName)) {
        routeNavigate(routeName);
    } else {
        routePop();
    }
}

// 跳转到某个页面，如果页面存在，不会重新创建,适用于静态页面，例如login
function routeNavigate(routeName, params) {
    if (StringUtils.isEmpty(routeName)) {
        return;
    }
    if (routeName === 'HtmlPage' && params && params.uri === apiEnvironment.getCurrentH5Url() + '/system-maintenance') {
        let time = new Date().getTime();
        if (errWebtimeStamp && time - errWebtimeStamp < 1000 * 30) {
            return;
        }
        errWebtimeStamp = new Date().getTime();
    }
    global.$navigator && global.$navigator._navigation.navigate(routeName, params);
}

// 重新创建页面，跳转到该页面，适用于根据网络请求来加载展现的页面
function routePush(routeName, params) {
    if (StringUtils.isEmpty(routeName)) {
        return;
    }
    if (routeName === 'HtmlPage' && params && params.uri === apiEnvironment.getCurrentH5Url() + '/system-maintenance') {
        let time = new Date().getTime();
        if (errWebtimeStamp && time - errWebtimeStamp < 1000 * 30) {
            return;
        }
        errWebtimeStamp = new Date().getTime();
    }
    if (perRouteName !== routeName) {
        // 前一个页面和当前页面一样
        perRouteName = routeName;
    } else {
        let time = new Date().getTime();
        if (timeStamp && time - timeStamp < 600) {
            return;
        }
    }
    timeStamp = new Date().getTime();
    global.$navigator && global.$navigator._navigation.push(routeName, params);
}

// 新页面直接替换当前页面
function replaceRoute(routeName, params) {
    if (StringUtils.isEmpty(routeName)) {
        return;
    }
    params = params || {};
    const resetAction = StackActions.replace({
        routeName,
        params
    });
    global.$navigator && global.$navigator.dispatch(resetAction);
}

// 清空并重新加载首页
function forceToHome() {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tab' })]
    });
    global.$navigator && global.$navigator.dispatch(resetAction);
}

// 跳转到首页tab
function backToHome() {
    GoToTabItem(0);
}

// 跳转到秀场tab
function backToShow(index = -1) {
    GoToTabItem(1);
    DeviceEventEmitter.emit('PublishShowFinish', index);
}

// 跳转到拼店tab
function navigateBackToStore() {
    GoToTabItem(2);
};

// 跳转到首页指定的tab
function GoToTabItem(index) {
    let $routes = global.$routes || [];
    if (index > 4) {
        return;
    }
    if ($routes.length === 1) {
        let route = $routes[0];
        if (route.routeName === 'Tab' && route.index === index) {
            return;
        }
    }
    global.$navigator && global.$navigator._navigation.popToTop();
    global.$navigator && global.$navigator._navigation.navigate(['HomePage', 'ShowListPage', 'MyShop_RecruitPage', 'ShopCartPage', 'MinePage'][index]);
}

// 登录页的回退逻辑，要么回退到上一步，要么回到栈顶
function loginBack() {
    let $routes = global.$routes || [];
    let router = $routes[$routes.length - 1];
    let routerKey = router.key;
    if (!StringUtils.isEmpty(routerKey)) {
        const backAction = NavigationActions.back({ key: routerKey });//routerKey代表从哪个返回
        global.$navigator && global.$navigator.dispatch(backAction);
    } else {
        global.$navigator && global.$navigator._navigation.popToTop();
    }
}

// 通过设置参数n,正数，指定返回多少层
function routePop(n) {
    if (!n) {
        n = 1;
    }
    const popAction = StackActions.pop({
        n
    });
    global.$navigator && global.$navigator.dispatch(popAction);
}

export default RouterMap;
export {
    backToHome,
    backToShow,
    navigateBackToStore,
    GoToTabItem,
    forceToHome,
    replaceRoute,
    routePush,
    routeNavigate,
    routePop,
    loginBack,
    popToRouteName
};


