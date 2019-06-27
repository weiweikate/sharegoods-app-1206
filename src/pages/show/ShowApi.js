const api = {
    // 获取秀场
    showQuery: ['/discover/query', {
        method: 'get'
    }],
    //活动
    showActivity: ['/social/show/content/page/query', {
        method: 'get'
    }],
    // 发现详情
    showDetail: ['/social/show/content/queryByShowNo', {
        method: 'get'
    }],
    // 发现详情
    showDetailCode: ['/social/show/content/queryByShowNo', {
        method: 'get'
    }],
    // 点赞
    showGood: '/discover/count/save',
    // 取消点赞:
    showGoodCancel: '/discover/count/cancel',
    //收藏
    showConnect: '/discover/count/save',
    // 取消收藏
    showCollectCancel: '/discover/count/cancel',
    // 收藏列表
    showCollectList: ['/discover/queryCollect', {
        method: 'get'
    }],
    // 轮播图
    getShowBanner: ['/advertising/queryAdvertisingList', {
        method: 'post'
    }],
    //购物车列表
    carList: ["/user/shoppingcart/list", {
        method: 'get',
        checkLogin: true
    }],
    //添加文章
    publishShow: ['/social/show/content/save', {
        method: 'post',
        checkLogin: false
    }],
    //点赞/收藏/浏览量  1.点赞 2.收藏3.分享4.下载 5.浏览量 6.人气值
    incrCountByType: ['/social/show/count/incrCountByType', {
        method: 'post'
    }],
    //取消点赞/收藏 1.点赞 2.收藏3.分享4.下载 5.浏览量 6.人气值
    reduceCountByType: ['/social/show/count/reduceCountByType', {
        method: 'post'
    }],
    //判断用户类型
    getWhiteList: ['/social/show/user/query', {
        method: 'get'
    }],
    //标签列表查询
    getAllTag: ['/social/show/tag/list', {
        method: 'get'
    }],
    //查询单个文章标签
    getTagWithCode: ['/social/show/tag/content/info', {
        method: 'get'
    }],
    //某个tag 下的所有文章
    getDynamicWithTag: ['/social/show/content/tag/list', {
        method: 'get'
    }],
    //查询单个标签信息
    getTagInfo: ['/social/show/tag/info', {
        method: 'get'
    }]
};
import ApiUtils from '../../api/network/ApiUtils';

const ShowApi = ApiUtils(api);

export default ShowApi;