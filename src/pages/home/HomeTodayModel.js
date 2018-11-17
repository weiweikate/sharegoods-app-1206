import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeTodayStore = '@home/kHomeTodayStore'

//今日榜单
class TodayModule {
  @observable todayList = [];
  @action loadTodayList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield AsyncStorage.getItem(kHomeTodayStore)
          if (storeRes) {
            this.todayList = JSON.parse(storeRes)
          }
        }
          const res = yield HomeApi.getTodays({ type: homeType.today });
          this.todayList = res.data;
          AsyncStorage.setItem(kHomeTodayStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const todayModule = new TodayModule();
