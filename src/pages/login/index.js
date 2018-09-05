import LoginPage  from './page'

// 访问路径 'Login/Demo1'
export default {
    moduleName: 'login',    //模块名称
    childRoutes: {          //模块内部子路由
        LoginPage,
    }
}


