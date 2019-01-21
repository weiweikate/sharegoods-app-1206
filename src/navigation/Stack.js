/*
* 此文件为路由中心,配置所有页面路由
* 各个模块下如果有新加page,无需再此文件操作,
* 直接将新加的page配置到各自模块下的index中
*
* 路由跳转的名字为(push or navigate)  模块名+内部文件夹名+page的名字
* 如:如果想跳转home模块下的HomePage  则为 ...navigate(home/HomePage)
*import TabNav from './pages/shareTask/page/ShareTaskIntroducePage'
* */
// 基础模块
import { TabNav } from './Tab';
//  import  TabNav  from './pages/payment/PaymentMethodPage';
//  import  TabNav  from './pages/home/product/ProductDetailPage';
//   import  TabNav  from '../pages/order/afterSaleService/AfterSaleServicePage';
//   import  TabNav  from './Dome';
// 业务模块
import debug from '../pages/debug';
import home from '../pages/home';
import mine from '../pages/mine';
import shopCart from '../pages/shopCart';
import spellShop from '../pages/spellShop';
import login from '../pages/login';
import order from '../pages/order';
import payment from '../pages/payment';
import htmlView from '../components/web/HtmlView';
import message from '../pages/message';
import topic from '../pages/topic';
import show from '../pages/show/Index';
import shareTask from '../pages/shareTask';


const Router = {
    Tab: {
        screen: TabNav,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    HtmlPage: {
        screen: htmlView
    }
};
const PageKey = {};

function getPathWithPageName(pageName) {
    if (pageName === 'RegistPage') {
        return 'path/' + pageName + '/:phone'
    }else {
        return 'path/' + pageName;
    }
}


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
            let  pathValue = getPathWithPageName(pageName)
            Router[path] = {
                screen: item,
                path:pathValue
            };

            PageKey[pageName] = path;
        }
    });
}


addSubModule(debug);
addSubModule(login);
addSubModule(home);
addSubModule(mine);
addSubModule(shopCart);
addSubModule(spellShop);
addSubModule(login);
addSubModule(order);
addSubModule(message);
addSubModule(topic);
addSubModule(payment);
addSubModule(show);
addSubModule(shareTask);
console.log('Router', Object.keys(Router));
console.log(Router);
console.log('Path',Object.values(Router))
Object.values(Router).map(value=>{
    console.log(  value.path)
})

console.log('PageKey',Object.keys(PageKey))
export { PageKey };
export default Router;
