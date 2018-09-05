/*
* 此文件为路由中心,配置所有页面路由
* 各个模块下如果有新加page,无需再此文件操作,
* 直接将新加的page配置到各自模块下的index中
*
* 路由跳转的名字为(push or navigate)  模块名+内部文件夹名+page的名字
* 如:如果想跳转home模块下的HomePage  则为 ...navigate(home/HomePage)
*
* */

// 所有页面新增修饰器
import PageDecorator from "./components/pageDecorator/PageDecorator";
// 基础模块
import { TabNav } from "./RootPage";
// 业务模块
import demo from "./pages/demo/index";
import debug from "./pages/debug/index";


import home from "./pages/home/page/index";
import mine from "./pages/mine/page/index";
import shopCart from "./pages/shopCart/page/index";
import spellShop from "./pages/spellShop/page/index";
import login from "./pages/login/page/index";

const Router = {
    Tab: {
        screen: TabNav,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
};

// 添加模块内子路由配置
function addSubModule(module) {
    if (!module.moduleName || typeof module.moduleName !== "string" || !module.childRoutes) {
        __DEV__ && console.error("module maybe wrong format, please checkout");
        return;
    }

    const moduleName = module.moduleName;

    Object.keys(module.childRoutes).map((pageName) => {
        const item = module.childRoutes[pageName];
        // 路由跳转 this.props.navigation.navigate('debug/DebugPanelPage');
        const path = `${moduleName}/${pageName}`;
        Router[path] = { screen: PageDecorator(item) };
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
console.log(Router);

export default Router;
