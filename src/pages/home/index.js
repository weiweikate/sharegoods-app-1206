
import HomePage from "./HomePage";
import SearchGoodPage from './search/SearchGoodPage'

export default {
    moduleName: 'home',    //模块名称
    childRoutes: {          //模块内部子路由
        HomePage,
        SearchGoodPage
    }
}
