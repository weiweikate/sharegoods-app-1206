import { action, observable } from "mobx";
import orderApi from '../api/orderApi';
// import TimerMixin from 'react-timer-mixin';
import { DeviceEventEmitter } from 'react-native';

class AfterSaleDetailModel {
    serviceNo = 0;
    loadingShow = null;
    loadingDismiss = null;
    toastShow = null;
    @observable
    isLoaded = false;
    @observable
    pageData = null;
    @observable
    timeString = 0;

    @action
    loadPageData(callBack){
        this.loadingShow&&this.loadingShow();
        orderApi.returnProductLookDetail({returnProductId: this.serviceNo}).then(result => {
            this.loadingDismiss&&this.loadingDismiss();
            this.pageData = result.data;
            this.startTimer(5);
            this.isLoaded = true;
        }).catch((error)=>{
            this.loadingDismiss&&this.loadingDismiss();
            this.isLoaded = true;
        })
    }
    @action
    stopTimer() {
        this.timer && clearInterval(this.timer);
    }

    /**
     * 获取剩余时间的字符串
     * @param out_time 失效时间 number
     * return 如果当前时间大于 out_time 返回 null
     */
    @action
    getRemainingTime(remainingTime) {


        if (remainingTime <= 0) {
            return '已超时';
        }
        let s = remainingTime;
        remainingTime = (remainingTime - s) / 60;
        let m = remainingTime % 60;
        remainingTime = (remainingTime - m) / 60;
        let H = remainingTime % 24;
        remainingTime = (remainingTime - H) / 24;
        let d = remainingTime;

        return '剩余' + d + '天' + H + '小时' + m + '分' + s + '秒';
    }

    @action
    startTimer(remainingTime) {
        this.stopTimer();
        if (remainingTime === null || remainingTime === undefined) {
            return;
        }
        /** 当前的时间已经超出，不开启定时器*/
        this.timeString = this.getRemainingTime(remainingTime);
        this.timer = setInterval(() => {
            remainingTime--;
             this.timeString = this.getRemainingTime(remainingTime);
            if (this.timeString === '已超时') {
                DeviceEventEmitter.emit('OrderNeedRefresh');
                this.stopTimer();
                this.loadPageData();
            } else {

            }
        }, 1000);
    }
}

export default AfterSaleDetailModel;
