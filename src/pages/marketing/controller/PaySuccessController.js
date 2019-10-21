/**
 * @author xzm
 * @date 2019/10/18
 */
import {getCurrentRouteName} from '../../../navigation/Navigator';
import RouterMap from '../../../navigation/RouterMap';
import store from '@mr/rn-store';
import _ from 'lodash';
import {marketingUtils} from '../MarketingUtils';

const ONECOREVERY = 'PaySuccessController_OneOrEvery';
class PaySuccessController {

    constructor(){
        //防止重复请求网络数据
        this.handleGetConfig = _.throttle(this.getConfig,1000,{trailing:false});
        this.leaveNeedShow = false;
    }
    //路由到达支付成功页，获取弹窗规则
    whenArrivedPaySuccess(prevState, currentState){
        let result = false;
        if(getCurrentRouteName(currentState) === RouterMap.SignInPage){
            result = true;
            this.handleGetConfig();
        }
        return result;
    }

    //路由离开支付成功页，
    whenLeavedPaySuccess(prevState, currentState){
        let result = false;
        if(getCurrentRouteName(currentState) === RouterMap.PaymentFinshPage){
            result = true;
            if(this.leaveNeedShow){
                this.showByConfig();
                this.leaveNeedShow = false;
            }
        }
        return result;
    }

    //获取支付成功营销弹窗配置
    async getConfig(){
        let oneOrEvery = await store.get(ONECOREVERY);
        if(oneOrEvery === null){
            setTimeout(()=>{
                this.showByConfig();
            },1000)
        }
    }


    showByConfig(){
        if(true){
            marketingUtils.openModal();
        }else {
            this.leaveNeedShow = true;
        }
    }


    check(prevState, currentState){
        return this.whenArrivedPaySuccess(prevState,currentState) || this.whenLeavedPaySuccess(prevState,currentState);
    }
}


const paySuccessMarketing = new PaySuccessController();
export default paySuccessMarketing;
