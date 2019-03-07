import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { get, save } from '@mr/rn-store'
const kHomeSujectStore = '@home/kHomeSujectStore'
import ScreenUtil from '../../utils/ScreenUtils';
const { px2dp } = ScreenUtil;

const bannerWidth = ScreenUtil.width - px2dp(50)
const bannerHeight = bannerWidth * (240 / 650)
//专题
class SubjectModule {
  @observable subjectList = [];
  @observable subjectHeight = 0;
  //记载专题
  @action
  loadSubjectList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield get(kHomeSujectStore)
          if (storeRes) {
            this.subjectList = storeRes
          }
        }
          const res = yield HomeApi.getSubject({ type: homeType.subject });
          let list = res.data;
          let height = px2dp(57);
          list.map(value => {
            const { topicBannerProductDTOList } = value
            if (topicBannerProductDTOList && topicBannerProductDTOList.length > 0) {
              height += px2dp(185);
            } else {
              height += px2dp(15);
            }
            height += bannerHeight;
          })
          this.subjectHeight = height;
          this.subjectList = list;
          save(kHomeSujectStore, res.data)
      } catch (error) {
          console.log(error);
      }
  });
}

export const subjectModule = new SubjectModule()
