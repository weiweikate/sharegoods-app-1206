import {action, observable} from 'mobx';
import {getCurrentRouteName} from '../../navigation/Navigator';
import RouterMap from '../../navigation/RouterMap';

class MarketingUtils {
    @observable isShowModal = false;
    @observable currentContent = null;

    @action closeModal  ()  {
        this.isShowModal = false;
    }

    @action openModal  ()  {
        this.isShowModal = true;
    }


    whenBackToSignIn  (prevState, currentState) {
        let result = false;
        if(getCurrentRouteName(prevState)=== RouterMap.HtmlPage && getCurrentRouteName(currentState) === RouterMap.SignInPage){
            result = true;
        }
        return result;
    }

    async showSignInModal (){
        let result = await this.mockRequest();
        if(result === 1){
            this.openModal();
        }
    }

    mockRequest(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(1);
            },2000);
        })
    }

    /**
     * 拦截路由，在合适的页面显示营销弹窗
     * @param prevState
     * @param currentState
     */
    navigationIntercept = (prevState, currentState) => {
        // if(this.whenBackToSignIn(prevState,currentState)){
        //     this.showSignInModal();
        //     return;
        // }

    }

}

const marketingUtils = new MarketingUtils();
export {marketingUtils}
