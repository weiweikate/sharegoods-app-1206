const api = {
     // 用户预支付
    prePay: '/order/prePay',
    //支付成功回调
    paySuccess: '/order/paySuccess',
    //取消订单
    cancelOrder: '/order/cancelOrder',
    //继续支付
    continuePay:'/order/payRecord/continuePay',
    //继续去支付
    continueToPay:['/order/payRecord/continueToPay',{method:'get'}],
    //检查订单状态
    checkOrderStatus: ['/order/lookDetail'],
    //店铺保证金
    storePayment:['/user/store/deposit', {method:'get'}],
    //支付宝查账
    alipayCheck: ['/aliPay/aliPayQuery', {method:'get'}],
    //微信支付查账
    wechatCheck: ['/weChatPay/weChatQuery', {method: 'get'}]
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
