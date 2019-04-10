import PaymentPage from './PaymentPage'
import ChannelPage from './PayChannelPage'
import PaymentResultPage from './PaymentResultPage'
import PaymentCheckPage from './PaymentCheckPage'

export default {
    moduleName: 'payment',    //模块名称
    childRoutes: {
        PaymentPage,
        ChannelPage,
        PaymentResultPage,
        PaymentCheckPage
    }
};
