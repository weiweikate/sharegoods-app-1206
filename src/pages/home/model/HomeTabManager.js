import { action, observable } from 'mobx';

class HomeTabManager {
    @observable
    aboveRecommend = false;

    @action
    setAboveRecommend(recommend) {
        this.aboveRecommend = recommend;
    }
}

const homeTabManager = new HomeTabManager();
export  { homeTabManager };
