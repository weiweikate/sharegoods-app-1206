/**
 * Created by nuomi on 2018/7/18.
 * debug 调试模块，用于开发和测试阶段进行异常诊断调试
 */

import FetchHistoryPage from './FetchHistoryPage';
import RequestDetailPage from './RequestDetailPage';

//调试面板
import DebugPanelPage from './DebugPanelPage';

export default {
    moduleName: 'debug',
    childRoutes: {
        DebugPanelPage,
        RequestDetailPage,
        FetchHistoryPage
    }
};
