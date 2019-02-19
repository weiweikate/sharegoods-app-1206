import MyOrdersDetailPage from "./MyOrdersDetailPage";
import MyOrdersListPage from "./MyOrdersListPage";
import OrderSearchResultPage from "./OrderSearchResultPage";
import ConfirOrderPage from "./ConfirmOrderPage";
import SearchPage from "./SearchPage";
import ConfirmReceiveGoodsPage from './ConfirmReceiveGoodsPage';

export default {
    moduleName: "order",    //模块名称
    childRoutes: {          //模块内部子路由
        MyOrdersDetailPage,
        MyOrdersListPage,
        OrderSearchResultPage,
        ConfirOrderPage,
        SearchPage,
        ConfirmReceiveGoodsPage
    }
};
