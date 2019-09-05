import RouterMap, { routePush } from '../../navigation/RouterMap';
import { track, trackEvent } from '../../utils/SensorsTrack';

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
    shopBanner: 23,//拼店详情底部banner
    custom_imgAD: 'WIDGET-IMAGE-ADV',
    custom_text: 'WIDGET-TEXT',
    custom_goods: 'WIDGET-GOODS',
    placeholder: 'placeholder',
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
    homeIcon: 11, //首页4个图标
    // homeStar: 3, //3：app首页明星店铺推荐位
    homeToday: 4, //4:app首页今日榜单广告位
    homeRecommad: 5, //5：app首页精品推荐广告位
    homeSubject: 6,//6：app首页超值热卖专题广告位
    homeForyou: 7, //7：app首页为你推荐广告位
    // homeFloat:8,//app首页右下角浮动广告位
    homeExpand: 9,// app通用广告位
// 21：拼店首页banner推荐位
    homeCategory: 31,// 类目搜索banner广告位
    homeDiy: 13,//自定义模块
// 32：秀场banner推荐
// 41：签到广告位
// 51：登录/注册页面广告位
// 100：其他
};

export const ContentType = {
    none: 0, //  6：限时购 7：抽奖 8：直降商品 9：优惠券 10：文本 11：tab导航
    good:1 ,//：商品
    zt: 3,//专题
    show: 4, //秀场
    gift: 5, //礼包
    limtGo: 7,//抽奖
    good_coupon: 8,//直降商品
    coupon: 9,//
    text: 10,//文本
    tab: 11,//tab导航
}


export function topicAdOnPress(data, item, p, title) {
    let p2 = {}
    let linkValues = item.linkValue;
    let linkType = item.linkType;
    let linkValue = ''
    if (  linkValues ){
        if (linkValues.length > 1){
            linkType = 99;
        }
        if (linkValues.length > 0){
            linkValue = linkValues[0];
        }

    }
    switch (linkType){
        case 1:
            p2.contentType = 1
            p2.contentKey = linkValue
            routePush(RouterMap.ProductDetailPage,{productCode: linkValue})
        case 4:
            p2.contentType = 8
            p2.contentKey = linkValue
            routePush(RouterMap.ProductDetailPage,{productCode: linkValue})
            break
        case 2:
            p2.contentType = 3
            p2.contentKey = linkValue
            if (linkValue &&  linkValue.indexOf('ZT') === 0) {
                routePush('HtmlPage', {uri: '/subject/' + linkValue})
            }else if (linkValue &&  linkValue.indexOf('ST') === 0) {
                routePush('HtmlPage', {uri: '/topic/temp/' + linkValue})
            }else {
                routePush('HtmlPage', {uri: '/custom/' + linkValue})
            }
            break
        case 3:
            p2.contentType = 6
            p2.contentKey = '/spike'
            routePush('HtmlPage', {uri: '/spike'})
            break
        case 99:
            routePush('HtmlPage', {uri: `/search?c=${data.code + item.linkId}`})
            break
    }
    if (p){
        p.contentValue = title || '';
        track(trackEvent.SpecialTopicBtnClick, {...p});
    }
}
