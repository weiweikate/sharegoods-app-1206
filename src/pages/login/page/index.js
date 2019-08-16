import LoginPage from './LoginPage';

import ForgetPasswordPage from './ForgetPasswordPage';
import InviteCodePage from './InviteCodePage';
import SelectMentorPage from './SelectMentorPage';
import MentorDetailPage from './MentorDetailPage';
import PwdLoginPage from './PwdLoginPage';
import PhoneLoginPage from './PhoneLoginPage';
import LoginVerifyCodePage from './LoginVerifyCodePage';

// 访问路径 'Login/Demo1'
export default {
    moduleName: 'login',    //模块名称
    childRoutes: { //模块内部子路由
        LoginPage,
        ForgetPasswordPage,
        InviteCodePage,
        SelectMentorPage,
        MentorDetailPage,
        PhoneLoginPage,
        PwdLoginPage,
        LoginVerifyCodePage
    }
};


