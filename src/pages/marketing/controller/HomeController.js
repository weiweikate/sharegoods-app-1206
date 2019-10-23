/**
 * @author xzm
 * @date 2019/10/22
 */
import _ from 'lodash';
import store from '@mr/rn-store/src/index';
import ModalType from '../components/ModalType';
import marketingUtils from '../MarketingUtils';
import HomeModalManager from '../../home/manager/HomeModalManager';
import DateUtils from '../../../utils/DateUtils';

// const ONECOREVERY = '@homecontroller/oneorevery';
const SHOWTIME = '@homecontroller/time';

class HomeController {
    constructor() {
        this.handleGetConfig = _.throttle(this.getConfig,1000,{trailing:false});
        this.isRequested = false;
        this.needShow = false;
        this.residueDegree = 1;
        this.getShowTime();
    }


    notifyArrivedHome(){
        if(this.residueDegree < 1){
            return;
        }
        this.handleGetConfig();
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

    //获取营销弹窗配置
    async getConfig(){
        if(this.isRequested){
            this.showByConfig();
            return;
        }
        //TODO
        setTimeout(()=>{
            this.needShow = true;
            this.isRequested = true;
            this.showByConfig();
        },1000)
    }


    showByConfig(){
        if(HomeModalManager.isShowModal){
            return;
        }
        if(this.needShow){
            marketingUtils.openModalWithType(ModalType.activity);
            this.needShow = false;
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

}

const homeController = new HomeController();
export default homeController;
