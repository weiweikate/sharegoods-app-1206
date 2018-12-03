import BankCardListPage from './BankCardListPage';
import AddBankCardPage  from './AddBankCardPage';
import WithdrawalAgreementPage from './WithdrawalAgreementPage'

export default {
    moduleName: 'bankCard',    //模块名称
    childRoutes: {          //模块内部子路由
        BankCardListPage,
        AddBankCardPage,
        WithdrawalAgreementPage
    }
};
