import AfterSaleServiceHomePage from './AfterSaleServiceHomePage';
import AfterSaleServicePage from './AfterSaleServicePage';
import ApplyRefundNextPage from './ApplyRefundNextPage';
import ExchangeGoodsDetailPage from './ExchangeGoodsDetailPage';

export default {
    moduleName: 'afterSaleService',    //模块名称
    childRoutes: {          //模块内部子路由
        AfterSaleServiceHomePage,
        AfterSaleServicePage,
        ApplyRefundNextPage,
        ExchangeGoodsDetailPage,
    }
};