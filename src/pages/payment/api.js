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

};
import ApiUtils from '../../api/network/ApiUtils';

const OrderApi = ApiUtils(api);

export default OrderApi;
