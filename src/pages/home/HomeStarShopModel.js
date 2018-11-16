import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeStarShopStore = '@home/kHomeStarShopStore'

class StarShopModule {
  @observable shopList = [];

  @action loadShopList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield AsyncStorage.getItem(kHomeStarShopStore)
          if (storeRes) {
            this.shopList = JSON.parse(storeRes)
          }
        }
          const res = yield HomeApi.getStarShop({ type: homeType.starShop });
          this.shopList = res.data;
          AsyncStorage.setItem(kHomeStarShopStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const starShopModule = new StarShopModule();
