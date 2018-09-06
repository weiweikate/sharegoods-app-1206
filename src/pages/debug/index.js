/**
 * Created by nuomi on 2018/7/18.
 * debug 调试模块，用于开发和测试阶段进行异常诊断调试
 */

import FetchHistoryPage from './FetchHistoryPage';
import RequestDetailPage from './RequestDetailPage';
import UserInfoPage from './UserInfoPage';

//调试面板
import DebugPanelPage from './DebugPanelPage';
import DemoListPage from './DemoListPage';
import DemoLoginPage from './DemoLoginPage';
//import ToolDebugPage from './ToolDebugPage';

export default {
    moduleName: 'debug',
    childRoutes: {
        DebugPanelPage,
        RequestDetailPage,
        UserInfoPage,
        DemoListPage,
        DemoLoginPage,
        FetchHistoryPage,
    }
};
