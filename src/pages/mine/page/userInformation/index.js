
import UserInformationPage from './UserInformationPage';
import NickNameModifyPage from './NickNameModifyPage';

export default {
    moduleName: 'userInformation',    //模块名称
    childRoutes: {          //模块内部子路由
        UserInformationPage,
        NickNameModifyPage,
    }
};
