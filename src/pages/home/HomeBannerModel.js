
import { observable, computed, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeBannerStore = '@home/kHomeBannerStore'

export class BannerModules {
  @observable bannerList = [];

  @computed get bannerCount() {
      return this.bannerList.length;
  }

  @observable opacity = 1;

  @action
  loadBannerList = flow(function* () {
      try {
        const storeRes = yield AsyncStorage.getItem(kHomeBannerStore)
        if (storeRes) {
          this.bannerList = JSON.parse(storeRes);
        }

          const res = yield HomeApi.getSwipers({ type: homeType.swiper });
          this.opacity = res.data && res.data.length > 0 ? 0 : 1;
          this.bannerList = res.data;
          AsyncStorage.setItem(kHomeBannerStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const bannerModule = new BannerModules();