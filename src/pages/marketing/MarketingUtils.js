import {action, observable} from 'mobx';
import ModalType from './components/ModalType';


class MarketingUtils {
    @observable isShowModal = false;
    @observable currentContent = null;
    @observable type = null;
    checkUser = false;

    @action closeModal  ()  {
        this.isShowModal = false;
        this.type = null;
        this.currentContent = null;
        this.checkUser = false;
    }

    @action openModal  ()  {
        if(this.type === null){
            return;
        }
        if(!ModalType.hasOwnProperty(this.type)){
            return;
        }
        this.isShowModal = true;
    }

    @action setModalType(type){
        if(!ModalType.hasOwnProperty(this.type)){
            return;
        }
        this.type = type;
    }

    @action openModalWithType(type){
        this.type = type;
        this.isShowModal = true;
    }

    @action replaceContent(params){
        this.currentContent = params;
    }


}

const marketingUtils = new MarketingUtils();
export default marketingUtils;
