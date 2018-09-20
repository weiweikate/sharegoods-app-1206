import BankCardListPage from './BankCardListPage';
import AddBankCardPage  from './AddBankCardPage';

export default {
    moduleName: 'bankCard',    //模块名称
    childRoutes: {          //模块内部子路由
        BankCardListPage,
        AddBankCardPage
    }
};
