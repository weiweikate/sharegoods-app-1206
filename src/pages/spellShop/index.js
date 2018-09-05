/**
 * Created by nuomi on 2018/7/19.
 * 拼店模块
 */

// import MyShopPage from "./MyShopPage";//我的店铺页面
import SpellShopPage from "./SpellShopPage";//拼店页面
// import shopSetting from "./shopSetting";
// import announcement from "./announcement";
// import openShop from "./openShop";
// import invite from "./invite";
// import assistant from "./assistant";
// import collect from "./collect";

export default {
    moduleName: "spellShop",            //拼店模块
    childRoutes: {
        // openShop,                       //开店模块
        // shopSetting,                    //店铺设置模块
        // announcement,                   //公告模块
        // invite,                         //邀请模块
        // assistant,                      //店员模块
        // collect,                        //店铺收藏模块
        // MyShopPage,                     //店铺页面
        SpellShopPage                  //拼店页面
    }
};
