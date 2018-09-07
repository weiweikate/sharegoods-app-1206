/*
* 开店模块
* */
import OpenShopExplainPage from './OpenShopExplainPage';
import CashExplainPage from './CashExplainPage';
import OpenShopSuccessPage from './OpenShopSuccessPage';

export default {
    //开店模块
    moduleName: 'openShop',
    childRoutes: {
        //开店说明页面
        OpenShopExplainPage,
        //缴纳保证金说明页
        CashExplainPage,
        //开店成功页面
        OpenShopSuccessPage
    }
};
