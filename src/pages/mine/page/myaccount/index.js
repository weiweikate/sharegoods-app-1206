import EditPayPwdPage from './EditPayPwdPage';
import EditPhoneNumPage from './EditPhoneNumPage';
import EditPhonePwdPage from './EditPhonePwdPage';
import SetNewPhoneNumPage from './SetNewPhoneNumPage';

export default {
    moduleName: 'account',    //模块名称
    childRoutes: {          //模块内部子路由
        EditPayPwdPage,
        EditPhoneNumPage,
        EditPhonePwdPage,
        SetNewPhoneNumPage
    }
};
