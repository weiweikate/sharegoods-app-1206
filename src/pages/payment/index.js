import PaymentMethodPage from './PaymentMethodPage';
import PaymentPage from './PaymentPage'
import ChannelPage from './ChannelPage'

export default {
    moduleName: 'payment',    //模块名称
    childRoutes: {
        PaymentMethodPage, //模块内部子路由
        PaymentPage,
        ChannelPage
    }
};
