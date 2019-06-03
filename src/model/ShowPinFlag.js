import { action, observable } from 'mobx';


class ShowPinFlag {
    @observable showFlag = false;
    @observable showTab = false;

    @action saveShowFlag(isShow) {
        if (isShow === this.showFlag) {
            return;
        }
        if (isShow) {
            setTimeout(() => {
                this.showFlag = isShow;
            }, 300);
        } else {
            this.showFlag = isShow;
        }
    }

    @action saveShowTab(isShow) {
        if (isShow === this.showTab) {
            return;
        }
        if (isShow) {
            setTimeout(() => {
                this.showTab = isShow;
            }, 100);
        } else {
            this.showTab = isShow;
        }
    }
}


const showPinFlagModel = new ShowPinFlag();

export default showPinFlagModel;
