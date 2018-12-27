import SettingPage from './SettingPage';
import AccountSettingPage from './AccountSettingPage';

export default {
    moduleName: 'setting',    //模块名称
    childRoutes: {          //模块内部子路由
        SettingPage,
        AccountSettingPage
    }
};
