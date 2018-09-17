const api = {
    //购物车列表
     list: '/user/shoppingcart/list',
    /*购物车更新商品*/
    updateItem  :'/user/shoppingcart/updateItem',
    /*购物车删除商品*/
    deleteItem:'/user/shoppingcart/deleteItem'
};
import ApiUtils from '../../../api/network/ApiUtils';

const ShopCartAPI = ApiUtils(api);

export default ShopCartAPI;
