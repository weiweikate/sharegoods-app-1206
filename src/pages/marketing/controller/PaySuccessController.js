/**
 * @author xzm
 * @date 2019/10/18
 */
import store from '@mr/rn-store';
import marketingUtils from '../MarketingUtils';
import ModalType from '../components/ModalType';

const ONECOREVERY = 'PaySuccessController_OneOrEvery';

class PaySuccessController {

    constructor(){
        this.leaveNeedShow = false;
        //最多弹两次
        this.residueDegree = 2;
    }

    notifyPayNormal(){
        if(this.residueDegree < 1){
            return;
        }
        marketingUtils.openModalWithType(ModalType.egg);
        this.residueDegree--;
    }

    notifyPayPin(){
        if(this.residueDegree < 1){
            return;
        }
        this.leaveNeedShow = true;
    }

    notifyPayPinLeave(){
        if(this.leaveNeedShow && this.residueDegree > 0){
            marketingUtils.openModalWithType(ModalType.egg);
            this.leaveNeedShow = false;
            this.residueDegree--;
        }
    }

    //获取支付成功营销弹窗配置
    async getConfig(){
        let oneOrEvery = await store.get(ONECOREVERY);
        if(oneOrEvery === null){
            //TODO
            setTimeout(()=>{
                this.showByConfig();
            },1000)
        }
    }

    //拉取配置
    showByConfig(){
        //TODO
        if(true){
            marketingUtils.openModalWithType(ModalType.egg);
        }else {
            this.leaveNeedShow = true;
        }
    }
}


const paySuccessMarketing = new PaySuccessController();
export default paySuccessMarketing;
