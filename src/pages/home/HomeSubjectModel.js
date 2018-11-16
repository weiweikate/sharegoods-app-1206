import { observable, flow, action } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType }   from './HomeTypes'
import { AsyncStorage } from 'react-native'

const kHomeSujectStore = '@home/kHomeSujectStore'

//专题
class SubjectModule {
  @observable subjectList = [];
  //记载专题
  @action
  loadSubjectList = flow(function* (isCache) {
      try {
        if (isCache) {
          const storeRes = yield AsyncStorage.getItem(kHomeSujectStore)
          if (storeRes) {
            this.subjectList = JSON.parse(storeRes)
          }
        }
          const res = yield HomeApi.getSubject({ type: homeType.subject });
          this.subjectList = res.data;
          AsyncStorage.setItem(kHomeSujectStore, JSON.stringify(res.data))
      } catch (error) {
          console.log(error);
      }
  });
}

export const subjectModule = new SubjectModule()
