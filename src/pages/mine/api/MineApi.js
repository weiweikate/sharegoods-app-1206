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

};
import ApiUtils from '../../../api/network/ApiUtils';

const MineAPI = ApiUtils(api);

export default MineAPI;
