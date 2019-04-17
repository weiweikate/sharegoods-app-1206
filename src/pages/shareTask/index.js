import ShareTaskIntroducePage from './page/ShareTaskIntroducePage';
import ShareTaskListPage from './page/ShareTaskListPage';

export default {
    moduleName: 'shareTask',    //模块名称
    childRoutes: {          //模块内部子路由
        ShareTaskIntroducePage,
        ShareTaskListPage
    }
};
