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
    alipayAndBalance: ['/pay/ali-sg-pay'],
    //微信+平台
    wechatAndBalance: ['/pay/wx-sg-pay'],
    //平台
    balance: ['/pay/sgpay']
};
import ApiUtils from '../../api/network/ApiUtils';

const PaymentApi = ApiUtils(api);

export default PaymentApi;
