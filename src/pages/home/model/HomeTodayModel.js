import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import { homeModule } from './Modules';

const kHomeTodayHotStore = '@home/kHomeTodayHotStore';

//今日榜单
class TodayModule {
    @observable todayList = [];

    @action loadTodayList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeTodayHotStore);
                if (storeRes) {
                    this.todayList = storeRes || [];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.today });
            this.todayList = res.data || [];
            homeModule.changeHomeList(homeType.today, [{
                id: 7,
                type: homeType.today
            }]);
            store.save(kHomeTodayHotStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const todayModule = new TodayModule();
