import { NativeModules } from 'react-native';
const {track, trackTimerStart, trackTimerEnd} = NativeModules.RNSensorsAnalyticsModule;
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
    QrcodeShareto: 'QrcodeShareto',//分享二维码
};


export {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackEvent
};
