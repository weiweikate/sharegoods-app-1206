const api = {
    //支付宝查账
    alipayCheck: ['/pay/alipay/query', {method:'get'}],
    //微信支付查账
    wechatCheck: ['/pay/wxpay/query', {method: 'get'}],
    //支付宝支付:
    alipay: ['/pay/alipay'],
    //微信支付
    wachatpay: ['/pay/wxpay'],
    //支付宝+平台
    alipayAndBalance: ['/pay/mix-sg-alipay'],
    //微信+平台
    wechatAndBalance: ['/pay/mix-sg-wxpay'],
    //平台
    balance: ['/pay/sgpay'],
    //支付宝支付关闭
    closeAlipayOrder: ['/pay/close/alipay'],
    //微信支付关闭
    closeWeChatorder: ['/pay/close/wxpay'],
    //检查订单状态
    payStatus: ['/order/pay-status']
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
