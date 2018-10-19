import Mine from './page/MinePage';
import MyCollectPage from './page/mycollect/MyCollectPage';
import userInformation from './page/userInformation';
import Coupons from './page/coupons';
import helper from './page/helper';
import AddressManagerPage from './page/myaddress/AddressManagerPage';
import SettingPage from './page/setting/SettingPage';
import MyDataPage from './page/myData/MyDataPage';
import MyPromotionPage from './page/myData/MyPromotionPage';
import setting from './page/setting';
import MyAddress from './page/myaddress';
import MyAccount from './page/myaccount';
import bankCard from './page/bankCard';
import InviteFriendsPage from './page/Invite/InviteFriendsPage';
import promotion from './page/promotion';

export default {
    moduleName: 'mine',    //模块名称
    childRoutes: {          //模块内部子路由
        Mine,
        MyCollectPage,
        userInformation,
        Coupons,
        helper,
        AddressManagerPage,
        SettingPage,
        setting,
        MyAddress,
        MyAccount,
        bankCard,
        MyDataPage,
        MyPromotionPage,
        InviteFriendsPage,
        promotion
    }
};
