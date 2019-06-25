import RecommendPage from './RecommendPage';
import ShopSearchPage from './ShopSearchPage';

export default {
    //推荐搜索模块
    moduleName: 'recommendSearch',
    childRoutes: {
        //推荐页面
        RecommendPage,
        //搜索页面
        ShopSearchPage
    }
};
