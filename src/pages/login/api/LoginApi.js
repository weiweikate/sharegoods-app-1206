const api = {
    // 检查手机号是否已经注册过
    findMemberByPhone: ['/user/userSign/findMemberByPhone', { isRSA: true }],
    // 注册时随机显示的四个邀请人
    queryInviterList: '/user/userSign/queryInviterList',
    //重置密码
    resetPassword: ['/user/userSign/resetPassword', { isRSA: true }],
    //用户注册
    signUser: ['/user/userSign/signUser', { isRSA: true }],
    //验证码登陆
    codeLogin: ['/user/userLogin/codeLogin', { isRSA: true }],
    //密码登陆
    passwordLogin: ['/user/userLogin/passwordLogin', { isRSA: true }],
    //app微信登陆
    appWechatLogin: '/user/userLogin/appWechatLogin',
    //老用户激活注册
    existedUserLogin: '/user/userLogin/existedUserLogin',
    //老用户验证
    existedUserVerify: '/user/userLogin/existedUserVerify',
    //注册领红包
    userReceivePackage: ['/promotion/promotionPromoter/userReceivePackage', { method: 'get' }],
    //填写授权码
    updateUserCodeById: '/user/updateUserCodeById',
    //获取导师列表
    queryInviterList: '/user/userSign/queryInviterList',
    //导师绑定
    mentorBind:  ['/user/userSign/mentorBind',{method:'get'}],
    //选择导师跳过调用接口
    givePackage:['/user/userSign/givePackage',{method:'get'}],
    //老用户激活日期校验
    oldUserActivateJudge:['/user/userSign/oldUserActivateJudge',{method:'get'}],
    //是否有秀迷
    queryShowFansStatus:['/user/queryShowFansStatus',{method:'post'}],
    //一键登录后去绑定微信操作
    phoneBindWx:['/user/userLogin/bindWeChat'],
    //一键登录校验token借口
    oneClickLoginValidation:['/user/userLogin/autoLogin'],
};
import ApiUtils from '../../../api/network/ApiUtils';

const LoginAPI = ApiUtils(api);

export default LoginAPI;
