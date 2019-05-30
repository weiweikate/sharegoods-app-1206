const api = {
    // 搜索框关键词匹配
    getKeywords: ['/product/getKeywords', { method: 'get' }],
    // 产品列表页
    productList: '/product/productList',

    // 热门搜索
    queryHotName: ['/config/sysHotWord/queryHotName', { method: 'get' }],
    // 热门分类列表
    findHotList: '/product/productCategory/findHotList',
    //一级类目列表
    findNameList: '/product/productCategory/findNameList',
    //二、三级列表
    findProductCategoryList: ['/product/productCategory/findProductCategoryList', { method: 'get' }],
    //获取专题列表
    findTopicById: ['/topic/findById', { method: 'get' }],
    //首页通用接口
    getHomeData: ['/advertising/queryAdvertisingList', { method: 'post' }],
    //会员
    getMembers: ['/user/level/get', { method: 'get' }],
    //为你推荐
    getGoodsInHome: ['/advertising/queryRecommendAdvertisingList', { method: 'post' }],
    //查询签到信息
    querySignList: ['/user/userSign/querySignList', { method: 'get' }],
    //用户签到
    userSign: ['/user/userSign/sign', { method: 'post', checkLogin: true }],
    //一元优惠券兑换
    exchangeTokenCoin: ['/user/exchangeTokenCoin', { method: 'post', checkLogin: true }],
    //首页分类
    classify: ['/config/advertisement/queryCategoryList', { method: 'get' }],
    //秀豆兑换比例
    getExchange: ['/common/config/getExchange', { method: 'get' }],
    //获取红包  type1:获取红包信息并领取 type2：获取红包信息
    getReceivePackage: ['/promotion/promotionPromoter/userReceivePackage', { method: 'get' }],
    //商品页面用户领取红包-->杨小猛
    givingPackageToUser: ['/promotion/promotionPromoter/givingPackageToUser', { method: 'get' }],
    //秒杀
    getLimitGo: ['/product/queryProductDetailByActivity', { method: 'post' }],
    //是否显示秒杀
    isShowLimitGo: ['/advertising/timeLimitSecKill', { method: 'get' }],
    // 关注秒杀商品
    followLimit: ['/promotion/attention', { method: 'post' }],
    // 取消关注秒杀商品
    cancleFollow: ['/promotion/cancelAttention', { method: 'post' }],
    //新手礼包
    getPopupBox: ['/popup/getPopupBoxByType', {method: 'get'}],
    //开奖结果
    getWinningInfo: ['/welfare/getWinningInfo', {method: 'get'}],
    /** 任务相关接口*/
    // 领取活动奖励(activityNo,ruleId必填)
    getActivityPrize: ['/mission/getActivityPrize', { method: 'post' }],
    //获取用户任务活动页相关数据(用户任务活动列表页数据查询)
    getMissionActivity: ['/mission/getMissionActivity', { method: 'get' }],
    //领取任务奖励(missionNo,missionType必填)
    getMissionPrize: ['/mission/getMissionPrize', {method: 'post'}],
    //统一分享通知
    shareNotify: ['/mission/shareNotify', {method: 'post'}]
};
import ApiUtils from '../../../api/network/ApiUtils';

const HomeAPI = ApiUtils(api);

export default HomeAPI;
