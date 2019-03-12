import { action, observable } from 'mobx';

class HomeTabManager {
    @observable
    aboveRecommend = false;
    @observable
    homeFocus = true;
    @observable
    nowProgress = 1;

    @action
    setAboveRecommend(recommend) {
        this.aboveRecommend = recommend;
        this.nowProgress = recommend ? 0.5 : 1;
    }
}

const homeTabManager = new HomeTabManager();
export { homeTabManager };
