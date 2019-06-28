import AddressSelectPage from './AddressSelectPage';
import ProductAddressListPage from './ProductAddressListPage';
export default {
    moduleName: 'productAddress',    //模块名称
    childRoutes: {          //模块内部子路由
        AddressSelectPage,
        ProductAddressListPage,
    }
};
