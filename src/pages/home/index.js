
import HomePage from "./HomePage";
import search from './search'

export default {
    moduleName: 'home',    //模块名称
    childRoutes: {          //模块内部子路由
        HomePage,
        search
    }
}
