export const homeType = {
  swiper: 1,           //轮播
  ad: 2,       //推荐
  subject: 6,         //专题
  starShop: 3,       //明星店铺
  today: 4,             //今日榜单
  recommend: 5,     //精品推荐
  goods: 8,
  other: 'other',
  classify: 'classify',
  category: 'category',
  goodsTitle: 'goodsTitle',
  user: 'user',
  show: 11,            //秀场
  web: 10
}


export const homeLinkType = {
  good: 1,
  subject: 2,
  down: 3,
  spike: 4,
  package: 5,
  exp: 6, //经验值
  store: 8,
  web: 10,
  show: 11
};

export const homeRoute = {
  [homeLinkType.good]: 'home/product/ProductDetailPage',
  [homeLinkType.subject]: 'topic/DownPricePage',
  [homeLinkType.down]: 'topic/TopicDetailPage',
  [homeLinkType.spike]: 'topic/TopicDetailPage',
  [homeLinkType.package]: 'topic/TopicDetailPage',
  [homeLinkType.store]: 'spellShop/MyShop_RecruitPage',
  [homeLinkType.web]: 'HtmlPage',
  [homeLinkType.show]: 'show/ShowDetailPage',
  [homeLinkType.exp]: 'home/product/xpProduct/XpDetailPage'
};
