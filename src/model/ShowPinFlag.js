import { action, observable } from 'mobx';


class ShowPinFlag {
    @observable showFlag = false;
    @observable showTab = false;
    @observable isFirstLoad = true;

    @action saveShowFlag(isShow) {
        if (isShow === this.showFlag) {
            return;
        }
        if (this.isFirstLoad) {
            setTimeout(() => {
                this.showFlag = isShow;
            }, 400);
            this.isFirstLoad = false;
        } else {
            if (isShow) {
                setTimeout(() => {
                    this.showFlag = isShow;
                }, 200);
            } else {
                this.showFlag = isShow;
            }
        }
    }

    @action saveShowTab(isShow) {
        if (isShow === this.showTab) {
            return;
        }
        if (!isShow) {
            clearTimeout();
        }
        this.showTab = isShow;
    }
}


const showPinFlagModel = new ShowPinFlag();

export default showPinFlagModel;
