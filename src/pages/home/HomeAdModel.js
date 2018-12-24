
import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { get, save } from '@mr/rn-store'
const kHomeAdStore = '@home/kHomeAdStore'

class AdModules {
  @observable ad = [];
  @action loadAdList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield get(kHomeAdStore)
          if (storeRes) {
            this.ad = storeRes
          }
        }
          const res = yield HomeApi.getAd({ type: homeType.ad });
          this.ad = res.data;

          save(kHomeAdStore, res.data)
      } catch (error) {
          console.log(error);
      }
  });
}

export const adModules = new AdModules()
