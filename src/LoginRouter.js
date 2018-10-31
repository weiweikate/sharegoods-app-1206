/*
* 此文件为路由中心,配置所有页面路由
* 各个模块下如果有新加page,无需再此文件操作,
* 直接将新加的page配置到各自模块下的index中
*
* 路由跳转的名字为(push or navigate)  模块名+内部文件夹名+page的名字
* 如:如果想跳转home模块下的HomePage  则为 ...navigate(home/HomePage)
*import TabNav from './pages/shareTask/page/ShareTaskIntroducePage'
* */
import { StackNavigator } from 'react-navigation';

import LoginPage from './pages/login/page/LoginPage';
import RegistPage from './pages/login/page/RegistPage'


const LoginRouter = {
    loginPage: {
        screen: LoginPage
    },
    registPage:{
        screen:RegistPage
    }
}
const LoginNav = StackNavigator(
    LoginRouter
    ,
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        },
    }
    );

export default LoginNav;
