const api = {
    // 搜索框关键词匹配
    getKeywords: ['/product/getKeywords',{method:'get'}],
    // 产品列表页
    productList: '/product/productList',
    // 获取产品详情
    getProductDetail: '/product/getProductDetail',
    // 获取产品规格信息
    getProductSpec: '/product/getProductSpec',
};
import ApiUtils from '../../../api/network/ApiUtils';

const HomeAPI = ApiUtils(api);

export default HomeAPI;
