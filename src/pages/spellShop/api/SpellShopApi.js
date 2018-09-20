import ApiUtils from '../../../api/network/ApiUtils';


const api = {

    // 查询用户个人信息
    getUser: ['/user/getUser',{method:'get'}],
    // 查询首页推荐店铺
    queryHomeStore: ['/user/store/queryHomeStore',{method:'get'}],
    // 查询店铺列表
    queryByStatusAndKeyword: ['/user/store/queryByStatusAndKeyword',{method:'get'}],
    // 根据id查询店铺
    getById: ['/user/store/getById',{method:'get'}],


    // 产品列表页
    productList: '/product/productList',
};
const SpellShopApi = ApiUtils(api);
export default SpellShopApi;
