
import { observable, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeAdStore = '@home/kHomeAdStore'

class AdModules {
  @observable ad = [];
  loadAdList = flow(function* () {
      try {
        const storeRes = yield AsyncStorage.getItem(kHomeAdStore)
        if (storeRes) {
          this.ad = JSON.parse(storeRes)
        }

          const res = yield HomeApi.getAd({ type: homeType.ad });
          this.ad = res.data;

          AsyncStorage.setItem(kHomeAdStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const adModules = new AdModules()
