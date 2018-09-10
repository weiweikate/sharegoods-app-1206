
import HomePage from "./page/HomePage";
import SearchGoodPage from './page/SearchGoodPage'

export default {
    moduleName: 'home',    //模块名称
    childRoutes: {          //模块内部子路由
        HomePage,
        SearchGoodPage
    }
}
