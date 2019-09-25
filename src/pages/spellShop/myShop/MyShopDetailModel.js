import { observable } from 'mobx';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import SpellShopApi from '../api/SpellShopApi';
import intervalMsgModel, { IntervalType } from '../../../comm/components/IntervalMsgView';

export default class MyShopDetailModel {
    @observable productList = [];
    @observable bottomBannerList = [];

    @observable switchStatus = false;
    @observable storeBonusTips = '';

    /*网络*/
    requestShopProducts() {
        HomeAPI.getHomeData({ type: homeType.shopProducts }).then((data) => {
            this.productList = data.data || [];
        });
    }

    requestShopBanner() {
        HomeAPI.getHomeData({ type: homeType.shopBanner }).then((data) => {
            this.bottomBannerList = data.data || [];
        });
    }

    questShopMsg(shopCode) {
        SpellShopApi.floatMsg({ type: 5, param: shopCode }).then((data) => {
            const dataList = data.data || [];
            if (dataList.length === 0) {
                return;
            }
            const content = { pageType: IntervalType.shopDetail, params: { floatMsgs: dataList } };
            intervalMsgModel.setMsgData(content, shopCode);
        });
    }

    requestBonusTips = () => {
        SpellShopApi.store_bonusTips().then((data) => {
            const { switchStatus, storeBonusTips } = data.data || {};
            this.storeBonusTips = storeBonusTips;
            this.switchStatus = switchStatus;
        });
    };

}
