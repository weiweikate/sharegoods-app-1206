import { action, observable } from 'mobx';
// import TimerMixin from 'react-timer-mixin';
import { DeviceEventEmitter } from 'react-native';
import {AfterStatus, SubStatus} from './AfterType'
import orderApi from '../api/orderApi'

class AfterSaleDetailModel {
    serviceNo = 0;
    loadingShow = null;
    loadingDismiss = null;
    toastShow = null;
    @observable
    refreshing = false;
    @observable
    isLoaded = false;
    @observable
    pageData = null;
    @observable
    timeString = '';
    @observable
    headerTitle = '';
    @observable
    detailTitle = '';
    @observable
    reject = '';
    @action
    loadPageData(callBack) {
        this.refreshing = true;
        this.loadingShow && this.loadingShow();
        orderApi.afterSaleDetail({ serviceNo: this.serviceNo }).then(result => {
            this.loadingDismiss && this.loadingDismiss();
            let data = result.data || {};
            data.service = data.service || {};
            data.exchangeExpress = data.exchangeExpress || {};
            data.refundAddress = data.refundAddress || {};
            data.product = data.product || {};
            data.refundAddress = data.refundAddress || {};
            data.refundInfo = data.refundInfo || {};
            let service = data.service;
            let status = service.status;
            let subStatus = service.subStatus;
            //申请被拒绝且，有物流，说明在寄回商品以后被拒绝（把subStatus状态REFUSE_APPLY改为REFUSE_AFTER）
            if (status === AfterStatus.STATUS_FAIL){
                if (subStatus === SubStatus.REFUSE_APPLY && this.pageData.orderRefundExpress && this.pageData.orderRefundExpress.expressNo) {
                    data.service.subStatus = SubStatus.REFUSE_AFTER;
                }
            }
            if (status === 7){
                data.service.status = AfterStatus.STATUS_IN_REVIEW;
            }
            this.pageData = data
            let cancelTime = service.cancelTime || 0;
            let nowTime = service.currentTime || 0;
            let countDownSeconds = Math.ceil((cancelTime - nowTime) / 1000);
            if (status === 2 && countDownSeconds > 0) {
                this.startTimer(countDownSeconds);
            } else {
                this.stopTimer();
            }
            if (status === AfterStatus.STATUS_IN_REVIEW) {
                callBack && callBack();//审核中,就执行callBack（callBack里面就是取消、修改的操作）
            } else if (callBack) {
                /** 有callBack,但是状态不是在审核中*/
                this.toastShow('售后订单已经改变');
                this.loadPageData();
                return;
            }
            this.isLoaded = true;
            this.refreshing = false;

        }).catch((error) => {
            this.refreshing = false;
            this.loadingDismiss && this.loadingDismiss();
            this.isLoaded = true;

        });
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

        return  d + '天' + H + '小时' + m + '分' + s + '秒';
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
