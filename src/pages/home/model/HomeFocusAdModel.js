import { observable, flow, action, computed } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { get, save } from '@mr/rn-store';
import ScreenUtils from '../../../utils/ScreenUtils';

const kHomeAdStore = '@home/kHomeAdStore';
const { px2dp } = ScreenUtils;
const kAdWidth = (ScreenUtils.width - px2dp(30)) / 2 - 0.5;
const kAdHeight = kAdWidth * (80 / 170);

class HomeFocusAdModel {
    @observable ad = [];

    imgUrls = [];

    @computed get adHeight() {
        return kAdHeight * 2;
    }

    @action loadAdList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeAdStore);
                if (storeRes) {
                    this.ad = storeRes;
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.focusGrid });
            this.ad = res.data || [];
            save(kHomeAdStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const homeFocusAdModel = new HomeFocusAdModel();
