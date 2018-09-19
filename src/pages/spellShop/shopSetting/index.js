import ShopPageSettingPage from './ShopPageSettingPage';
import SetShopNamePage from './SetShopNamePage';
import AnnouncementListPage from './AnnouncementListPage';
import AnnouncementDetailPage from './AnnouncementDetailPage';
import AnnouncementPublishPage from './AnnouncementPublishPage';
import InvitationSettingPage from './InvitationSettingPage';
import ShopScorePage from './ShopScorePage';

export default {
    moduleName: 'shopSetting',          //模块名称
    childRoutes: {                      //模块内部子路由
        MyShopPageSettingPage: ShopPageSettingPage,          //我的店铺设置页面
        SetShopNamePage,                //修改店铺名称+图片页面
        InvitationSettingPage,          //店铺邀请设置页面
        AnnouncementListPage,//公告列表
        AnnouncementDetailPage,//公告详情
        AnnouncementPublishPage,//发布公告
        ShopScorePage                  //店铺星级页面
    }
};
