// 所有页面新增修饰器
import PageDecorator from './components/pageDecorator/PageDecorator';
// 基础模块
import {TabNav} from './RootPage';
// 业务模块
import demo from './pages/demo/index';
import debug from './pages/debug/index';
import login from './pages/login/page'

const Router = {
    Tab: {
        screen: TabNav,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
};

// 添加模块内子路由配置
function addSubModule(module) {
    if (!module.moduleName || typeof module.moduleName !== 'string' || !module.childRoutes) {
        __DEV__ && console.error('module maybe wrong format, please checkout');
        return;
    }

    const moduleName = module.moduleName;

    Object.keys(module.childRoutes).map((pageName) => {
        const item = module.childRoutes[pageName];
        // 路由跳转 this.props.navigation.navigate('debug/DebugPanelPage');
        const path = `${moduleName}/${pageName}`;
        Router[path] = {screen: PageDecorator(item)};
    });
}

addSubModule(demo);
addSubModule(debug);
addSubModule(login)

export default Router;
