import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { get, save } from '@mr/rn-store';

const kHomeTodayStore = '@home/kHomeTodayStore';

//今日榜单
class TodayModule {
    @observable todayList = [];

    @action loadTodayList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeTodayStore);
                if (storeRes) {
                    this.todayList = storeRes||[];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.today });
            this.todayList = res.data||[];
            save(kHomeTodayStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const todayModule = new TodayModule();
