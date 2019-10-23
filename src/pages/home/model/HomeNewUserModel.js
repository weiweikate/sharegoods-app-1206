import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';

const kHomeNewUserStore = '@home/kHomeExpandStore';

class HomeNewUserModel {
    @observable newUserData = [];
    @observable imgHeight = 0;

    imgUrls = [];

    @action loadNewUserArea = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeNewUserStore);
                if (storeRes) {
                    this.handleImageHeight(storeRes.data || []);
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.newUserArea });
            this.handleImageHeight(res.data || []);
            store.save(kHomeNewUserStore, res.data || []);
        } catch (error) {
            console.log(error);
        }
    });

    @action handleImageHeight(data) {
        this.newUserData = data;
    }
}

export const homeNewUserModel = new HomeNewUserModel();

