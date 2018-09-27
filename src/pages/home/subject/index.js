import SubjectPage from './SubjectPage';
import SubOpenPrizePage  from './SubOpenPrizePage'

export default {
    moduleName: 'subject',    //模块名称
    childRoutes: {          //模块内部子路由
        SubjectPage,
        SubOpenPrizePage
    }
};
