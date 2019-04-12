import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';

const { px2dp } = ScreenUtils;
const kAdWidth = (ScreenUtils.width - px2dp(30)) / 2 - 0.5;
export const kAdHeight = kAdWidth * (80 / 170);

class HomeFocusAdModel {
    @observable ad = [];
    @observable foucusHeight = 0;

    @action loadAdList = flow(function* () {
        try {
            const res = yield HomeApi.getHomeData({ type: homeType.focusGrid });
            this.ad = res.data || [];
            this.foucusHeight = this.ad.length > 0 ? kAdHeight * 2 - 0.5 : 0;
            homeModule.changeHomeList(homeType.focusGrid);
        } catch (error) {
            console.log(error);
        }
    });
}

export const homeFocusAdModel = new HomeFocusAdModel();
