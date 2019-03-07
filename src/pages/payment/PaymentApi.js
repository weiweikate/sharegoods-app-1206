const api = {
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
    //检查订单状态
    payStatus: ['/order/pay-status'],
    //平台余额支付接口
    platformPay: ['/gateway/payV2/platform']
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
