import recommendSearch from './recommendSearch';
import openShop from './openShop';
import shopRecruit from './shopRecruit';
import myShop from './myShop';
import shopSetting from './shopSetting';
import addCapacity from './addCapacity'
import MyShop_RecruitPage from './MyShop_RecruitPage'

export default {
    //拼店模块
    moduleName: 'spellShop',
    childRoutes: {
        MyShop_RecruitPage,
        //推荐搜索模块
        recommendSearch,
        //开店模块
        openShop,
        //招募模块
        shopRecruit,
        //我的店铺模块
        myShop,
        //扩容模块
        addCapacity,
        //店铺设置
        shopSetting
    }
};
