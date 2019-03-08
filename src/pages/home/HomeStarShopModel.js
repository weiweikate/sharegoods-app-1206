import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { get, save } from '@mr/rn-store'
const kHomeStarShopStore = '@home/kHomeStarShopStore'

class StarShopModule {
  @observable shopList = [];

  @action loadShopList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield get(kHomeStarShopStore)
          if (storeRes) {
            this.shopList = storeRes
          }
        }
          const res = yield HomeApi.getStarShop({ type: homeType.starShop });
          this.shopList = res.data;
          save(kHomeStarShopStore, res.data)
      } catch (error) {
          console.log(error);
      }
  });
}

export const starShopModule = new StarShopModule();
