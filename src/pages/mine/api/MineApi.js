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
    getUser: ['/user/getUser', { method: 'get' }],
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
    //修改用户个人信息 type:1:修改头像 2:修改名字 3:修改省市区
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
    signOut: ['/user/userLogin/signOut', { method: 'get' }],
    //添加实名认证
    addUserCertification: '/user/UserCertification/addUserCertification',
    // 修改手机号
    updatePhone: ['/user/updatePhone', { method: 'post' }],
    // 修改密码
    changePhonePwd: ['/user/updateLoginPassword', { method: 'post' }],
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
    initSalesPassword: ['/user/initSalesPassword', { method: 'post' }]


};
import ApiUtils from '../../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
