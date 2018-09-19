const api = {
    //购物车列表
    list: "/user/shoppingcart/list",
    /*购物车更新商品*/
    updateItem: "/user/shoppingcart/updateItem",
    /*购物车删除商品*/
    deleteItem: "/user/shoppingcart/deleteItem",
    /*添加商品*/
    addItem: "/user/shoppingcart/addItem",
    /*gengxin*/
    updateItem: "/user/shoppingcart/updateItem",
    /*未登录获取购物车详细列表*/
    getRichItemList:'/user/shoppingcart/getRichItemList',
    /*同步购物车本地商品接口*/
    loginArrange:'/user/shoppingcart/loginArrange',

};
import ApiUtils from "../../../api/network/ApiUtils";

const ShopCartAPI = ApiUtils(api);

export default ShopCartAPI;
