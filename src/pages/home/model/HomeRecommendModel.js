import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import { homeModule } from './Modules';

const kHomeRecommendFineStore = '@home/kHomeRecommendFineStore';

//精品推荐
class RecommendModule {
    @observable recommendList = [];

    @action loadRecommendList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeRecommendFineStore);
                if (storeRes) {
                    this.recommendList = storeRes || [];
                }
            }

            const res = yield HomeApi.getHomeData({ type: homeType.fine });
            this.recommendList = res.data || [];
            homeModule.changeHomeList(homeType.fine, [{
                id: 8,
                type: homeType.fine
            }]);
            store.save(kHomeRecommendFineStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const recommendModule = new RecommendModule();
