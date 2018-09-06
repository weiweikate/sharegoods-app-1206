import SpellShopPage from './SpellShopPage';
import recommendSearch from './recommendSearch';

export default {
    //拼店模块
    moduleName: 'spellShop',
    childRoutes: {
        //拼店页面
        SpellShopPage,
        //推荐搜索模块
        recommendSearch
    }
};
