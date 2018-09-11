import SpellShopPage from './SpellShopPage';
import recommendSearch from './recommendSearch';
import openShop from './openShop';
import shopRecruit from './shopRecruit';

export default {
    //拼店模块
    moduleName: 'spellShop',
    childRoutes: {
        //拼店页面
        SpellShopPage,
        //推荐搜索模块
        recommendSearch,
        //开店模块
        openShop,
        //招募模块
        shopRecruit,
    }
};
