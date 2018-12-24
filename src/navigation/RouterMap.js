/**
 *
 * @providesModule RouterMap
 * @flow
 */
import {PageKey} from './Stack';
import { NavigationActions } from 'react-navigation';
let timeStamp = null;
let perRouteName = null;
 const RouterMap = {
    // base
    Tab: 'Tab',
    // debug 调试模块
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
     if (perRouteName !== routeName){
         perRouteName = routeName;
     }else {
         let time = new Date().getTime();
         if (timeStamp && time - timeStamp < 600) {
             return;
         }
     }
     timeStamp = new Date().getTime();
     global.$navigator.dispatch(NavigationActions.push({ routeName, params}));

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
export default RouterMap;
 export {navigate, navigateBack};


