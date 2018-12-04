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
    isLoaded = false;
    @observable
    pageData = null;
    @observable
    timeString = 0;

    @action
    loadPageData(callBack){
        this.loadingShow&&this.loadingShow();
        orderApi.afterSaleDetail({serviceNo: this.serviceNo}).then(result => {
            this.loadingDismiss&&this.loadingDismiss();
            this.pageData = result.data;
            this.startTimer(5);
            this.isLoaded = true;
            this.navigationBarResetTitle(['','',''][result.data.type -1])
        }).catch((error)=>{
            this.loadingDismiss&&this.loadingDismiss();
            this.isLoaded = true;
            this.pageData = {
                "serviceNo": "SO4514784441",
                "platformOrderNo": "PO4514784441",
                "warehouseOrderNo": "CO4514784441",
                "orderProductNo": "CO4514784441",
                "userCode": "u******",
                "userPhone": "137****1111",
                "supplierCode": "s******",
                "supplierName": "朵女郎",
                "productName": "衣服xxxx",
                "type": 1,
                "refundNum": 2,
                "payAmount":10,
                "applyRefundAmount":10,
                "adjustAmount":8,
                "damageNum":2,
                "reason":"不要了",
                "description":"大小不接受",
                "remarks":"可以换货哦亲",
                specValue: 'specValues',
                "warehouseType":1,
                "warehouseCode":"s***",
                "sendWarehouseFeedback":"s****",
                "refundWarehouseFeedback":"s****",
                "status":1,
                "subStatus":1,
                "cancelTime":"2018-09-11 00:00:00",
                "imgList":"1,1",
                "receiver":"木木",
                "receiverPhone":"182****3333",
                "province":"浙江省",
                "city":"杭州市",
                "area":"西湖区",
                "street":"文新街道",
                "address":"****西湖区***168号",
                "createTime":"2018-09-11 00:00:00 ",
                "updateTime":"2018-09-11 00:00:00 ",
                "skuCode":"sku***,sku****",
                "specTitle":"g***,g***",
                "specImg":"***",
                "unitPrice":11,
                "quantity":1,
                "refundPrice":1,
                "countDownSeconds":36000000,
                "expressName":"百世汇通",
                "expressCode":"物流单号",
                "backInfo": [
                    {
                        "refundReceiver": "小姐姐",
                        "refundreceiverPhone": "182****11111",
                        "refundAddress": "杭州市西湖区文新街道69号"
                    }
                ]
            }
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
