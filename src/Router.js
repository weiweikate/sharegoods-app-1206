/*
* 此文件为路由中心,配置所有页面路由
* 各个模块下如果有新加page,无需再此文件操作,
* 直接将新加的page配置到各自模块下的index中
*
* 路由跳转的名字为(push or navigate)  模块名+内部文件夹名+page的名字
* 如:如果想跳转home模块下的HomePage  则为 ...navigate(home/HomePage)
*
* */

// 基础模块
import { TabNav } from './RootPage';
// 业务模块
import demo from './pages/demo';
import debug from './pages/debug';
import home from './pages/home';
import mine from './pages/mine';
import shopCart from './pages/shopCart';
import spellShop from './pages/spellShop';
import login from './pages/login';
import order from './pages/order';
const Router = {
    Tab: {
        screen: TabNav,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
};

// 添加模块内子路由配置
function addSubModule(module, prefixPath) {

    if (!module || !module.moduleName || typeof module.moduleName !== 'string' || !module.childRoutes || typeof module.childRoutes !== 'object') {
        __DEV__ && console.error('module maybe wrong format, please checkout');
        return;
    }

    const p = prefixPath ? `${prefixPath}/${module.moduleName}` : module.moduleName;

    Object.keys(module.childRoutes).map((pageName) => {
        const item = module.childRoutes[pageName];
        if (item.moduleName) {
            addSubModule(item, p);
        } else if (typeof item === 'function') {
            const path = `${p}/${pageName}`;
            Router[path] = { screen: item };
        }
    });
}


addSubModule(demo);
addSubModule(debug);
addSubModule(login);
addSubModule(home);
addSubModule(mine);
addSubModule(shopCart);
addSubModule(spellShop);
addSubModule(login);
addSubModule(order);


console.log('Router', Object.keys(Router));
console.log(Router);

export default Router;
