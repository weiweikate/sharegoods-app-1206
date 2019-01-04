
import { observable, computed, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { get, save } from '@mr/rn-store'
const kHomeBannerStore = '@home/kHomeBannerStore'

export class BannerModules {
  @observable bannerList = [];

  @observable isShowHeader = false;

  @computed get bannerCount() {
      return this.bannerList.length;
  }

  @computed get opacity() {
      return this.bannerList && this.bannerList.length > 0 ? 0 : 1;
  }

  @action loadBannerList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield get(kHomeBannerStore)
          if (storeRes) {
            this.bannerList = storeRes
          }
        }
          const res = yield HomeApi.getSwipers({ type: homeType.swiper });
          this.bannerList = res.data;
          if (this.bannerList.length > 0) {
            this.isShowHeader = false
          } else {
            this.isShowHeader = true
          }
          save(kHomeBannerStore, res.data)
      } catch (error) {
          console.log(error);
      }
  });
}

export const bannerModule = new BannerModules();
