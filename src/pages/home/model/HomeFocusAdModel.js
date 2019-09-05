import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';

const { px2dp } = ScreenUtils;
const kAdWidth = (ScreenUtils.width - px2dp(30)) / 2 - 0.5;
export const kAdHeight = kAdWidth * (80 / 170);

class HomeFocusAdModel {
    @observable focusAdList = [];
    @observable foucusHeight = 0;

    @action loadAdList = flow(function* () {
        try {
            const res = yield HomeApi.getHomeData({ type: homeType.focusGrid });
            let data = res.data || [];
            if (data.length > 0) {
                this.focusAdList = [];
                let focusData = {
                    itemData: data,
                    id: 4,
                    type: homeType.focusGrid
                };
                this.focusAdList.push(focusData);
            } else {
                this.focusAdList = [];
            }
            this.foucusHeight = data.length > 0 ? (kAdHeight * 2 - 0.5) : 0;
            homeModule.changeHomeList(homeType.focusGrid, this.focusAdList);
        } catch (error) {
            console.log(error);
        }
    });
}

export const homeFocusAdModel = new HomeFocusAdModel();
