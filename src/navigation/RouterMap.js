/**
 *
 * @providesModule RouterMap
 * @flow
 */
import {PageKey} from './Stack';
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

export default RouterMap;


