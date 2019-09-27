import { observable, action } from 'mobx';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import SpellShopApi from '../api/SpellShopApi';
import intervalMsgModel, { IntervalType } from '../../../comm/components/IntervalMsgView';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import store from '@mr/rn-store/src/index';
import DateUtils from '../../../utils/DateUtils';

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
    @observable hasWaitToNormalUser = false;
    wayToPinType = '';

    @action closeWaiting = () => {
        store.save('@mr/hasWaitToNormalUser', new Date());
        this.hasWaitToNormalUser = false;
    };

    /*网络*/
    requestAppStore = () => {
        SpellShopApi.app_store({ pathValue: `/${this.storeCode}` }).then((data) => {
            this.loadingState = PageLoadingState.success;
            this.isRefresh = false;
            this.storeData = data.data || {};
            this.requestHomePageList();
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
                    if (!DateUtils.isToday(date)) {
                        this.hasWaitToNormalUser = true;
                    }
                });
            }
        });
    };
}
