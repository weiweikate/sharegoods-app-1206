import { action, observable } from 'mobx';


class ShowPinFlag {
    @observable showFlag = true;

    @action saveShowFlag(isShow){
        this.showFlag = isShow;
    }
}


const showPinFlagModel = new ShowPinFlag();

export default showPinFlagModel
