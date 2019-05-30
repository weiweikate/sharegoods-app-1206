export default {
    // 获取优惠券列表
    userCouponList: ['/user/coupon/list', { method: 'post' }],
    // 获取订单可用优惠券列表[di.g]
    listAvailable: '/user/coupon/listOrderAvailableV2',
    queryCoupons: ['/user/coupon/queryByUserCode', { method: 'get' }]
};
