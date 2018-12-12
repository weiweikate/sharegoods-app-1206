import { action, observable } from "mobx";
import orderApi from '../api/orderApi';
// import TimerMixin from 'react-timer-mixin';
import { DeviceEventEmitter } from 'react-native';

class AfterSaleDetailModel {
    serviceNo = 0;
    loadingShow = null;
    loadingDismiss = null;
    toastShow = null;
    navigationBarResetTitle = null;
    @observable
    refreshing = false;
    @observable
    isLoaded = false;
    @observable
    pageData = null;
    @observable
    timeString = '';

    @action
    loadPageData(callBack){
        this.refreshing = true;
        this.loadingShow&&this.loadingShow();
        orderApi.afterSaleDetail({serviceNo: this.serviceNo}).then(result => {
            this.loadingDismiss&&this.loadingDismiss();
            this.pageData = result.data;
            let status = this.pageData.status;
            let cancelTime = this.pageData.cancelTime || 0;
            let nowTime = this.pageData.nowTime || 0;
            let countDownSeconds = Math.ceil((cancelTime - nowTime)/1000);
            if (status === 2 && countDownSeconds > 0){
                this.startTimer(countDownSeconds);
            }else {
                this.stopTimer();
            }
            if (status === 1){
                callBack&&callBack()
            }else if (callBack) {
                this.toastShow('售后订单已经改变');
                this.loadPageData();
                return;
            }
            this.isLoaded = true;
            this.refreshing = false;
            this.navigationBarResetTitle(['退款详情','退货详情','换货详情'][result.data.type -1])
        }).catch((error)=>{
            this.refreshing = false;
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
        let s = remainingTime % 60;
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
