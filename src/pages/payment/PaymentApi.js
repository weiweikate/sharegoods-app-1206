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
    payStatus: ['/payV2/status'],
    //平台余额支付接口
    platformPay: ['/payV2/platform'],
    //检查订单状态:
    // check: ['/payV2/check', {method:'get'}],
    check:['/pay/pay/payOrder'],
    //支付宝支付v2
    alipay: ['/payV2/alipay'],
    //微信支付v2
    wechatPay: ['/payV2/wxpay']
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
