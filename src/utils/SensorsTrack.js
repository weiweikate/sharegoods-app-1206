import { NativeModules } from 'react-native';
import SensorsEvent from './SensorsEvent'
const {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login
} = NativeModules.RNSensorsAnalyticsModule;
// track("event_name",parmas)
// trackTimerStart("event_name")
// trackTimerEnd("event_name",parmas)
const huchao = {

}

const spellShopTrack = {
    IndexStoreBannerClick:'IndexStoreBannerClick',//拼店首页banner推荐位
    SharePin:'SharePin',//分享拼店
    SeePingdian:'SeePingdian',//查看拼店
}

const productTrack = {
    CategorySearchBannerClick:'CategorySearchBannerClick',//类目搜索banner广告位
    ProductListClick:'ProductListClick',//搜索页-商品列表页点击
    Search:'Search',//搜索
    ProductDetail:'ProductDetail',//浏览商品详情页,
    AddToShoppingcart:'AddToShoppingcart',//加入购物车
    Share:'Share',//分享商品
}
/** 订单相关的埋点事件名称*/
const inviteEvent = {
    QrcodeShareto: 'QrCodeShareto',//分享二维码
}
const trackEvent = {
    ...huchao,
    ...spellShopTrack,
    ...productTrack,
    ...inviteEvent,
    bannerClick: 'AdBannerClick',//banner点击
    bannerSwiper: 'AdBannerShow',//banner滑动
    recommanderBannerClick: 'RecommanderBannerClick', //推荐为banner点击
    billboardBannerClick: 'BillboardBannerClick', //今日榜单
    selectedBannerClick: 'SelectedBannerClick', //精品推荐
    hotsellBannerClick: 'HotsellBannerClick', //app首页超值热卖专题广告位
    recommendedForYouBannerClick: 'RecommendedForYouBannerClick', //app首页为你推荐广告位
    login: 'Login',//登录
    signUp: 'SignUp',//注册
    search: 'Search',//商品搜索
    submitOrderDetail: 'SubmitOrderDetail',//提交订单详情
    payOrder: 'PayOrder',//支付订单
    payOrderDetail: 'PayOrderDetail',//支付订单详情
    cancelPayOrder: 'CancelPayOrder',//取消订单
    applyReturn: 'ApplyReturn',//申请退货
    receiveDiscount: 'ReceiveCoupons',//领取优惠券
    receiveOneyuan: 'ReceiveOneyuan',//领一元券
    receiveExp: 'ReceiveExp',//经验值变动
    receiveshowDou: 'ReceiveshowDou',//秀豆变动
    contact: 'Contact',//联系客服
    ArticleDisplay: 'ArticleDisplay',//文章浏览
    ArticleShare: 'ArticleShare',// 文章分享
    BuyGiftSubmit: 'BuyGiftSubmit',//购买礼包
    MesInviteJoinPin: 'MesInviteJoinPin',//邀请加入拼店
    MesInviteJoinPinResult: 'MesInviteJoinPinResult',//邀请加入拼店—结果反馈
    MesApplyJoinPin: 'MesApplyJoinPin',//申请加入拼店
    MesApplyJoinPinResult: 'MesApplyJoinPinResult',//申请加入店铺——结果反馈
    ReceiveDividents: 'ReceiveDividents',//收到分红
    VIPChange: 'VIPChange',//会员流转
    QrcodeShareto: 'QrcodeShareto',//分享二维码,

    ProblemFeedback:'ProblemFeedback',//点击问题反馈,
    ClickContactCustomerService:'ClickContactCustomerService',//点击联系客服
    ViewCoupon:'ViewCoupon',//点击查看优惠券点击查看优惠券
    ViewWaitToRecord:'ViewWaitToRecord',//点击查看待入帐
    ModifuAvatarSuccess:'ModifuAvatarSuccess',//修改头像
    ViewMyOrder:'ViewMyOrder',//查看-我的订单
    OrderAgain:"OrderAgain",//再次购买
    submitOrder: 'SubmitOrder',//提交订单
};
function trackUtil(p) {
    let arr = {};
    let keys = Object.keys(p);
    const count = keys.length;
    for (let i = 0; i< count; i++) {
        let key = keys[i];
        let value = p[key]
        arr[key]= (s) => {
            track(value.name, {...value.params,...s})
        }
    }
    return arr;
}

const TrackApi = trackUtil(SensorsEvent)

export {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login,
    trackEvent,
    trackUtil,
    TrackApi
};

/**
 * 导出 login 方法给 RN 使用.
 *
 * @param loginId 用户唯一下登录ID
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.login("developer@sensorsdata.cn")}>
 *     </Button>
 */

/**
 * 导出 logout 方法给 RN 使用.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.logout()}>
 *     </Button>
 */

/**
 * 导出 trackViewScreen 方法给 RN 使用.
 *
 * 此方法用于 RN 中 Tab 切换页面的时候调用，用于记录 $AppViewScreen 事件.
 *
 * @param url        页面的 url  记录到 $url 字段中(如果不需要此属性，可以传 null ).
 * @param properties 页面的属性.
 *
 * 注：为保证记录到的 $AppViewScreen 事件和 Auto Track 采集的一致，
 *    需要传入 $title（页面的title） 、$screen_name （页面的名称，即 包名.类名）字段.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.trackViewScreen(null,{"$title":"RN主页","$screen_name":"cn.sensorsdata.demo.RNHome"})}>
 *     </Button>
 *
 */
