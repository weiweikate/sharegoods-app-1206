import ApiUtils from '../../../api/network/ApiUtils';

const api = {
    //新接口商品详情
    getProductDetailByCodeV2: ['/product/getProductDetailByCodeV2', { method: 'get' }],
    /*供应商*/
    getProductShopInfoBySupplierCode: ['/product/getProductShopInfoBySupplierCode', { method: 'get' }],
    /*获取优惠券列表*/
    listProdCoupon: ['/Coupon/listProdCoupon', { method: 'get' }],
    /*领取优惠券*/
    getProdCoupon: ['/Coupon/getProdCoupon', { method: 'get' }],
    /*获取地址范围内的库存*/
    getProductSkuStockByAreaCode: ['/product/getProductSkuStockByAreaCode', { method: 'get' }],
    // 获取产品规格信息
    getProductSpec: ['/product/getProductSpec', { method: 'get' }],
    /**评论**/
    //发布评论
    appraise_publish: ['/appraise/publish'],
    //查询置顶晒单
    appraise_queryByProdCode: ['/appraise/queryByProdCode', { method: 'get' }],
    //商品详情晒单列表全部
    appraise_list: ['/appraise/list'],
    //继续晒单
    queryCommentByUserCode: ['/appraise/queryCommentByUserCode', { method: 'get' }],
    /**经验值专区**/
    act_exp_detail: ['/operator/act-exp/detail', { method: 'get' }]
};
const ProductApi = ApiUtils(api);
export default ProductApi;
