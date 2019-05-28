import ApiUtils from '../../../api/network/ApiUtils';


const api = {

    // 查询用户个人信息
    getUser: ['/user/getUser', { method: 'get', checkLogin: true }],
    // 查询消息
    floatMsg: ['/floatMsg/get', { method: 'get' }],

    // 查询首页推荐店铺
    queryHomeStore: ['/user/store/queryHomeStore', { method: 'get' }],
    // 查询店铺列表
    queryByStatusAndKeyword: ['/user/store/queryByStatusAndKeyword', { method: 'get' }],
    /**开店信息**/
    store_openStore: ['/user/store/openStore', { method: 'get' }],

    //test-------------test店铺支付成功
    depositTest: ['/user/store/deposit', { method: 'get' }],

    //获取保证金金额
    getMoney: ['/common/config/getMoney', { method: 'get' }],

    // 缴纳完保证金后 初始化店铺post
    initStore: '/user/store/initStore',
    // 开启店铺post
    startStore: '/user/store/startStore',
    // 关闭店铺
    closeStore: '/user/store/closeStore',


    // 根据id查询店铺
    getById: ['/user/store/getById', { method: 'get' }],

    // 同意/拒绝 他人加入店铺 -- 店主行为post
    agreeOrDisAgreeJoin: '/user/storeUser/agreeOrDisAgreeJoin',
    // 移除店铺人员 -- 店主行为post
    storeUserRemove: '/user/storeUser/remove',

    // 查看店铺人员列表 -- 共同行为get
    listByKeyword: ['/user/storeUser/listByKeyword', { method: 'get' }],
    // 查看店铺人员 -- 共同行为get
    findUserDetail: ['/user/storeUser/findUserDetail', { method: 'get' }],

    // 查看是否收藏店铺 -- 店员行为
    getByStoreId: ['/user/storeCollection/getByStoreId', { method: 'get' }],
    // 取消收藏店铺 -- 店员行为
    storeCollectionCancel: '/user/storeCollection/cancel',
    // 收藏店铺 -- 店员行为
    storeCollectionCollection: '/user/storeCollection/collection',

    // 举报店铺post
    storeTipOffInsert: '/user/storeTipOff/insert',
    // 请求加入店铺 -- 店员行为post
    addToStore: '/user/storeUser/addToStore',
    // 退出店铺 -- 店员行为post
    quitStore: '/user/storeUser/quitStore',

    // 更新店铺信息post
    updateStoreInfo: '/user/store/updateStoreInfo',
    // 加入店铺设置post
    invitationSetting: '/user/store/invitationSetting',
    // 根据店铺id查询店铺公告get
    queryByStoreId: ['/user/storeNotice/queryByStoreId', { method: 'get' }],
    // 删除公告post
    deleteById: '/user/storeNotice/deleteById',
    // 根据店铺公告id查询公告信息get
    findById: ['/user/storeNotice/findById', { method: 'get' }],
    // 发店铺公告post
    storeNoticeInsert: '/user/storeNotice/insert',

    /**店铺扩容**/
    /*
    * 拼店解散说明
    * */
    store_dissolve: ['/config/store/dissolve', { method: 'get' }],
    /*
    * 解散店铺
    * */
    store_disband: ['/user/store/disband', { method: 'get' }],
    /*
    * 查询店铺人员数量,最大人员数量,是否可以扩容
    * storeCode
    * */
    store_person: ['/user/store/person', { method: 'get' }],
    /*
    * 拼店扩容说明
    * */
    store_expansion: ['/config/store/expansion', { method: 'get' }],
    /*
    * 根据店铺code查询当前店铺所在等级的扩展信息
    * storeCode
    * */
    store_expend: ['/user/store/expend', { method: 'get' }],
    /*
    * 创建扩容订单
    * expandId
    * */
    store_save: ['/user/store/save', { method: 'get' }],
    /*
    * 扩容列表
    * expandId
    * */
    store_record: ['/user/store/record', { method: 'get' }],

    //去支付测试
    user_pay: ['/user/pay', { method: 'get' }]
};
const SpellShopApi = ApiUtils(api);
export default SpellShopApi;
