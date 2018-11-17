import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeRecommendStore = '@home/kHomeRecommendStore'

//精品推荐
class RecommendModule {
  @observable recommendList = [];

  @action loadRecommendList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield AsyncStorage.getItem(kHomeRecommendStore)
          if (storeRes) {
            this.recommendList = JSON.parse(storeRes)
          }
        }
        
          const res = yield HomeApi.getRecommends({ type: homeType.recommend });
          this.recommendList = res.data;
          AsyncStorage.setItem(kHomeRecommendStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const recommendModule = new RecommendModule();