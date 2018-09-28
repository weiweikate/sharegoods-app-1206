import MyOrdersDetailPage from './MyOrdersDetailPage';
import MyOrdersListPage from './MyOrdersListPage';
import OrderSearchResultPage from './OrderSearchResultPage';
import ConfirOrderPage from './ConfirOrderPage';
import SearchPage from './SearchPage';
import MyOrderTestPage from './MyOrderTestPage';

export default {
    moduleName: 'order',    //模块名称
    childRoutes: {          //模块内部子路由
        MyOrdersDetailPage,
        MyOrdersListPage,
        OrderSearchResultPage,
        ConfirOrderPage,
        SearchPage,
        MyOrderTestPage
    }
};
