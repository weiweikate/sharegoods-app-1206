import { observable, computed, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { get, save } from '@mr/rn-store';
import bridge from '../../../utils/bridge';

const kHomeTopBannerStore = '@home/kHomeTopBannerStore';

export class BannerModules {
    @observable bannerList = [];

    @computed get bannerCount() {
        return this.bannerList.length;
    }

    @action loadBannerList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeTopBannerStore);
                if (storeRes) {
                    this.bannerList = storeRes||[];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.swiper });
            this.bannerList = res.data||[];
            save(kHomeTopBannerStore, res.data);
        } catch (error) {
            console.log(error);
            bridge.$toast(error.msg);
        }
    });
}

export const bannerModule = new BannerModules();
