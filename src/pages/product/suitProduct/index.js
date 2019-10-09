import SuitProductPage from './SuitProductPage';
import MemberProductPage from './MemberProductPage';

export default {
    moduleName: 'suitProduct',    //模块名称
    childRoutes: {          //模块内部子路由
        SuitProductPage,
        MemberProductPage
    }
};
