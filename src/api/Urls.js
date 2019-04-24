export default {
    demo: ['/demo/signTest?ddd=1', { method: 'post' }],
    apiDemoList: ['/api/demo/list', { method: 'get' }],
    apiDemoAdd: '/api/demo/add',
    apiDemoUpdate: '/api/demo/update',
    apiDemoDelete: '/api/demo/delete',
    alertDemoData: ['/api/test/data', { method: 'post' }], // 测试接口

    // 获取优惠券列表
    userCouponList: ['/user/coupon/list', { method: 'post' }],
    // 获取订单可用优惠券列表[di.g]
    listAvailable: '/user/coupon/listOrderAvailableV2',
    queryCoupons: ['/user/coupon/queryByUserCode', { method: 'get' }]
};
