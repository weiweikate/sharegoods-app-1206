export const homeType = {
  swiper: 1,           //轮播
  ad: 2,       //推荐
  subject: 6,         //专题
  today: 4,             //今日榜单
  recommend: 5,     //精品推荐
  goods: 8,
  other: 'other',
  classify: 'classify',
  category: 'category',
  goodsTitle: 'goodsTitle',
  user: 'user',
  show: 11,            //秀场
  web: 10,
  banner: 14
}


export const homeLinkType = {
  good: 1,      //普通商品
  subject: 2,   //专题
  down: 3,      //降价拍
  spike: 4,     //秒杀
  package: 5,   //礼包
  exp: 6,       //经验值
  store: 8,     //店铺
  web: 10,      //web连接
  show: 11      //秀场
};

export const homeRoute = {
  [homeLinkType.good]: 'product/ProductDetailPage',
  [homeLinkType.subject]: 'topic/DownPricePage',
  [homeLinkType.down]: 'topic/TopicDetailPage',
  [homeLinkType.spike]: 'topic/TopicDetailPage',
  [homeLinkType.package]: 'topic/TopicDetailPage',
  [homeLinkType.store]: 'spellShop/MyShop_RecruitPage',
  [homeLinkType.web]: 'HtmlPage',
  [homeLinkType.show]: 'show/ShowDetailPage',
  [homeLinkType.exp]: 'product/xpProduct/XpDetailPage'
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
// 9：app通用广告位
// 21：拼店首页banner推荐位
// 31：类目搜索banner广告位
// 32：秀场banner推荐
// 41：签到广告位
// 51：登录/注册页面广告位
// 100：其他
}
