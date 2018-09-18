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
    getUser: ['/user/getUser',{method:'get'}],
    //根据ID查询问题详情
    findHelpQuestionById:['/help/helpQuestion/findHelpQuestionById',{method:'get'}],
    //查询问题的列表
    queryHelpQuestionList:['/help/helpQuestion/queryHelpQuestionList',{method:'get'}],
    //用户反馈帮助问题是否有用
    updateHelpQuestionToClick:'/help/helpQuestion/updateHelpQuestionToClick',
    //文件上传（OSS）
    oss:'/common/upload/oss',
    //根据字典类型获取字典数据 WTFK
    queryDictionaryTypeList:['/config/sysDictionary/queryDictionaryTypeList',{method:'get'}],
    //添加反馈:
    addFeedback:'/user/feedback/addFeedback',
    //收藏店铺列表
    queryCollection:['/user/storeCollection/queryCollection',{method:'get'}],
    //取消收藏店铺 -- 店员行为
    cancelCollection:'/user/storeCollection/cancel',
    //修改用户个人信息 type:1:修改头像 2:修改名字 3:修改省市区
    updateUserById:'/user/updateUserById',
    // 删除地址
    delAddress: '/user/userAddress/delete',
    // 查询地址
    queryAddrList: '/user/userAddress/query',
    // 新增/修改地址
    addOrEditAddr: '/user/userAddress/save',
    // 设置默认地址
    setDefaultAddr: '/user/userAddress/setDefault',
    // 获取省市区列表
    getAreaList: '/config/sysArea/queryAreaList'

};
import ApiUtils from '../../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
