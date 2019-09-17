export const SGscmSource = {
    topic: 1,//专题
    show: 2,//秀场
    activity: 3,//临时活动
    search: 4,//搜索
    recommend: {
        shopCar: 'shopCar',
        egg: 'egg',
        grid: 'grid',
        card: 'card',
        jc: 'jc',
        product: 'productId',
        orderComplete: 'orderComplete',
        shareOrder: 'shareOrder',
    },//推荐
    pin: 6,//拼店
    marketing: 7,//营销
    group: 8//拼团

}


export const HomeSource = {
    alert: 1,//首页弹窗广告位
    banner: 2,//首页BANNER广告位
    icon: 3,//首页icon图标
    newbanner: 4,//首页通栏BANNER
    recommend: 5,//首页推荐位
    limitGo: 6,//限时购
    marketing: 7,//首页配置
    hot: 8,//首页超值热卖
    recommend: 9,//为你推荐
    float: 10,//右下角浮动广告位
    launchAd: 11//APP开机闪屏广告位

}

export function getSGscm(source = 'none',id = 'none', strategy = 'none', algorithm = 'none') {
    return source + id + strategy + algorithm
}


export function getSGspm_home(source,index = 1) {
  return '1,1'+source+index
}
