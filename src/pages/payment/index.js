import PaymentPage from './PaymentPage'
import ChannelPage from './PayChannelPage'
import PaymentResultPage from './PaymentResultPage'

export default {
    moduleName: 'payment',    //模块名称
    childRoutes: {
        PaymentPage,
        ChannelPage,
        PaymentResultPage
    }
};
