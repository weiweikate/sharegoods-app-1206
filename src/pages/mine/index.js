import Mine from "./page/MinePage";
import MyHelperPage from './page/helper/MyHelperPage';
import MyCollectPage from './page/mycollect/MyCollectPage';
import UserInformationPage from './page/userInformation/UserInformationPage';
import NickNameModifyPage from './page/userInformation/NickNameModifyPage';
export default {
    moduleName: 'mine',    //模块名称
    childRoutes: {          //模块内部子路由
        Mine,
        MyHelperPage,
        MyCollectPage,
        UserInformationPage,
        NickNameModifyPage
    }
}
