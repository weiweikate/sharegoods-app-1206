import Mine from './page/MinePage';
import MyCollectPage from './page/mycollect/MyCollectPage';
import userInformation from './page/userInformation';
import Coupons from './page/coupons';
import helper from './page/helper';
import MyAddressPage from './page/myaddress/MyAddressPage';
import AddAddressPage from './page/myaddress/AddAddressPage';
import SettingPage from './page/setting/SettingPage';

export default {
    moduleName: 'mine',    //模块名称
    childRoutes: {          //模块内部子路由
        Mine,
        MyCollectPage,
        userInformation,
        Coupons,
        helper,
        MyAddressPage,
        AddAddressPage,
        SettingPage
    }
};
