/**
 * Created by zhanglei on 2018/8/8.
 */
import MyOrdersDetailPage from './MyOrdersDetailPage';
import MyOrdersListPage from './MyOrdersListPage';
import OrderSearchResultPage from './OrderSearchResultPage';
import ConfirOrderPage from './ConfirOrderPage';

export default {
    moduleName: 'order',    //模块名称
    childRoutes: {          //模块内部子路由
        MyOrdersDetailPage,
        MyOrdersListPage,
        OrderSearchResultPage,
        ConfirOrderPage,
    }
};
