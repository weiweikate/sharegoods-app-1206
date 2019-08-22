import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import store from '@mr/rn-store';

const kHomeTabStore = '@home/kHomeTabStore';


//专题
class HomeTabModel {
    @observable tabList = [];

    //记载专题
    @action
    loadTabList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeTabStore);
                if (storeRes) {
                    this.tabList = storeRes || [];
                }
            }
            const res = yield HomeApi.getFirstList();
            let list = res.data || [];
            this.tabList = list;
            store.save(kHomeTabStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const tabModel = new HomeTabModel();
