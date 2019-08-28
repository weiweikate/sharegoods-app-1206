import HelperFeedbackPage from './HelperFeedbackPage';
import MyHelperCenter from './MyHelperCenter';
import HelperCenterQuestionDetail from './HelperCenterQuestionDetail';
import HelperCenterQuestionTypeList from './HelperCenterQuestionTypeList';
import HelperCenterQuestionList from './HelperCenterQuestionList';
export default {
    moduleName: 'helper',    //模块名称
    childRoutes: {          //模块内部子路由
        HelperFeedbackPage,
        MyHelperCenter,
        HelperCenterQuestionDetail,
        HelperCenterQuestionTypeList,
        HelperCenterQuestionList
    }
}
