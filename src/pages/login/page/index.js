import OtherLoginPage from './LoginPage';
import LoginPage from './Login'
import InputPhoneNum from './InputPhoneNum'
import InputCode from './InputCode'

import OldUserLoginPage from './OldUserLoginPage';
import SetPasswordPage from './SetPasswordPage';
import RegistPage from './RegistPage';
import ForgetPasswordPage from './ForgetPasswordPage';
import GetRedpacketPage from './GetRedpacketPage';
import InviteCodePage from './InviteCodePage';
import SelectMentorPage from './SelectMentorPage'
import MentorDetailPage from './MentorDetailPage'
import LocalNumLogin from  './LocalNumLogin'

// 访问路径 'Login/Demo1'
export default {
    moduleName: 'login',    //模块名称
    childRoutes: { //模块内部子路由
        InputCode,
        InputPhoneNum,
        LocalNumLogin,
        OtherLoginPage,

        LoginPage,
        OldUserLoginPage,
        SetPasswordPage,
        RegistPage,
        ForgetPasswordPage,
        GetRedpacketPage,
        InviteCodePage,
        SelectMentorPage,
        MentorDetailPage
    }
};


