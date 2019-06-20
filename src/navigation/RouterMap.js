/**
 *
 * @providesModule RouterMap
 * @flow
 */
import { PageKey } from './Stack';
import { NavigationActions, StackActions } from 'react-navigation';
import apiEnvironment from '../api/ApiEnvironment';
import StringUtils from '../utils/StringUtils';

let timeStamp = null;
let errWebtimeStamp = null;

console.log(PageKey);

const RouterMap = {
    Tab: 'Tab',
    DebugLoginPage: 'debug/DemoLoginPage',
    DebugDemoPage: 'debug/DemoListPage',
    DebugFetchHistoryPage: 'debug/FetchHistoryPage',
    DebugUserInfoPage: 'debug/UserInfoPage',
    DebugRequestDetailPage: 'debug/RequestDetailPage',
    DebugPanelPage: 'debug/DebugPanelPage',
    ...PageKey
};

// 跳转到某个页面，如果页面存在，不会重新创建
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

// 重新创建页面，跳转到该页面
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
    let time = new Date().getTime();
    if (timeStamp && time - timeStamp < 600) {
        return;
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
function backToShow() {
    GoToTabItem(1);
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

// 页面路由回退
function navigateBack(step) {
    let $routes = global.$routes || [];
    let routerKey = null;
    if (typeof step === 'number' && $routes.length + step > 0) {
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
    if (!routerKey && $routes.length > 1) {
        let router = $routes[$routes.length - 1];
        routerKey = router.key;
    }

    if (routerKey) {
        const backAction = NavigationActions.back({ key: routerKey });//routerKey代表从哪个返回
        global.$navigator && global.$navigator.dispatch(backAction);
    }
}

// 通过设置参数n，指定返回多少层
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
    navigateBack,
    backToHome,
    backToShow,
    navigateBackToStore,
    GoToTabItem,
    forceToHome,
    replaceRoute,
    routePush,
    routeNavigate,
    routePop
};


