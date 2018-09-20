import SpellShopPage from './SpellShopPage';
import recommendSearch from './recommendSearch';
import openShop from './openShop';
import shopRecruit from './shopRecruit';
import myShop from './myShop';
import shopSetting from './shopSetting';

export default {
    //拼店模块
    moduleName: 'spellShop',
    childRoutes: {
        //拼店首页
        SpellShopPage,
        //推荐搜索模块
        recommendSearch,
        //开店模块
        openShop,
        //招募模块
        shopRecruit,
        //我的店铺模块
        myShop,
        //店铺设置
        shopSetting
    }
};
