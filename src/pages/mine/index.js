import Mine from "./page/MinePage";
import MyHelperPage from './page/helper/MyHelperPage';
import MyCollectPage from './page/mycollect/MyCollectPage';
import userInformation from './page/userInformation';
import Coupons from './page/coupons';
export default {
    moduleName: 'mine',    //模块名称
    childRoutes: {          //模块内部子路由
        Mine,
        MyHelperPage,
        MyCollectPage,
        userInformation,
        Coupons
    }
}
