export default {
    apiDemoList:'/api/demo/list',
    apiDemoAdd:'/api/demo/add',
    apiDemoUpdate:'/api/demo/update',
    apiDemoDelete:'/api/demo/delete',
    alertDemoData: ['/api/test/data', {method: 'post', loading: true}], // 测试接口
    loginWithWX: '/user/memberLogin/appWechatLogin',//微信登陆
    sendRegistrationCode: '/user/phoneCode/sendRegistrationCode',//用户注册
    sendUserLoginCode: '/user/phoneCode/sendUserLoginCode',//用户登录
    sendUserUpdateCode: '/user/phoneCode/sendUserUpdateCode',//用户修改
    sendExistedUserCode: '/user/phoneCode/sendExistedUserCode',//老用户激活
    phoneRegister: '/user/memberSign/findMemberByPhone',
    passwordLogin: '/user/memberLogin/passwordLogin',
    queryInviterList: '/user/memberSign/queryInviterList',
    signMember: '/user/memberSign/signMember',
    signMemberInfo: '/user/memberSign/signMemberInfo',
    codeLogin: '/user/memberLogin/codeLogin',
    auldUserLogin: '/user/memberLogin/auldUserLogin',
    resetPassword: '/user/memberLogin/resetPassword',
    existedUserVerify: '/user/memberLogin/existedUserVerify',
    existedUserLogin: '/user/memberLogin/existedUserLogin',
    findMemberByPhone: '/user/memberSign/findMemberByPhone',
    getHotWordsListActive: '/user/hotWord/getHotWordListActive',
    queryDetailBalanceListAPP: '/user/detailBalance/queryDetailBalanceListAPP',//分页查询现金账户收支明细
    queryDetailBonuSpointListAPP: '/user/DetailBonuSpoint/queryDetailBonuSpointListAPP',//分页查询分红点数账户收支明细
    queryDetailTokenCoinListAPP: '/user/detailTokenCoin/queryDetailTokenCoinListAPP',//分页查询代币账户收支明细
    queryDetailUserScorePageListAPP: '/user/detailUserScore/queryDetailUserScorePageListAPP',//分页查询积分账户收支明细
    findSettlementTotalByBalance: '/user/settlementTotal/findSettlementTotalByBalance',//查询待提现金额
    querySettlementTotalByDealerId: '/user/settlementTotal/querySettlementTotalByDealerId',//分页查询待提现账户
    findSettlementTotalByToken: '/user/settlementTotal/findSettlementTotalByToken',//可兑换代币
    addDetailTokenCoinByCarry: '/user/detailTokenCoin/addDetailTokenCoinByCarry',//提现代币
    findBankCardAndBalance: '/user/withdrawMoney/findBankCardAndBalance',//查询可提现银行卡以及余额方面信息
    addWithdrawMoney: '/user/withdrawMoney/addWithdrawMoney',//发起提现申请
    // withdrawMoney/findBankCardAndBalance
    findDealerAccountByIdAPP: '/user/dealer/findDealerAccountByIdAPP',
    searchProduct: '/user/search/searchProduct',
    findProductById: '/user/product/findProductById',
    getShoppingCartList: '/user/shoppingCart/getShoppingCartList',
    deleteFromShoppingCartByProductId: '/user/shoppingCart/deleteFromShoppingCartByProductId',
    updateShoppingCartItemsByProductId: '/user/shoppingCart/updateShoppingCartItemsByProductId',
    shoppingCartFormCookieToSessionProductNumberIsAble: '/user/shoppingCart/shoppingCartFormCookieToSessionProductNumberIsAble',//同步数量是否正确
    shoppingCartFormCookieToSession: '/user/shoppingCart/shoppingCartFormCookieToSession',//同步
    exitLogin: '/user/memberLogin/exitLogin',
    queryAllOrderPageList: '/order/order/queryAllOrderPageList',// 全部订单
    queryCompletedOrderPageList: '/order/order/queryCompletedOrderPageList',// 已完成订单
    queryUnPaidOrderPageList: '/order/order/queryUnPaidOrderPageList',// 待支付订单
    queryUnSendOutOrderPageList: '/order/order/queryUnSendOutOrderPageList',// 待发货订单
    queryWaitReceivingOrderPageList: '/order/order/queryWaitReceivingOrderPageList',// 待收货订单
    addToShoppingCart: '/user/shoppingCart/addToShoppingCart',// 添加购物车
    findProductStockBySpec: '/user/product/findProductStockBySpec',// 根据产品规格取值
    addUserAddress: '/user/userAddress/addUserAddress',// 新增地址
    queryUserAddressList: '/user/userAddress/queryUserAddressList',//获取列表
    updateUserAddress: '/user/userAddress/updateUserAddress',// 更新地址
    setDefaultAddress: '/user/userAddress/setDefaultAddress',// 设置默认地址
    deleteUserAddress: '/user/userAddress/deleteUserAddress',// 删除地址
    queryStoreHouseList: '/user/userAddress/queryStoreHouseList',// 自提地址
    deleteProductFavicon: '/user/productFavicon/deleteProductFavicon',//删除收藏
    addProductFavicon: '/user/productFavicon/addProductFavicon',// 添加收藏
    queryProductFaviconList: '/user/productFavicon/queryProductFaviconList',//收藏列表
    getOrderDetail: '/order/order/getOrderDetail',//获取订单详情
    submitOrder: '/order/order/submitOrder',//提交订单
    makeSureOrder: '/order/order/makeSureOrder',//购物车结算
    updateDealerNewPhoneById: '/user/dealer/updateDealerNewPhoneById',//修改手机号

    //commonAPI替换为user
    sendUserPhoneCode: '/user/phoneCode/sendUserPhoneCode',//旧手机短信短信
    updateDealerPhoneById: '/user/dealer/updateDealerPhoneById',//验证旧手机短信是否正确

    sendUserNewPhoneCode: '/user/phoneCode/sendUserNewPhoneCode',//新手机短信
    updateDealerPassword: '/user/dealer/updateDealerPassword',//修改密码
    queryProductList: '/user/product/queryProductList',//查询产品列表（编码）
    queryDealerAddressBook: "/user/dealer/queryDealerAddressBook",//通讯录查询
    findDealerAddressBookDetails: "/user/dealer/findDealerAddressBookDetails",//通讯录个人详情

    //commonAPI替换为user
    aliyunOSSUploadImage: "/user/ossClient/aliyunOSSUploadImage", //阿里图片上传
    queryHelpQuestionList: "/user/helpQuestion/queryHelpQuestionList",//客服问题类型与问题列表
    updateHelpQuestion: "/user/helpQuestion//user/helpQuestion/updateHelpQuestion",//是否有帮助
    findHelpQuestionById: "/user/helpQuestion/findHelpQuestionById",//根据ID找问题
    addFeedback: "/user/feedback/addFeedback",//添加反馈
    getAreaList: "/user/memberSign/getAreaList",//省市区
    getDiscountCouponUserd: "/user/discountCouponDealer/getDiscountCouponUserd",//已使用优惠券
    getDiscountCouponNoUse: "/user/discountCouponDealer/getDiscountCouponNoUse",//未使用优惠券
    getDiscountCouponLosed: '/user/discountCouponDealer/getDiscountCouponLosed',//失效优惠券
    getDiscountCouponById: '/user/discountCouponDealer/getDiscountCouponById',//优惠券详情
    availableDiscountCouponForProduct: "/user/discountCoupon/availableDiscountCouponForProduct",//订单页面可用优惠券
    takeDiscountCoupon: "/user/discountCouponDealer/takeDiscountCoupon",//添加优惠券
    calcFreight: "/order/order/calcFreight",//订单修改地址 邮费计算
    prePay: "/order/order/prePay",//预支付接口
    continueToPay: "/order/order/continueToPay",//继续去支付
    continuePay: "/order/order/continuePay",//继续支付
    cancelOrder: "/order/order/cancelOrder",//取消订单
    deleteClosedOrder: "/order/order/deleteClosedOrder",//删除已关闭(取消)订单
    deleteOrder: "/order/order/deleteOrder",//删除已完成订单
    confirmReceipt: "/order/order/confirmReceipt",//确认收货

    /**********************订单售后**************************/
    queryAftermarketOrderPageList: "/order/order/queryAftermarketOrderPageList",//我的售后
    orderRefund: "/order/order/orderRefund",//申请退款
    applyExchangeProduct: "/order/order/applyExchangeProduct",//申请换货
    applyReturnGoods: "/order/order/applyReturnGoods",//申请退货
    findReturnProductById: "/order/order/findReturnProductById",//查看退款退货换货情况
    fillInExpressInfoById: "/order/order/fillInExpressInfoById",//退货换货填写物流信息
    orderOneMore: "/order/order/orderOneMore",//再次购买
    queryTotalPushNum: "/user/push/queryTotalPushNum",//首页消息数量
    queryNoticeMessage: "/user/notice/queryNoticeMessage",//消息里的通知
    queryMessage: "/user/message/queryMessage",//消息里的消息
    queryStoreMessageList: "/user/storeMessage/queryStoreMessageList",//消息里的拼店消息
    queryPushNum: "/user/push/queryPushNum",//消息里数量
    find: "/user/delivery/find",//根据订单id查询快递信息
    findAllExpress: "/user/express/findAllExpress",//快递公司


    /************************广告位**********************************/
    queryAdList: '/user/ad/queryAdList',//广告位列表
    /************************拼店店铺收藏**********************************/
    storeCollectList: '/user/storeCollect/list',//收藏店铺列表
    storeCollectCancel: '/user/storeCollect/cancel',//取消店铺收藏
    storeCollectCollect: '/user/storeCollect/collect',//收藏店铺
    storeCollectFindCollect: '/user/storeCollect/findCollect',//查询店铺是否收藏

    /************************拼店-开店相关**********************************/
    openStore: '/user/store/openStore',//开启店铺 TODO????? 这个接口是否无用
    storeDeposit: '/user/store/deposit',//支付保证金
    levelIsCanAddStore: '/user/store/levelIsCanAddStore',//是否可以加入店
    levelIsCanOpenStore: '/user/store/levelIsCanOpenStore',//是否可以开店
    createStore: '/user/store/createStore',//正式创建店铺
    findConfig: '/user/config/findConfig',//查询拼店保障金
    getStoreBaseInfoByUserId: '/user/store/getStoreBaseInfoByUserId',//根据用户ID获取自己店铺基础信息
    /************************拼店-店铺管理**********************************/
    addStoreReport: '/user/storeReport/addStoreReport',//举报店铺
    getRecommendStore: '/user/store/getRecommendStore',//新店推荐
    getHotStore: '/user/store/getHotStore',//热店推荐
    searchStore: '/user/store/searchStore',//搜索开启店铺
    searchInviteStore: '/user/store/searchInviteStore',//搜索招募店铺
    updateStoreBaseInfo: '/user/store/updateStoreBaseInfo',//修改店铺信息
    updateStoreRecruitStatus: '/user/store/updateStoreRecruitStatus',//修改店铺加入状态
    getMemberList: '/user/storeUser/getMemberList',//成员列表
    getMemberDetail: '/user/storeUser/getMemberDetail',//成员详情
    dealerFindFirst: '/user/dealer/findFirst',//查询下级
    getOpenStoreById: '/user/store/getOpenStoreById',//根据ID查询开启店铺详细信息
    getOpenStoreByUserId: '/user/store/getOpenStoreByUserId',//根据用户ID查询开启店铺详细信息
    getInviteStoreById: '/user/store/getInviteStoreById',//根据ID查询店铺详细信息
    getInviteStoreByUserId: '/user/store/getInviteStoreByUserId',//根据用户ID查询店铺详细信息
    disagreeJoin: '/user/storeUser/disagreeJoin',//不同意邀请加入店铺
    cancelJoin: '/user/storeUser/cancelJoin',//取消邀请
    agreeJoin: '/user/storeUser/agreeJoin',//同意邀请加入店铺
    disagreeMemberJoin: '/user/storeUser/disagreeMemberJoin',//审核不同意加入
    agreeMemberJoin: '/user/storeUser/agreeMemberJoin',//审核同意加入
    cancelToStore: '/user/storeUser/cancelToStore',//用户取消申请加入
    addToStore: '/user/storeUser/addToStore',//用户申请加入
    removeMember: '/user/storeUser/removeMember',//移除成员
    quitStore: '/user/storeUser/quitStore',//退出店铺
    inviteToStore: '/user/storeUser/inviteToStore',//邀请用户加入店铺
    /************************拼店-店铺公告**********************************/
    deleteStoreNotice: '/user/storeNotice/deleteStoreNotice',//删除公告
    addStoreNotice: '/user/storeNotice/addStoreNotice',//发布公告
    queryStoreNoticeList: '/user/storeNotice/queryStoreNoticeList',//店铺公告列表

    /************************个人资料**********************************/
    updateDealerHeadImgById: '/user/dealer/updateDealerHeadImgById',//修改头像
    updateDealerSalePswById: '/user/dealer/updateDealerSalePswById',//判断2次输入的密码是否一致
    updateDealerForgetPasswordCodeById: '/user/dealer/updateDealerForgetPasswordCodeById',//忘记交易密码Code判断

    //commonAPI替换为user
    sendInitialUpdateCode: '/user/phoneCode/sendInitialUpdateCode',//发送修改交易密码(这个不用了，统一用下面一个)
    sendUserTransactionCode: '/user/phoneCode/sendUserTransactionCode',//发送交易初始密码

    updateDealerForgetPasswordById: '/user/dealer/updateDealerForgetPasswordById',//判断个人信息是否正确
    updateDealerOpenidById: '/user/dealer/updateDealerOpenidById',//微信账号解綁
    queryDictionaryDetailsType: '/user/dictionary/queryDictionaryDetailsType',//问题反馈类型
    getUserRealNameInfo: '/user/appRealName/getUserRealNameInfo',//用户实名认证
    findBindBankInfoByDealerId: '/user/bindBankInfo/findBindBankInfoByDealerId',//根据经销商ID查询绑定银行卡信息
    updateBindBankInfoDeleteById: '/user/bindBankInfo/updateBindBankInfoDeleteById',//根据ID删除绑定银行卡
    addBindBankInfo: '/user/bindBankInfo/addBindBankInfo',//添加银行卡
    findDealerBySalePsw: '/user/dealer/findDealerBySalePsw',//查询是否有交易密码
    updateDealerSalePswCodeById: '/user/dealer/updateDealerSalePswCodeById',//判断初始密码的验证码
    updateDealerSalePswByPassword: '/user/dealer/updateDealerSalePswByPassword',//根据旧密码修改新的交易密码
    updateDealerNicknameById: '/user/dealer/updateDealerNicknameById',//修改用户昵称
    updateDealerRegionById: '/user/dealer/updateDealerRegionById',//修改所在区域
    findBankInfo: '/user/bindBankInfo/findBankInfo',//查詢銀行卡信息

    /************************我的数据**********************************/
    myDataGroup: '/user/userInfo/group',//团队交易数据
    myDataLevel: '/user/userInfo/level',//当前等级
    myDataListUser: '/user/userInfo/listUser',//查询代理人、长久未登录的代理人 列表
    myDataGroupUser: '/user/userInfo/groupUser',//邀请数据
    myDataGroupLevel: '/user/userInfo/groupLevel',//邀请数据-成员等级分布

    operatorDepreciatelist: '/operator/operActivityDepreciate/operatorDepreciatelist',//降价拍列表
    subscribe: '/operator/operActivitySubscribe/subscribe',//提醒/取消提醒
    operatorfindById: "/operator/operActivityDepreciate/operatorfindById",//降价拍活动商品ID详情
    querySeckillList: '/operator/operActivitySeckill/queryActivitySeckillList',//秒杀专题列表
    findOperatorSeckill: '/operator/operActivitySeckill/findActivitySeckillById',//秒杀ID详情
    queryOperActivityPackagePageList: '/operator/operActivityPackage/queryOperActivityPackagePageList',//优惠套餐列表
    findOperActivityPackageDetails: '/operator/operActivityPackage/findOperActivityPackageDetails',//优惠套餐详情
    findOperActivityPackageSpecList: '/operator/operActivityPackage/findOperActivityPackageSpecList',//优惠套餐规格
    getGiftBagSpec: '/order/giftBag/getGiftBagSpec',//礼包规格获取
};
