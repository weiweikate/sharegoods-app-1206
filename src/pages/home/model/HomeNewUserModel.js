import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import { getSize } from '../../../utils/OssHelper';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';

const kHomeNewUserStore = '@home/kHomeExpandStore';
const autoSizeWidth = ScreenUtils.autoSizeWidth;

class HomeNewUserModel {
    @observable newUserData = [];
    @observable imgHeight = 0;

    imgUrls = [];

    @action loadNewUserArea = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeNewUserStore);
                if (storeRes) {
                    this.handleImageHeight(storeRes);
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.newUserArea });
            let [data = {}] = res.data || [];
            this.handleImageHeight(data);
            store.save(kHomeNewUserStore, data);
        } catch (error) {
            console.log(error);
        }
    });

    @action handleImageHeight(data) {
        this.newUserData = data;
        if (StringUtils.isEmpty(data.image)) {
            this.imgHeight = 0;
            homeModule.changeHomeList(homeType.newUserArea, [{
                id: 21,
                type: homeType.newUserArea
            }]);
        } else {
            getSize(data.image, (width, height) => {
                this.imgHeight = autoSizeWidth(height);
                homeModule.changeHomeList(homeType.newUserArea, [{
                    id: 21,
                    type: homeType.newUserArea
                }]);
            });
        }
    }
}

export const homeNewUserModel = new HomeNewUserModel();

