import MyHelperPage from './MyHelperPage';
import HelperFeedbackPage from './HelperFeedbackPage';
import HelperQuestionDetail from './HelperQeustionDetail';
import HelperQuestionListPage from './HelperQuestionListPage';
import MyHelperCenter from './MyHelperCenter';
import HelperCenterQuestionDetail from './HelperCenterQuestionDetail';
import HelperCenterQuestionTypeList from './HelperCenterQuestionTypeList';
import HelperCenterQuestionList from './HelperCenterQuestionList';
export default {
    moduleName: 'helper',    //模块名称
    childRoutes: {          //模块内部子路由
        MyHelperPage,
        HelperFeedbackPage,
        HelperQuestionDetail,
        HelperQuestionListPage,
        MyHelperCenter,
        HelperCenterQuestionDetail,
        HelperCenterQuestionTypeList,
        HelperCenterQuestionList
    }
}
