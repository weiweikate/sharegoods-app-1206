import ApiUtils from '../../../api/network/ApiUtils';

const api = {
    // 根据code获取产品信息 杨小猛
    getProductDetailByCode: ['/product/getProductDetailByCode', { method: 'get' }],
    getProductDetailByCodeV2: ['/product/getProductDetailByCodeV2', { method: 'get' }],
    // 获取产品获取活动信息 蒋大为
    queryByProductCode: ['/operator/activity/queryByProductCode', { method: 'get' }],
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
