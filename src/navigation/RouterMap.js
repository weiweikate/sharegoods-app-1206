/**
 *
 * @providesModule RouterMap
 * @flow
 */
import { PageKey } from './Stack';
import { NavigationActions } from 'react-navigation';
import apiEnvironment from '../api/ApiEnvironment';
import bridge from '../utils/bridge';

let timeStamp = null;
let errWebtimeStamp = null;
let perRouteName = null;


// alert(PageKey)
// alert(typeof PageKey);
// console.log(Object.values(PageKey));
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

function navigate(routeName, params) {
    if (!routeName) {
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
        perRouteName = routeName;
    } else {
        let time = new Date().getTime();
        if (timeStamp && time - timeStamp < 600) {
            return;
        }
    }
    timeStamp = new Date().getTime();
    global.$navigator.dispatch(NavigationActions.push({ routeName, params }));

}

function backToHome() {
    let $routes = global.$routes || [];
   if ( $routes.length === 0){
       bridge.$toast('下滑页面，查看更多');
       return;
   }
   if ($routes.length === 1) {
       let route = $routes[0]
       if (route.routeName === 'Tab' && route.index === 0){
           bridge.$toast('下滑页面，查看更多');
           return;
       }
   }
    global.$navigator && global.$navigator._navigation.popToTop();
    global.$navigator && global.$navigator._navigation.navigate('HomePage');

}

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
        global.$navigator.dispatch(backAction);
    }
}

function navigateBackToStore() {
    global.$navigator && global.$navigator._navigation.popToTop();
    global.$navigator && global.$navigator._navigation.navigate('MyShop_RecruitPage');
};


export default RouterMap;
export { navigate, navigateBack, backToHome, navigateBackToStore };


