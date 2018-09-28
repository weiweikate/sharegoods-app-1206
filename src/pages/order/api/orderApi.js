const api = {
    // 确认订单
    makeSureOrder:'/order/makeSureOrder',


    // 加入购物车
    addItem: '/user/shoppingcart/addItem',

    // 热门搜索
    queryHotName: ['/config/sysHotWord/queryHotName',{method:'get'}],
    // 热门分类列表
    findHotList:'/product/productCategory/findHotList',
    //一级类目列表
    findNameList:'/product/productCategory/findNameList',
    //二、三级列表
    findProductCategoryList:['/product/productCategory/findProductCategoryList',{method:'get'}]

};
import ApiUtils from '../../../api/network/ApiUtils';

const OrderApi = ApiUtils(api);

export default OrderApi;
