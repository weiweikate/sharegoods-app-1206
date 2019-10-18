import {action, observable} from 'mobx';

class MarketingUtils {
    @observable isShowModal = false;
    @observable currentContent = null;

    @action closeModal  ()  {
        this.isShowModal = false;
    }

    @action openModal  ()  {
        this.isShowModal = true;
    }

    /**
     * 拦截路由，在合适的页面显示营销弹窗
     * @param prevState
     * @param currentState
     */
    navigationIntercept = (prevState, currentState) => {
        // if(paySuccessMarketing.check(prevState,currentState)){
        //     return;
        // }

    }

}

const marketingUtils = new MarketingUtils();
export {marketingUtils}
