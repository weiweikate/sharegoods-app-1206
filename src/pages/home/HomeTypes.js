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
