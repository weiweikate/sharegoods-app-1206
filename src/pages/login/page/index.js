// import LoginPage from './LoginPage';
import LoginPage from './Login'
import OldUserLoginPage from './OldUserLoginPage';
import SetPasswordPage from './SetPasswordPage';
import RegistPage from './RegistPage';
import ForgetPasswordPage from './ForgetPasswordPage';
import GetRedpacketPage from './GetRedpacketPage';
import TestNav from './testNav';
import InviteCodePage from './InviteCodePage';
import SelectMentorPage from './SelectMentorPage'
import MentorDetailPage from './MentorDetailPage'

// 访问路径 'Login/Demo1'
export default {
    moduleName: 'login',    //模块名称
    childRoutes: {          //模块内部子路由
        LoginPage,
        OldUserLoginPage,
        SetPasswordPage,
        RegistPage,
        ForgetPasswordPage,
        GetRedpacketPage,
        TestNav,
        InviteCodePage,
        SelectMentorPage,
        MentorDetailPage
    }
};


