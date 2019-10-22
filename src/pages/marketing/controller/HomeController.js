/**
 * @author xzm
 * @date 2019/10/22
 */
import _ from 'lodash';
import store from '@mr/rn-store/src/index';
import ModalType from '../components/ModalType';
import marketingUtils from '../MarketingUtils';
import HomeModalManager from '../../home/manager/HomeModalManager';


const ONECOREVERY = 'HomeController_OneOrEvery';

class HomeController {
    constructor() {
        this.handleGetConfig = _.throttle(this.getConfig,1000,{trailing:false});
        this.isRequested = false;
        this.needShow = false;
    }


    //路由判断有点问题，先通过通知来判断
    notifyArrivedHome(){
        this.handleGetConfig();
    }

    //获取营销弹窗配置
    async getConfig(){
        if(this.isRequested){
            this.showByConfig();
            return;
        }
        let oneOrEvery = await store.get(ONECOREVERY);
        if(oneOrEvery === null){
            //TODO
            setTimeout(()=>{
                this.needShow = true;
                this.isRequested = true;
                this.showByConfig();
            },1000)
        }
    }


    showByConfig(){
        if(HomeModalManager.isShowModal){
            return;
        }
        if(this.needShow){
            marketingUtils.openModalWithType(ModalType.activity);
            this.needShow = false;
        }
    }
}

const homeController = new HomeController();
export default homeController;
