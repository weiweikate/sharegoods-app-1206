/**
 * Created by nuomi on 2018/7/19.
 * 消息模块
 */

import MessageCenterPage from './MessageCenterPage';
import PayMessagePage from './PayMessagePage'
import NotificationPage from './NotificationPage';
import MessageGatherPage from './MessageGatherPage';
import ShopMessagePage from './ShopMessagePage';
export default {
    moduleName: 'message',    //模块名称
    childRoutes: {          //模块内部子路由
        MessageCenterPage,
        NotificationPage,
        PayMessagePage,
        MessageGatherPage,
        ShopMessagePage
    }
};
