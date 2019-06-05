import { action, observable } from 'mobx';


class ShowPinFlag {
    @observable showFlag = true;

    @action saveShowFlag(isShow) {
        if (isShow === this.showFlag) {
            return;
        }
        if (isShow) {
            setTimeout(() => {
                this.showFlag = isShow;
            }, 100);
        } else {
            this.showFlag = isShow;
            clearTimeout();
        }
    }
}


const showPinFlagModel = new ShowPinFlag();

export default showPinFlagModel;
