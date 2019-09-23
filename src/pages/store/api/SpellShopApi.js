import ApiUtils from '../../../api/network/ApiUtils';

const api = {
    //首页店铺状态
    app_store_user_store: ['/app/store/user_store', { method: 'get' }],
    //获取列表附近新开
    app_store_get: ['/app/store', { method: 'get' }],
    //搜索
    app_store_list: ['/app/store/list', { method: 'get' }],
    //是否能开店
    checkQualificationOpenStore: ['/app/store/user/checkQualificationOpenStore', { method: 'get' }],
    //开启店铺
    app_store_open: '/app/store/open',
    //拆分
    app_store_split: '/app/store/split',
    /**店铺公告**/
    // 发布店铺公告
    storeNoticeInsert: '/app/store/notice/insert',
    // 删除公告
    deleteById: ['/app/store/notice/delete', { method: 'get' }],
    // 公告列表
    queryByStoreId: ['/app/store/notice/list', { method: 'get' }],
    /**店铺管理**/
    //查看店铺path
    app_store: ['/app/store', { method: 'get' }],
    //修改店铺信息
    app_store_update: ['/app/store/update'],
    //请求加入店铺
    user_apply: '/app/store/user/apply',
    // 退出店铺
    quitStore: '/app/store/user/quit',
    //关闭店铺
    app_store_close: ['/app/store/close'],
    //举报店铺
    storeTipOffInsert: '/app/store/tipoff/save',
    //查询店铺人员
    app_store_homePageList: ['/app/store/user/homePageList', { method: 'get' }],
    //查看店铺人员总列表
    user_list: ['/app/store/user/list', { method: 'get' }],
    //是否显示活动图标
    package_identification: ['/app/store/user/package/identification', { method: 'get' }],

    //移除店铺人员
    storeUserRemove: '/app/store/user/remove',
    //还有购买校验接口
    //获取店员详情
    findUserDetail: ['/user/storeUser/findUserDetail', { method: 'get' }],
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
    expand_recordList: ['/app/store/expand/recordList', { method: 'get' }],


    // 查询消息
    floatMsg: ['/floatMsg/get', { method: 'get' }],

    store_openStore: ['/user/store/openStore', { method: 'get' }],
};
const StoreApi = ApiUtils(api);
export default StoreApi;
