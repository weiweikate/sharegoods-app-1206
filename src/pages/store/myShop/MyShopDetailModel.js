import { observable } from 'mobx';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import SpellShopApi from '../api/SpellShopApi';
import intervalMsgModel, { IntervalType } from '../../../comm/components/IntervalMsgView';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';

export default class MyShopDetailModel {

    @observable tittle = '店铺';
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};
    @observable isRefresh = false;
    @observable storeCode;

    @observable productList = [];
    @observable bottomBannerList = [];
    @observable storeData = {};
    @observable storeUsers = [];
    wayToPinType = '';

    /*网络*/
    requestAppStore = () => {
        SpellShopApi.app_store({ pathValue: `/${this.storeCode}` }).then((data) => {
            this.loadingState = PageLoadingState.success;
            this.storeData = data.data || {};
            this.requestHomePageList();
            track(trackEvent.PinShopEnter, {
                pinCode: this.storeData.storeCode,
                wayToPinType: this.wayToPinType
            });
        }).catch(e => {
            this.netFailedInfo = e;
            this.loadingState = PageLoadingState.fail;
        });
    };

    requestHomePageList = () => {
        const { storeCode } = this.storeData;
        SpellShopApi.app_store_homePageList({ storeCode }).then((data) => {
            this.storeUsers = data.data || [];
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
}
