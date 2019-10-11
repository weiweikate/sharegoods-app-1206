import { observable, action } from 'mobx';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import SpellShopApi from '../api/SpellShopApi';
import intervalMsgModel, { IntervalType } from '../../../comm/components/IntervalMsgView';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import store from '@mr/rn-store/src/index';
import DateUtils from '../../../utils/DateUtils';
import { routePush } from '../../../navigation/RouterMap';
import { Alert } from 'react-native';
import apiEnvironment from '../../../api/ApiEnvironment';
import RouterMap from '../../../navigation/RouterMap';

export default class MyShopDetailModel {

    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};
    @observable isRefresh = false;
    @observable storeCode;

    @observable canOpenShop = false;
    @observable productList = [];
    @observable bottomBannerList = [];
    @observable storeData = {};
    @observable storeUsers = [];
    @observable storeUserCount = 0;

    @observable storeManagers = [];

    @observable waitToNormalUsers = 0;
    wayToPinType = '';

    @action closeWaiting = () => {
        store.save('@mr/hasWaitToNormalUser', new Date());
        this.waitToNormalUsers = 0;
    };

    /*网络*/
    requestAppStore = () => {
        SpellShopApi.app_store({ pathValue: `/${this.storeCode}` }).then((data) => {
            this.loadingState = PageLoadingState.success;
            this.isRefresh = false;
            this.storeData = data.data || {};
            this.requestHomePageList();
            this.manageHomePageList();
            track(trackEvent.PinShopEnter, {
                pinCode: this.storeData.storeCode,
                wayToPinType: this.wayToPinType
            });
        }).catch(e => {
            this.netFailedInfo = e;
            this.loadingState = PageLoadingState.fail;
            this.isRefresh = false;
        });
    };

    checkOpenStore = () => {
        SpellShopApi.checkQualificationOpenStore().then((data) => {
            this.canOpenShop = data.data;
        });
    };

    requestHomePageList = () => {
        const { storeCode } = this.storeData;
        SpellShopApi.app_store_homePageList({ storeCode }).then((data) => {
            const { storeUserCount, storeUserList } = data.data || {};
            this.storeUsers = storeUserList || [];
            this.storeUserCount = storeUserCount;
        });
    };

    manageHomePageList = () => {
        const { storeCode } = this.storeData;
        SpellShopApi.manageHomePageList({ storeCode }).then((data) => {
            this.storeManagers = data.data || [];

            let hasTutor = false;
            this.storeManagers.forEach((item) => {
                if (item.tutorStatus === 1) {
                    hasTutor = true;
                }
            });
            const { roleType } = this.storeData;
            if (roleType === 0 && !hasTutor) {
                store.get('@mr/alertToTutor').then((date) => {
                    //一天弹一次
                    if (!DateUtils.isToday(date)) {
                        Alert.alert('温馨提醒', '专业导师能帮助您更好地管理店铺，轻松赚钱！快去邀请ta和您一起管理店铺吧~',
                            [
                                {
                                    text: '马上邀请', onPress: () => {
                                        store.save('@mr/alertToTutor', new Date());
                                        const uri = apiEnvironment.getCurrentH5Url() + '/spellStore/tutor/list';
                                        routePush(RouterMap.HtmlPage, {
                                            uri: uri
                                        });
                                    }
                                }
                            ]
                        );
                    }
                });
            }
        });
    };

    requestShopProducts = () => {
        HomeAPI.getHomeData({ type: homeType.shopProducts }).then((data) => {
            this.productList = data.data || [];
        });
    };

    requestShopBanner = () => {
        HomeAPI.getHomeData({ type: homeType.shopBanner }).then((data) => {
            this.bottomBannerList = data.data || [];
        });
    };

    questShopMsg = (shopCode) => {
        SpellShopApi.floatMsg({ type: 5, param: shopCode }).then((data) => {
            const dataList = data.data || [];
            if (dataList.length === 0) {
                return;
            }
            const content = { pageType: IntervalType.shopDetail, params: { floatMsgs: dataList } };
            intervalMsgModel.setMsgData(content, shopCode);
        });
    };

    requestWaitToNormalUser = () => {
        SpellShopApi.waitToNormalUser().then((data) => {
            if (data.data > 0) {
                store.get('@mr/hasWaitToNormalUser').then((date) => {
                    //一天弹一次
                    if (!DateUtils.isToday(date)) {
                        this.waitToNormalUsers = data.data;
                    }
                });
            }
        });
    };
}
