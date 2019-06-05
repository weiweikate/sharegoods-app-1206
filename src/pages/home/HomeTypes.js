
export const homeType = {
    swiper: 2,           // 首页顶部轮播
    expandBanner: 3,     // 首页通栏广告位
    channel: 4,          // 首页频道类目
    focusGrid: 5,        // 首页焦点推荐位
    star: 6,             // 明星店铺
    today: 7,            // 今日榜单
    fine: 8,             // 精品推荐
    homeHot: 9,          // 超值热卖
    float: 10,           // 右下角浮动框
    goods: 18,           // 为你推荐商品
    pinShop: 12,          // 拼店banner
    discover: 13,          // 发现banner
    signIn: 19,          // 签到弹窗
    other: 'other',
    classify: 'classify',
    category: 'category',
    goodsTitle: 'goodsTitle',
    task: 'task',
    user: 'user',
    show: 11,            //秀场
    banner: 14,
    limitGo: 300,   //限时秒杀
    windowAlert: 1, //首页弹框
    guideInfo: 17,
    Alert: 21,//退出的弹窗
    shopProducts: 22,//拼店详情商品列表
    shopBanner: 23//拼店详情底部banner
};


export const homeLinkType = {
    good: 1,      //普通商品
    subject: 2,   //专题
    down: 3,      //降价拍
    spike: 4,     //秒杀
    package: 5,   //礼包
    link: 6,       //链接
    discover: 7,     //秀场
    exp: 8,      //经验值专区
    lottery: 9,      //抽奖
    customTopic: 10,      //自定义专题
    store: 11,      //店铺
    classify: 12,      //分类
    nothing: 13,      //无跳转
    page: 14      //页面路由
};

export const homeRoute = {
    [homeLinkType.good]: 'product/ProductDetailPage',
    [homeLinkType.subject]: 'topic/DownPricePage',
    [homeLinkType.down]: 'topic/TopicDetailPage',
    [homeLinkType.spike]: 'product/ProductDetailPage',
    [homeLinkType.package]: 'topic/TopicDetailPage',
    [homeLinkType.store]: 'spellShop/MyShop_RecruitPage',
    [homeLinkType.link]: 'HtmlPage',
    [homeLinkType.lottery]: 'HtmlPage',
    [homeLinkType.customTopic]: 'HtmlPage',
    [homeLinkType.discover]: 'show/ShowRichTextDetailPage',
    [homeLinkType.exp]: 'product/xpProduct/XpDetailPage',
    [homeLinkType.classify]: 'home/search/SearchResultPage',
    [homeLinkType.nothing]: '',  // 不做跳转
    [homeLinkType.page]: ''      // 跳转到页面
};

//埋点
export const homePoint = {
    none: 0, //0：未知
    homeBanner: 1, //1：app首页banner广告位
    homeAd: 2, //2：app首页推荐位
    homeStar: 3, //3：app首页明星店铺推荐位
    homeToday: 4, //4:app首页今日榜单广告位
    homeRecommad: 5, //5：app首页精品推荐广告位
    homeSubject: 6,//6：app首页超值热卖专题广告位
    homeForyou: 7, //7：app首页为你推荐广告位
// 8：app首页右下角浮动广告位
    homeExpand: 9,// app通用广告位
// 21：拼店首页banner推荐位
    homeCategory: 31// 类目搜索banner广告位
// 32：秀场banner推荐
// 41：签到广告位
// 51：登录/注册页面广告位
// 100：其他
};
