import { NativeModules } from 'react-native';

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

/** 订单相关的埋点事件名称*/
const trackEvent = {
    bannerClick: 'bannerClick',//banner点击
    login: 'login',//登录
    signUp: 'signUp',//注册
    search: 'search',//商品搜索
    commodityDetail: 'commodityDetail',//浏览商品详情页
    addToShoppingcart: 'addToShoppingcart',//加入购物车
    submitOrder: 'submitOrder',//提交订单
    submitOrderDetail: 'submitOrderDetail',//提交订单详情
    payOrderpayOrder: 'payOrderpayOrder',//支付订单支付订单
    payOrderDetail: 'payOrderDetail',//支付订单详情
    cancelPayOrder: 'cancelPayOrder',//取消订单
    applyReturn: 'applyReturn',//申请退货
    receiveDiscountreceiveDiscount: 'receiveDiscountreceiveDiscount',//领取优惠券领取优惠券
    share: 'share',//分享商品
    contact: 'contact',//联系客服
    QrcodeShareto: 'QrcodeShareto'//分享二维码
};


export {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login,
    trackEvent
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
