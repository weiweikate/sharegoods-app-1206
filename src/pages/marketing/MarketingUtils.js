import {action, observable} from 'mobx';
import ModalType from './components/ModalType';


class MarketingUtils {
    @observable isShowModal = false;
    @observable currentContent = null;
    @observable type = null;

    @action closeModal  ()  {
        this.isShowModal = false;
        this.type = null;
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


}

const marketingUtils = new MarketingUtils();
export default marketingUtils;
