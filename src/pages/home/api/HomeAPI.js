const api = {
    // 搜索框关键词匹配
    getKeywords: ['/product/getKeywords',{method:'get'}],
    // 产品列表页
    productList: '/product/productList',

    // 热门搜索
    queryHotName: ['/config/sysHotWord/queryHotName',{method:'get'}],
    // 热门分类列表
    findHotList:'/product/productCategory/findHotList',
    //一级类目列表
    findNameList:'/product/productCategory/findNameList',
    //二、三级列表
    findProductCategoryList:['/product/productCategory/findProductCategoryList',{method:'get'}],
    //获取专题列表
    findTopicById:['/topic/findById',{method:'get'}],
    //获取轮播图
    getSwipers: ['/config/advertisement/queryAdvertisementList',{method:'post'} ],
    //今日榜单
    getTodays: ['/config/advertisement/queryAdvertisementList'],
    //精品推荐
    getRecommends: ['/config/advertisement/queryAdvertisementList'],
    //明星店铺
    getStarShop: ['/config/advertisement/queryAdvertisementList'],
    //推荐广告
    getAd: ['/config/advertisement/queryAdvertisementList'],
    //专题
    getSubject: ['/config/advertisement/queryAdvertisementList'],

    getBanner: ['/config/advertisement/queryAdvertisementList'],
    //会员
    getMembers: ['/user/level/get', {method: 'get'}],
    //为你推荐
    getGoodsInHome: ['/config/advertisement/queryRecommendedPageList'],
    //查询签到信息
    querySignList:['/user/userSign/querySignList',{method:'get'}],
    //用户签到
    userSign:['/user/userSign/sign',{method:'post', checkLogin: true}],
    //一元优惠券兑换
    exchangeTokenCoin:['/user/exchangeTokenCoin',{method:'post', checkLogin: true}],
    //首页分类
    classify: ['/config/advertisement/queryCategoryList', {method: 'get'}],
    //秀豆兑换比例
    getExchange:['/common/config/getExchange',{method:'get'}],
    //获取红包  type1:获取红包信息并领取 type2：获取红包信息
    getReceivePackage:['/promotion/promotionPromoter/userReceivePackage',{method:'get'}],
    //商品页面用户领取红包-->杨小猛
    givingPackageToUser:['/promotion/promotionPromoter/givingPackageToUser',{method:'get'}],
    //秒杀
    getLimitGo: ['/operator/seckill/homePage', {method: 'get'}],
    //是否显示秒杀
    isShowLimitGo: ['/advertising/timeLimitSecKill', {method: 'get'}]
}
import ApiUtils from '../../../api/network/ApiUtils';

const HomeAPI = ApiUtils(api);

export default HomeAPI;
