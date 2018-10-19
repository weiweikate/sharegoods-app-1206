import SignInPage from './SignInPage';
import SignRulePage from './SignRulePage';


export default {
    moduleName: 'signIn',    //模块名称
    childRoutes: {          //模块内部子路由
        SignInPage,
        SignRulePage
    }
};
