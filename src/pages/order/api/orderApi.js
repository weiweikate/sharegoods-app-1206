const api = {
    // 确认订单
    makeSureOrder: '/order/makeSureOrder',
    //order/submitOrder提交订单
    submitOrder: '/order/submitOrder',
    //订单列表  订单状态（1：待支付 2：待发货 3：待收货 4：确认收货 5：已完成 6：退货关闭 7：用户关闭 8：超时关闭）
    queryPage: '/order/queryPage',
    // 用户预支付
    prePay: '/order/prePay',
    //支付成功回调
    paySuccess: '/order/paySuccess',
    // （陈帅）订单详情
    lookDetail: '/order/lookDetail',
    // 加入购物车
    addItem: '/user/shoppingcart/addItem',
    //删除已关闭订单
    deleteClosedOrder: '/order/deleteClosedOrder',
    //确认收货
    confirmReceipt: '/order/confirmReceipt',
    //取消订单
    cancelOrder: '/order/cancelOrder',
};
import ApiUtils from '../../../api/network/ApiUtils';

const OrderApi = ApiUtils(api);

export default OrderApi;
