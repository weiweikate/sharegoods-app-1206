import { observable, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import bridge from '../../../utils/bridge';
import { homeModule } from './Modules';

const kHomeTopBannerStore = '@home/kHomeTopBannerStore';

export class BannerModules {
    @observable bannerList = [];

    @action loadBannerList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeTopBannerStore);
                if (storeRes) {
                    this.bannerList = storeRes || [];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.swiper });
            this.bannerList = res.data || [];
            homeModule.changeHomeList(homeType.swiper);
            store.save(kHomeTopBannerStore, res.data);
        } catch (error) {
            console.log(error);
            bridge.$toast(error.msg);
        }
    });
}

export const bannerModule = new BannerModules();
