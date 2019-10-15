/*
* 我的店铺模块
* */
import MyShopPage from './MyShopPage';
import ShopAssistantPage from './ShopAssistantPage';
import ShopAssistantDetailPage from './ShopAssistantDetailPage';

export default {
    moduleName: 'myShop',
    childRoutes: {
        //我的店铺
        MyShopPage,
        //所有店员
        ShopAssistantPage,
        //单个店员
        ShopAssistantDetailPage
    }
};
