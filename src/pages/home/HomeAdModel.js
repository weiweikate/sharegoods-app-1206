
import { observable, flow, action, computed } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { get, save } from '@mr/rn-store'
import ScreenUtils from '../../utils/ScreenUtils';
const kHomeAdStore = '@home/kHomeAdStore'
const { px2dp } = ScreenUtils;
const kAdWidth = (ScreenUtils.width - px2dp(35)) / 2
const kAdHeight = kAdWidth * (160 / 340)

class AdModules {
  @observable ad = [];
  @observable banner = [];
  @observable adHeights = [];
  @computed get adHeight() {
    let h = kAdHeight * 2 + px2dp(14)
    this.adHeights.map(val => {
      console.log('getBanner mobx', val)
      h += val + px2dp(15)
    })
    return h
  }
  @action loadAdList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield get(kHomeAdStore)
          if (storeRes) {
            this.ad = storeRes
          }
        }
        
        
        const res = yield HomeApi.getAd({ type: homeType.ad });
        console.log('loadAdList', res)
        this.ad = res.data;
        save(kHomeAdStore, res.data)
        const bannerRes = yield HomeApi.getBanner({type: homeType.banner})
        this.banner = bannerRes.data

        
      } catch (error) {
          console.log(error);
      }
  });
}

export const adModules = new AdModules()
