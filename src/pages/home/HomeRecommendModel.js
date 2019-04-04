import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType } from './HomeTypes';
import { get, save } from '@mr/rn-store';

const kHomeRecommendStore = '@home/kHomeRecommendStore';

//精品推荐
class RecommendModule {
    @observable recommendList = [];

    @action loadRecommendList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeRecommendStore);
                if (storeRes) {
                    this.recommendList = storeRes;
                }
            }

            const res = yield HomeApi.getHomeData({ type: homeType.fine });
            this.recommendList = res.data;
            save(kHomeRecommendStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const recommendModule = new RecommendModule();
