const api = {
    //微信支付
    wachatpay: ['/pay/wxpay'],
    //支付宝+平台
    alipayAndBalance: ['/pay/mix-sg-alipay'],
    //微信+平台
    wechatAndBalance: ['/pay/mix-sg-wxpay'],
    //平台
    balance: ['/pay/sgpay'],
    //检查订单状态
    // payStatus: ['/payV2/status'],
    payStatus: ['/pay/pay/payOrder/info'],
    //平台余额支付接口
    // platformPay: ['/payV2/platform'],
    platformPay: ['/pay/pay/payment'],
    //检查订单状态:
    // check: ['/payV2/check', {method:'get'}],
    check:['/pay/pay/payOrder'],
    //支付宝支付v2
    // alipay: ['/payV2/alipay'],
    alipay: ['/pay/pay/payment'],
    //微信支付v2
    wechatPay: ['/payV2/wxpay'],
    //支付成功后的相关接口 参数 popupBoxType: 2
    getUserPopupBoxByType:['/popup/getPopupBoxByType',{method:'get'}],

    getUserCouponAmount:['/user/coupon/getUserCouponAmount',{method:'get'}],
    //支付成功后判断是否可以分享
    judgeShare: ['/user/share/judgeShare'],
    //分享后的回调
    shareCallback: ['/user/share/shareCallback'],
    //支付成功后是否给弹窗判断接口
    jumpCheckIsAlter: ['/bargain/jumpCheck',{method:'get'}],
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
