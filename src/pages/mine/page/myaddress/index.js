import AddressEditAndAddPage from './AddressEditAndAddPage';
import AddressManagerPage from './AddressManagerPage';

export default {
    moduleName: 'address',    //模块名称
    childRoutes: {          //模块内部子路由
        AddressEditAndAddPage,
        AddressManagerPage
    }
};
