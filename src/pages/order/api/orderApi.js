const api = {
    // 确认订单
    makeSureOrder: ['/orderV2/confirm',{ isRSA: true }],
    //order/submitOrder提交订单
    submitOrder: ['/orderV2/submit',{ isRSA: true }],
    //订单列表  订单状态（1：待支付 2：待发货 3：待收货 4：确认收货 5：已完成 6：退货关闭 7：用户关闭 8：超时关闭）
    queryPage: ['/orderV2/list',{method:'get'}],
    // 用户预支付
    prePay: '/order/prePay',
    //支付成功回调
    paySuccess: '/order/paySuccess',
    // （陈帅）订单详情
    lookDetail: ['/orderV2/detail',{method:'get'}],
    // 加入购物车
    addItem: '/user/shoppingcart/addItem',
    //删除已关闭订单
    deleteOrder: '/orderV2/delete',
    //删除已完成订单
    // deleteCompletedOrder:'/order/delete',
    //确认收货
    confirmReceipt: '/orderV2/confirmReceipt',
    //取消订单
    cancelOrder: '/orderV2/cancel',
    getAllProductOrder: ['/orderV2/getAllProductOrder',{method:'get'}],//查询平台订单下所有商品订单
    //继续支付
    continuePay:'/order/payRecord/continuePay',
    //继续去支付
    continueToPay:['/order/payRecord/continueToPay',{method:'get'}],
    // 查看物流详情
    findLogisticsDetail:['/orderV2/logisticsInfo',{method:'get'}],
    //（陈帅）再来一单
    againOrder:'/order/buy-again',
    checkInfo: ["/appraise/checkCommentStatus",{method:'get'}],//校验是否可晒单
    getExpressPackageDetail: ['/orderV2/getExpressPackageDetail',{method:'get'}],//查询商家订单物流包裹详情
    /**  售后模块相关接口 huchao */

    findAllExpress: ['/express/query', {method: 'get'}],
    getReturnReason: ['/config/sysDictionary/queryDictionaryTypeList', {method: 'get'}],
    //后台（潘红亮）
    afterSaleApply: '/after_sale/user/apply',//提交申请
    afterSaleDetail: '/after_sale/user/detail',//售后详情
    afterSaleCancel: '/after_sale/user/cancel',//取消申请
    afterSaleModify: '/after_sale/user/modify',//修改申请
    afterSaleFillExpress: '/after_sale/user/fill_return_express',//填写物,流
    afterSaleProduceDetail: ['/after_sale/user/product_detail', { method: 'get'}],//申请售后查询商品订单详情
    afterSaleList: '/after_sale/user/list',//列表
    return_express: "/after_sale/user/return_express",
    return_address: ["/after_sale/user/return_address", { method: 'get'}],//寄回地址
    consultation: ["/after_sale/user/consultation", { method: 'get' }],
    //获取个人信息
    getUser: ['/user/getUser', { method: 'get', checkLogin: true }],
    getProductShopInfoBySupplierCode: ['/product/getProductShopInfoBySupplierCode',{method:'get'}],
};
import ApiUtils from '../../../api/network/ApiUtils';

const OrderApi = ApiUtils(api);

export default OrderApi;
