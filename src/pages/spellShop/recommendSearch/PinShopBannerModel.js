import { observable, action, flow } from 'mobx';
import HomeApi from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import bridge from '../../../utils/bridge';

export class BannerModules {
    @observable bannerList = [];

    @action loadBannerList = flow(function* () {
        try {
            const res = yield HomeApi.getHomeData({ type: homeType.pinShop });
            this.bannerList = res.data || [];
        } catch (error) {
            console.log(error);
            bridge.$toast(error.msg);
        }
    });
}

export const bannerModule = new BannerModules();
