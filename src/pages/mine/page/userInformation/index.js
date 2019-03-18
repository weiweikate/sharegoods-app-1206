
import UserInformationPage from './UserInformationPage';
import NickNameModifyPage from './NickNameModifyPage';
import MyCashAccountPage from './MyCashAccountPage';
import MyIntegralAccountPage from './MyIntegralAccountPage';
import WithdrawCashPage from './WithdrawCashPage';
import IDVertify2Page from './IDVertify2Page';
import WaitingForWithdrawCashPage from './WaitingForWithdrawCashPage';
import ProfileEditPage from './ProfileEditPage';
import GongMallContractPage from './GongMallContractPage';



export default {
    moduleName: 'userInformation',    //模块名称
    childRoutes: {          //模块内部子路由
        UserInformationPage,
        NickNameModifyPage,
        MyCashAccountPage,
        MyIntegralAccountPage,
        WithdrawCashPage,
        IDVertify2Page,
        WaitingForWithdrawCashPage,
        ProfileEditPage,
        GongMallContractPage
    }
};
