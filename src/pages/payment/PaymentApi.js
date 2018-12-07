const api = {
     // 用户预支付
    prePay: '/order/prePay',
    //支付成功回调
    paySuccess: '/order/paySuccess',
    //继续支付
    continuePay:'/order/payRecord/continuePay',
    //继续去支付
    continueToPay:['/order/payRecord/continueToPay',{method:'get'}],
    //检查订单状态
    checkOrderStatus: ['/order/lookDetail'],
    //店铺保证金
    storePayment:['/user/store/deposit', {method:'get'}],
    //支付宝查账
    alipayCheck: ['http://172.16.10.178:9090/gateway/pay/alipay/query', {method:'get'}],
    //微信支付查账
    wechatCheck: ['http://172.16.10.178:9090/gateway/pay/wxpay/query', {method: 'get'}],
    //支付宝支付:
    alipay: ['http://172.16.10.178:9090/gateway/pay/alipay'],
    //微信支付
    wachatpay: ['http://172.16.10.178:9090/gateway/pay/wxpay'],
    //支付宝+平台
    alipayAndBalance: ['http://172.16.10.178:9090/gateway/pay/ali-sg-pay'],
    //微信+平台
    wechatAndBalance: ['http://172.16.10.178:9090/gateway/pay/wx-sg-pay'],
    //平台
    balance: ['http://172.16.10.178:9090/gateway/pay/sgpay']
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
