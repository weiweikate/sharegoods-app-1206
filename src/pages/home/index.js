
import HomePage from './HomePage';
import search from './search'
import signIn from './signIn'
import './Mediator'

export default {
    moduleName: 'home',    //模块名称
    childRoutes: {          //模块内部子路由
        HomePage,
        search,
        signIn,
    }
}
