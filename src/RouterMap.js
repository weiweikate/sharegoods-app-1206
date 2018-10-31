/**
 *
 * @providesModule RouterMap
 * @flow
 */
import {PageKey} from './Router';
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

    SearchPage: 'home/search/SearchPage',
    SearchResultPage: 'home/search/SearchResultPage',

    ProductDetailPage: 'home/product/ProductDetailPage',
   ...PageKey
};

export default RouterMap;


