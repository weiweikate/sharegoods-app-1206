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
import MarketingApi from '../api/MarketingApi';
import EmptyUtils from '../../../utils/EmptyUtils';
import user from '../../../model/user';

const SHOWTIME = '@homecontroller/time';

class HomeController {
    constructor() {
        this.handleGetConfig = _.throttle(this.getConfig,1000,{trailing:false});
        this.isRequested = false;
        this.needShow = false;
        this.residueDegree = 1;
    }


    async notifyArrivedHome(){
        await this.getShowTime();
        if(this.residueDegree < 1){
            return;
        }
        this.handleGetConfig();
    }

    //获取剩余弹出次数
    async getShowTime(){
        //存储格式为{timestamp:?,time:?}
        try {
            let showTime = await store.get(`${SHOWTIME}${user.code}`);
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
        MarketingApi.getModalData({type:39,showPage:1}).then((data)=>{
            if(!EmptyUtils.isEmptyArr(data.data)){
                marketingUtils.replaceContent(data.data[0]);
                this.needShow = true;
                this.isRequested = true;
                this.showByConfig();
            }
        }).catch((err)=>{})
    }


    showByConfig(){
        if(HomeModalManager.isShowModal){
            return;
        }
        if(this.needShow && this._isInHome()){
            marketingUtils.checkUser = true;
            marketingUtils.openInPage = 'home';
            marketingUtils.openModalWithType(ModalType.activity);
            this.needShow = false;
            this.residueDegree--;
            this._saveShowTime();
        }
    }

    _isInHome(){
        let $routes = global.$routes || [];

        if($routes.length === 0){
            return true;
        }

        if ($routes.length === 1) {
            let route = $routes[0];
            if (route.routeName === 'Tab' && route.index === 0) {
                return true;
            }
        }

        return false;
    }

    //保存营销弹窗展示的剩余次数
    _saveShowTime(){
        const showTime = {
            time:this.residueDegree,
            timestamp:new Date().getTime()
        }
        store.save(`${SHOWTIME}${user.code}`,showTime);
    }

}

const homeController = new HomeController();
export default homeController;
