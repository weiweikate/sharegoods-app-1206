const api = {
    //购物车列表
    list: ['/user/shoppingcart/list',{ method: 'get', checkLogin: true}],
    /*购物车更新商品*/
    // updateItem: "/user/shoppingcart/updateItem",
    updateItem: '/user/shoppingcart/update',
    /*购物车删除商品*/
    // deleteItem: "/user/shoppingcart/deleteItem",
    deleteItem: '/user/shoppingcart/delete',
    /*添加商品*/
    // addItem: "/user/shoppingcart/addItem",
    addItem: '/user/shoppingcart/save',
    // /*gengxin*/
    // updateItem: "/user/shoppingcart/updateItem",
    /*未登录获取购物车详细列表*/
    getRichItemList: '/user/shoppingcart/getRichItem',
    // getRichItemList: "/user/shoppingcart/save",
    /*同步购物车本地商品接口*/
    loginArrange: '/user/shoppingcart/loginArrange',
    /*再来一单**/
     oneMoreOrder: '/user/shoppingcart/oneMoreOrder'


};
import ApiUtils from '../../../api/network/ApiUtils';

const ShopCartAPI = ApiUtils(api);

export default ShopCartAPI;
