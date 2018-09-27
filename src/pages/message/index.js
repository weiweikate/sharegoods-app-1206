/**
 * Created by nuomi on 2018/7/19.
 * 消息模块
 */

import MessageCenterPage from './MessageCenterPage';
import ShopMessagePage from './ShopMessagePage';
import PayMessagePage from './PayMessagePage'
import NotificationPage from './NotificationPage';
import MessageGatherPage from './MessageGatherPage';
import QuestionnairePage from './QuestionnairePage';
export default {
    moduleName: 'message',    //模块名称
    childRoutes: {          //模块内部子路由
        MessageCenterPage,
        ShopMessagePage,
        NotificationPage,
        PayMessagePage,
        MessageGatherPage,
        QuestionnairePage
    }
};