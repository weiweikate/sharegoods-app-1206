import { action, flow, observable } from 'mobx';
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
                    this.assembleList(storeRes || []);
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.swiper });
            this.assembleList(res.data || []);
            store.save(kHomeTopBannerStore, res.data);
        } catch (error) {
            bridge.$toast(error.msg);
        }
    });

    assembleList(data) {
        this.bannerList = data;
        homeModule.changeHomeList(homeType.swiper, [{
            id: 0,
            type: homeType.swiper
        }]);
    }
}

export const bannerModule = new BannerModules();
