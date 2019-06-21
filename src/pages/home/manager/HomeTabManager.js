import { action, observable } from 'mobx';

class HomeTabManager {
    @observable
    aboveRecommend = false;
    @observable
    homeFocus = true;

    isAboveRecommend = false;

    @action
    setAboveRecommend(recommend) {
        this.aboveRecommend = recommend;
        this.isAboveRecommend = recommend;
    }

    @action
    setHomeFocus(focus) {
        this.homeFocus = focus;
    }
}

const homeTabManager = new HomeTabManager();
export { homeTabManager };
