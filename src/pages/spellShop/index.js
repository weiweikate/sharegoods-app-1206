import SpellShopPage from './SpellShopPage';//拼店页面
import shopRecommend from './shopRecommend';//拼店页面

export default {
    moduleName: 'spellShop',            //拼店模块
    childRoutes: {
        SpellShopPage,                  //拼店页面
        shopRecommend//推荐模块
    }
};
