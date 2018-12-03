import ShareTaskIntroducePage from "./page/ShareTaskIntroducePage";
import ShareTaskListPage  from "./page/ShareTaskListPage";
import WebViewDemo from './page/WebViewDemo'

export default {
    moduleName: 'shareTask',    //模块名称
    childRoutes: {          //模块内部子路由
        ShareTaskIntroducePage,
        ShareTaskListPage,
        WebViewDemo
    }
};
