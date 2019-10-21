import {action, observable} from 'mobx';
import paySuccessMarketing from './controller/PaySuccessController';

const ModalType = {
    activity:'activity',
    egg:'egg'
}
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

    /**
     * 拦截路由，在合适的页面显示营销弹窗
     * @param prevState
     * @param currentState
     */
    navigationIntercept = (prevState, currentState) => {
        if(paySuccessMarketing.check(prevState,currentState)){
            return;
        }

    }

}

const marketingUtils = new MarketingUtils();
export {marketingUtils,ModalType}
