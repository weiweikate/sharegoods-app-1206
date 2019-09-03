import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import ScreenUtil from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';

const kHomeHotStore = '@home/kHomeHotStore';

const { px2dp } = ScreenUtil;

const bannerWidth = ScreenUtil.width - px2dp(50);
const bannerHeight = bannerWidth * (240 / 650);

//专题
class SubjectModule {
    @observable subjectList = [];
    subBannerHeight = bannerHeight;

    //记载专题
    @action
    loadSubjectList = flow(function* () {
        try {
            const res = yield HomeApi.getHomeData({ type: homeType.homeHot });
            let list = res.data || [];
            this.computeHeight(list);
            store.save(kHomeHotStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });

    computeHeight = (data) => {
        if (data.length > 0) {
            this.subjectList = [];
            let subList = [];
            data.map((value, index) => {
                subList.push({
                    itemData: value,
                    type: homeType.homeHot,
                    id: value.id + '_' + index,
                    itemIndex: index
                });
            });
            this.subjectList = subList;
        } else {
            this.subjectList = [];
        }
        homeModule.changeHomeList(homeType.homeHot, this.subjectList);
    };
}

export const subjectModule = new SubjectModule();
