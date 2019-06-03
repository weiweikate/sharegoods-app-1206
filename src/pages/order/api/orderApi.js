const api = {
    // 确认订单
    makeSureOrder: ['/order/confirm',{ isRSA: true }],
    //order/submitOrder提交订单
    submitOrder: ['/order/submitV2',{ isRSA: true }],
    //订单列表  订单状态（1：待支付 2：待发货 3：待收货 4：确认收货 5：已完成 6：退货关闭 7：用户关闭 8：超时关闭）
    queryPage: ['/order/list',{method:'get'}],
    //订单搜索
    orderSearch:['/order/search',{method:'get'}],
    // 用户预支付
    prePay: '/order/prePay',
    //支付成功回调
    paySuccess: '/order/paySuccess',
    // （陈帅）订单详情
    lookDetail: '/order/detail',
    // 加入购物车
    addItem: '/user/shoppingcart/addItem',
    //删除已关闭订单
    deleteOrder: '/order/delete',
    //删除已完成订单
    // deleteCompletedOrder:'/order/delete',
    //订单物流信息
    orderDeliverInfo:'./order/deliverInfo',
    //确认收货
    confirmReceipt: '/order/confirm-receipt',
    //取消订单
    cancelOrder: '/order/cancel',
    //继续支付
    continuePay:'/order/payRecord/continuePay',
    //继续去支付
    continueToPay:['/order/payRecord/continueToPay',{method:'get'}],
    // 查看物流详情
    findLogisticsDetail:'/order/deliverInfo',
    //降价拍的确认订单
    DepreciateMakeSureOrder:['/operator/activityDepreciate/submit',{ isRSA: true }],
    //降价拍的提交订单 沈耀鑫
    DepreciateSubmitOrder:['/operator/activityDepreciate/submit',{ isRSA: true }],
    //秒杀的确认订单
    SeckillMakeSureOrder:['/operator/seckill/submit',{ isRSA: true }],
    //秒杀的提交订单
    SeckillSubmitOrder:['/operator/seckill/submit',{ isRSA: true }],
    //礼包的确认订单
    PackageMakeSureOrder:['/operator/activitypackage/submit',{ isRSA: true }],
    //礼包的提交订单
    PackageSubmitOrder:['/operator/activitypackage/submit',{ isRSA: true }],
    //（陈帅）再来一单
    againOrder:'/order/buy-again',
    /**  售后模块相关接口 huchao */

    findAllExpress: ['/express/query', {method: 'get'}],
    getReturnReason: ['/config/sysDictionary/queryDictionaryTypeList', {method: 'get'}],
    //网关（顾佳豪）， 后台（陈帅）
    afterSaleApply: '/after-sale/apply',//提交申请
    afterSaleDetail: '/after-sale/detail',//售后详情
    afterSaleCancel: '/after-sale/cancel',//取消申请
    afterSaleModify: '/after-sale/modify',//修改申请
    afterSaleFillExpress: '/after-sale/express',//填写物流
    subOrder: '/after-sale/order-detail',//子订单
    afterSaleList: '/after-sale/list',//列表
    checkInfo: ["/appraise/checkCommentStatus",{method:'get'}],//校验是否可晒单
    return_express: "/after-sale/return-express",
    //获取个人信息
    getUser: ['/user/getUser', { method: 'get', checkLogin: true }],
    getProductShopInfoBySupplierCode: ['/product/getProductShopInfoBySupplierCode',{method:'get'}],
};
import ApiUtils from '../../../api/network/ApiUtils';

const OrderApi = ApiUtils(api);

export default OrderApi;
