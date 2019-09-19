import ApiUtils from '../../../api/network/ApiUtils';

const api = {
    //是否开店
    checkQualificationOpenStore: ['/app/store/user/checkQualificationOpenStore', { method: 'get' }],
    //新开
    app_store_post: '/app/store',
    //修改
    app_store_put: ['/app/store/update'],
    //删除
    app_store_delete: ['/app/store', { method: 'delete' }],
    //拆分
    app_store_split: '/app/store/split',
    //查看path
    app_store: ['/app/store', { method: 'get' }],
    //首页
    app_store_user_store: ['/app/store/user_store', { method: 'get' }],
    //获取列表get
    app_store_get: ['/app/store', { method: 'get' }],
    //搜
    app_store_list: ['/app/store/list', { method: 'get' }],
    /**店铺公告**/
    // 发布店铺公告
    storeNoticeInsert: '/app/store/notice/insert',
    // 删除公告
    deleteById: ['/app/store/notice/delete', { method: 'get' }],
    // 公告列表
    queryByStoreId: ['/app/store/notice/list', { method: 'get' }],
    /**店铺管理**/
    //举报店铺
    storeTipOffInsert: '/app/store/tipoff/save',
    //移除店铺人员
    storeUserRemove: '/user/storeUser/remove',
    // 退出店铺
    quitStore: '/app/store/user/quit',
    //查询店铺人员
    app_store_homePageList: ['/app/store/user/homePageList', { method: 'get' }],
    //查看店铺人员总列表
    user_list: ['/app/store/user/list', { method: 'get' }],
    //是否显示活动图标
    package_identification: ['/app/store/user/package/identification', { method: 'get' }],
    //获取店员详情
    findUserDetail: ['/user/storeUser/findUserDetail', { method: 'get' }],

    //查询用户个人信息
    getUser: ['/user/getUser', { method: 'get', checkLogin: true }],
    // 查询消息
    floatMsg: ['/floatMsg/get', { method: 'get' }],

    /**开店信息**/
    store_openStore: ['/user/store/openStore', { method: 'get' }],

    // 请求加入店铺 -- 店员行为post
    addToStore: '/user/storeUser/addToStore',
    // 根据店铺公告id查询公告信息get
    findById: ['/user/storeNotice/findById', { method: 'get' }],

    /**店铺扩容**/
    /*
    * 查询店铺人员数量,最大人员数量,是否可以扩容
    * storeCode
    * */
    expand_expandInfo: ['/app/store/expand/expandInfo', { method: 'get' }],
    /*
    * 拼店扩容说明
    * */
    store_expansion: ['/config/store/expansion', { method: 'get' }],
    /*
    * 商品列表
    * storeCode
    * */
    expand_goodsList: ['/app/store/expand/goodsList', { method: 'get' }],
    /*
    * 扩容列表
    * expandId
    * */
    expand_recordList: ['/app/store/expand/recordList', { method: 'get' }]
};
const StoreApi = ApiUtils(api);
export default StoreApi;
