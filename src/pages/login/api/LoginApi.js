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
    //app微信登陆
    appWechatLogin: '/user/userLogin/appWechatLogin',
    //老用户激活注册
    existedUserLogin: '/user/userLogin/existedUserLogin',
    //老用户验证
    existedUserVerify:'/user/userLogin/existedUserVerify'

};
import ApiUtils from '../../../api/network/ApiUtils';

const LoginAPI = ApiUtils(api);

export default LoginAPI;
