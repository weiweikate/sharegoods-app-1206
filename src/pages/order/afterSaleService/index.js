import AfterSaleServiceHomePage from './AfterSaleServiceHomePage';
import AfterSaleServicePage from './AfterSaleServicePage';
import ExchangeGoodsDetailPage from './ExchangeGoodsDetailPage';
import FillReturnLogisticsPage from './FillReturnLogisticsPage';
import SelectLogisticsCompanyPage from './SelectLogisticsCompanyPage';
import AfterSaleListPage from './AfterSaleListPage'
import AfterLogisticsListView from './AfterLogisticsListView'

export default {
    moduleName: 'afterSaleService',    //模块名称
    childRoutes: {          //模块内部子路由
        AfterSaleServiceHomePage,
        AfterSaleServicePage,
        ExchangeGoodsDetailPage,
        FillReturnLogisticsPage,
        SelectLogisticsCompanyPage,
        AfterSaleListPage,
        AfterLogisticsListView
    }
};
