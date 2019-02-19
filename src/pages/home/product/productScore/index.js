import P_ScoreListPage from './P_ScoreListPage';
import P_ScorePublishPage from './P_ScorePublishPage';
import P_ScoreSuccessPage from './P_ScoreSuccessPage'
export default {
    moduleName: 'productScore',    //模块名称
    childRoutes: {          //模块内部子路由
        P_ScoreListPage,
        P_ScorePublishPage,
        P_ScoreSuccessPage
    }
};
