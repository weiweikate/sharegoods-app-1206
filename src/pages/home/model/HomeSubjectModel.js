import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';

const kHomeHotStore = '@home/kHomeHotStore';
import ScreenUtil from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;

const bannerWidth = ScreenUtil.width - px2dp(50);
const bannerHeight = bannerWidth * (240 / 650);
import { homeModule } from './Modules';

//专题
class SubjectModule {
    @observable subjectList = [];
    @observable subjectHeight = 0;
    //记载专题
    @action
    loadSubjectList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeHotStore);
                if (storeRes) {
                    this.computeHeight(storeRes);
                    this.subjectList = storeRes || [];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.homeHot });
            let list = res.data || [];
            this.computeHeight(list);
            this.subjectList = list;
            homeModule.changeHomeList(homeType.homeHot);
            store.save(kHomeHotStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });

    computeHeight = (data) => {
        if (data.length > 0) {
            let height = px2dp(60);
            data.map(value => {
                const { topicBannerProductDTOList } = value;
                if (topicBannerProductDTOList && topicBannerProductDTOList.length > 0) {
                    height += px2dp(185);
                } else {
                    height += px2dp(15);
                }
                height += bannerHeight;
            });
            this.subjectHeight = height;
        }
    };
}

export const subjectModule = new SubjectModule();
