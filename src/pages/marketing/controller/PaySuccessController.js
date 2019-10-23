/**
 * @author xzm
 * @date 2019/10/18
 */
import store from '@mr/rn-store';
import marketingUtils from '../MarketingUtils';
import ModalType from '../components/ModalType';
import DateUtils from '../../../utils/DateUtils';

const ONECOREVERY = '@paysuccesscontroller/oneorevery';
//支付成功展示次数
const SHOWTIME = '@paysuccesscontroller/time';

class PaySuccessController {

    constructor(){
        this.leaveNeedShow = false;
        //最多弹两次
        this.residueDegree = 2;
        this.getShowTime();
    }

    //获取剩余弹出次数
    async getShowTime(){
        //存储格式为{timestamp:?,time:?}
        try {
            let showTime = await store.get(SHOWTIME);
            if(showTime !== null && DateUtils.isToday(showTime.timestamp)){
                this.residueDegree = showTime.time;
            }
        }catch (e) {

        }
    }

    //普通支付成功立刻弹出营销弹窗
    notifyPayNormal(){
        if(this.residueDegree < 1){
            return;
        }
        marketingUtils.openModalWithType(ModalType.activity);
        this.residueDegree--;
        this._saveShowTime();
    }

    //拼团营销弹窗，离开弹出
    notifyPayPin(){
        if(this.residueDegree < 1){
            return;
        }
        this.leaveNeedShow = true;
    }

    notifyPayPinLeave(){
        if(this.leaveNeedShow && this.residueDegree > 0){
            marketingUtils.openModalWithType(ModalType.activity);
            this.leaveNeedShow = false;
            this.residueDegree--;
            this._saveShowTime();
        }
    }

    //保存营销弹窗展示的剩余次数
    _saveShowTime(){
        const showTime = {
            time:this.residueDegree,
            timestamp:new Date().getTime()
        }
        store.save(SHOWTIME,showTime);
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
