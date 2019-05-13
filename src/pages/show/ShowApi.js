const api = {
    // 获取秀场
    showQuery: ['/discover/query', { method: 'get' }],
    //活动
    showActivity: ['/social/show/content/page/query', { method: 'get' }],
    // 发现详情
    showDetail: ['/discover/getById', { method: 'get' }],
    // 发现详情
    showDetailCode: ['/discover/getByCode', { method: 'get' }],
    // 点赞
    showGood: '/discover/count/save',
    // 取消点赞:
    showGoodCancel: '/discover/count/cancel',
    //收藏
    showConnect: '/discover/count/save',
    // 取消收藏
    showCollectCancel: '/discover/count/cancel',
    // 收藏列表
    showCollectList: ['/discover/queryCollect', { method: 'get' }],
    // 轮播图
    getShowBanner: ['/advertising/queryAdvertisingList', { method: 'post' }],
    //购物车列表
    carList: ['/user/shoppingcart/list',{ method: 'get', checkLogin: true}],
};
import ApiUtils from '../../api/network/ApiUtils';

const ShowApi = ApiUtils(api);

export default ShowApi;
