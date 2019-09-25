const api = {
    // 检查手机号是否已经注册过
    findMemberByPhone: '/user/userSign/findMemberByPhone',
    // 注册时随机显示的四个邀请人
    queryInviterList: '/user/userSign/queryInviterList',
    //重置密码
    resetPassword: '/user/userSign/resetPassword',
    //用户注册
    signUser: '/user/userSign/signUser',
    //验证码登陆
    codeLogin: '/user/userLogin/codeLogin',
    //密码登陆
    passwordLogin: '/user/userLogin/passwordLogin',
    //获取个人信息
    getUser: ['/user/getUser', { method: 'get', checkLogin: true }],
    //根据ID查询问题详情
    findHelpQuestionById: ['/help/helpQuestion/findHelpQuestionById', { method: 'get' }],
    //查询问题的列表
    queryHelpQuestionList: ['/help/helpQuestion/queryHelpQuestionList', { method: 'get' }],
    //用户反馈帮助问题是否有用
    updateHelpQuestionToClick: '/help/helpQuestion/updateHelpQuestionToClick',
    //文件上传（OSS）
    oss: '/common/upload/oss',
    //根据字典类型获取字典数据 WTLX
    queryDictionaryTypeList: ['/config/sysDictionary/queryDictionaryTypeList', { method: 'get' }],
    //添加反馈:
    addFeedback: '/user/feedback/addFeedback',
    //取消收藏店铺 -- 店员行为
    cancelCollection: '/user/storeCollection/cancel',
    //修改用户个人信息 type:1:修改头像 2:修改名字 3:修改省市区 4:微信绑定(openid 和 wechatName) 6:修改简介
    updateUserById: '/user/updateUserById',
    // 删除地址
    delAddress: ['/user/userAddress/delete', { method: 'post' }],
    // 查询地址
    queryAddrList: ['/user/userAddress/query', { method: 'get' }],
    // 新增/修改地址
    addOrEditAddr: ['/user/userAddress/save', { method: 'post' }],
    // 设置默认地址
    setDefaultAddr: ['/user/userAddress/setDefault', { method: 'post' }],
    // 获取省市区列表
    getAreaList: ['/config/sysArea/queryAreaList', { method: 'get' }],
    // 验证手机验证码是否正确
    judgeCode: ['/user/judgePhoneCode', { method: 'post' }],
    //查询积分记录
    userScoreQuery: ['/user/userScore/query', { method: 'get' }],
    //查询余额记录
    userBalanceQuery: ['/user/userBalance/query', { method: 'get' }],
    //用户登出
    signOut: ['/user/userLogin/signOut', { method: 'get', checkLogin: true}],
    //添加实名认证
    addUserCertification: '/user/UserCertification/addUserCertification',
    // 修改手机号
    updatePhone: ['/user/updatePhone', { method: 'post' }],
    // 修改密码
    changePhonePwd: ['/user/updateLoginPassword', { method: 'post' }],
    //设置登录密码
    SetPhonePwd: '/user/setLoginPassword',
    //检查是否有登录密码
    checkPhonePwd: ['/user/getLoginPassword', { method: 'get' }],
    // 解绑微信号
    untiedWechat: ['/user/untiedWechat', { method: 'post' }],
    // 验证交易密码
    judgeSalesPassword: ['/user/judgeSalesPassword', { method: 'post' }],
    // 修改交易密码
    updateSalesOldPwd: ['/user/updateSalesPasswordByOldPassword', { method: 'post' }],
    // 修改交易密码
    updateSalesOldPwdByIDCard: ['/user/updateSalesPasswordByIdCard', { method: 'post' }],
    //取消收藏店铺 -
    storeCollectionCancel: '/user/storeCollection/cancel',
    //查看收藏的店铺列表
    queryCollection: ['/user/storeCollection/queryCollection', { method: 'get' }],
    //我的晋升
    getUserLevelInfo: ['/user/getUserLevelInfo', { method: 'get' }],
    // 获取下一等级的层级信息
    getNextLevelInfo: ['/user/level/getNextLevelInfo', { method: 'get' }],
    // 验证idCard是否正确
    judgeIdCard: ['/user/judgeIdCard', { method: 'post' }],
    // 设置初始交易密码
    initSalesPassword: ['/user/initSalesPassword', { method: 'post' }],
    // 获取app版本
    getVersion: ['/core/sysAppVsersion/getVersionUpdate', { method: 'get' }],
    //分页查询用户购买信息列表
    getUserPromotionPromoter:['/promotion/promotionPromoter/queryUserBuyPromotionPromoter',{method:'post'}],
    //推广红包列表
    getPromotionPackageList:['/user/promotionPackage/queryPromotionPackagePageList',{method:'post'}],
    //分页查询用户领取红包记录列表
    getPromotionReceiveRecord:['/promotion/promotionReceiveRecord/queryPromotionReceiveRecordPageList',{method:'post'}],
    //根据ID查询帮助有用/无用数量
    findQuestionEffectById:['/help/helpQuestion/findQuestionEffectById',{ method: 'get' }],
    //
    payPromotion:['/promotion/promotionPromoter/pay',{method:'get'}],
    //查询银行卡
    getUserBankInfo:['/user/userBankInfo/findUserBankInfoByUserIdV2',{method:'get'}],
    //删除银行卡
    deleteUserBank:['/user/userBankInfo/deleteUserBankInfoByUserId',{method:'get'}],
    //添加银行卡
    addUserBankV2:['/user/userBankInfo/addUserBankInfoV2',{method:'post'}],
    //申请提现
    userWithdrawApply:['/user/withdraw/withdrawApply',{method:'post'}],
    //查询银行卡信息
    findByBankCardV2:['/user/userBankInfo/findByBankCardV2',{method:'get'}],
    //费率查询
    queryRate:['/user/withdraw/queryRate',{method:'get'}],
    //最后一次提现银行卡信息
    getLastBankInfo:['/user/withdraw/lastBankInfo',{method:'get'}],
    //查询导师
    findLeader:['/user/findLeader',{method:'get'}],
    //是否第一次提现
    isFirstTimeWithdraw:['/user/withdraw/firstTimeWithdraw',{method:'get'}],
    //获取秀迷列表
    getShowFansList:['/user/list',{method:'post'}],
    //获取秀迷数量及激活数量
    getShowFansCount:['/user/count',{method:'post'}],
    //我的数据Exp明细
    expDetail:['/user/detail',{method:'post'}],
    //查询顾问
    findTutor:['/user/findTutor',{method:'get'}],
    //绑定顾问
    bindTutor:['/user/bindTutor',{method:'get'}],
    getDays:['/user/getDays',{method:'get'}],
    //电签合同入口
    gongmallEnter:['/gongmall/contract',{method:'get'}],
    //电签结果查询接口
    gongmallResult:['/gongmall/query',{method:'get'}],
    //查询秀迷等级列表
    getFansLevelList:['/user/fansLevelList',{method:'get'}],
    //获取我的页面广告
    queryAdList:['/advertising/queryAdvertisingList',{method:'post'}],
    // 获取问题类型列表
    queryHelpCenterList:['/helpCenter/queryHelpCenterList',{method:'post'}],
    // 获取二级问题列表 type: 1 常见 2 普通
    queryHelpCenterDetailList:['/helpCenter/queryHelpCenterDetailList',{method:'post'}],
    // 问题是否有用 type: 0 没用 1 有用
    addHelpCenterResponse:['/helpCenter/addResponse',{method:'post'}],
    //提现记录
    queryWithdrawRecord:['/user/withdraw/query',{method:'post'}],
    //获取我的拼团列表数据
    getGroupList:['/promotion/group/us',{method:'get'}],
    //设置页面短信开关
    setMessageStatus:['/user/setContactInformationStatus',{method:'post'}],
    //获取用户下一个会员身份
    getNextBenefitPackageInfo:['/member/benefits/getNextBenefitPackageInfo',{method:'post'}],
};
import ApiUtils from '../../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
