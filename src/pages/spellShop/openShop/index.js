/*
* 开店模块
* */
import OpenShopExplainPage from './OpenShopExplainPage';
import OpenShopSuccessPage from './OpenShopSuccessPage';
import InvitationFriendPage from './InvitationFriendPage';
import TestPay from './TestPay';

export default {
    //开店模块
    moduleName: 'openShop',
    childRoutes: {
        //开店说明页面
        OpenShopExplainPage,
        //开店成功页面
        OpenShopSuccessPage,
        //分享好友
        InvitationFriendPage,
        TestPay
    }
};
