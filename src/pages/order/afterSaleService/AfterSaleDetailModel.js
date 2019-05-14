import { action, observable } from 'mobx';
import orderApi from '../api/orderApi';
// import TimerMixin from 'react-timer-mixin';
import { DeviceEventEmitter } from 'react-native';
import {AfterStatus, SubStatus} from './AfterType'

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
        // this.loadingShow && this.loadingShow();
        // orderApi.afterSaleDetail({ serviceNo: this.serviceNo }).then(result => {
        //     this.loadingDismiss && this.loadingDismiss();
        let result = {};
            result.data = {
                "serviceNo": "3190321161030619116103",
                    "platformOrderNo": "P190103152053000001",
                    "warehouseOrderNo": "C190103152053000001",
                    "orderProductNo": "G190103152053000001",
                    "userCode": "1000004",
                    "userPhone": "15755373887",
                    "supplierCode": "GYS00002",
                    "supplierName": "小米供应商",
                    "productName": "我是测试产品3.0",
                    "type": 3,
                    "refundNum": 1,
                    "payAmount": 0.01,
                    "applyRefundAmount": 0.01,
                    "adjustAmount": null,
                    "damageNum": 0,
                    "reason": "七天无理由退换",
                    "description": "",
                    "remarks": 'remarks',
                    "warehouseType": 3,
                    "warehouseCode": null,
                    "sendWarehouseFeedback": null,
                    "refundWarehouseFeedback": null,
                    "status": 5,
                    "subStatus": 2,
                    "cancelTime": 1557209035451,
                    "imgList": "",
                    "receiver": null,
                    "receiverPhone": null,
                    "province": null,
                    "city": null,
                    "area": null,
                    "street": null,
                    "address": null,
                    "createTime": 1553155831000,
                    "updateTime": 1556590104000,
                    "skuCode": "SKU000002470001",
                    "specTitle": "默认",
                    "specValues": "默认",
                    "spec": "默认:默认",
                    "specImg": "https://testcdn.sharegoodsmall.com/sharegoods/383d458cc2384e118d4c36ab311708d4.png",
                    "originalPrice": 0.01,
                    "unitPrice": 0.01,
                    "quantity": 1,
                    "refundPrice": 0.01,
                    "refundAddress": {
                    "receiver": "张三",
                        "receiverPhone": "07946499535",
                        "province": "上海市",
                        "city": "市辖区",
                        "area": "徐汇区",
                        "street": null,
                        "address": "一二三四五六七八九十十一十二十三十四十五十六十七十八十九二十二一二二二三二四二五二六二七二八二九三十"
                },
                "refundAccountAmount": null,
                    "refundCashAmount": null,
                    "maxRevokeTimes": null,
                    "hadRevokeTimes": null,
                    "orderRefundExpress": null,
                    "sendExpressCode": null,
                    "sendExpressName": null,
                    "sendExpressNo": '21212',
                    "reject": "买家取消本次退款申请",
                    "headerTitle": "退款关闭",
                    "nowTime": 1557208035451,
                    "refundStatus": 3
            };
            this.pageData = result.data || {};
            let status = this.pageData.status;
            let subStatus = this.pageData.subStatus;
            //申请被拒绝且，有物流，说明在寄回商品以后被拒绝（把subStatus状态REFUSE_APPLY改为REFUSE_AFTER）
            if (status === AfterStatus.FAIL){
                if (subStatus === SubStatus.REFUSE_APPLY && this.pageData.orderRefundExpress && this.pageData.orderRefundExpress.expressName) {
                    this.pageData.subStatus = SubStatus.REFUSE_AFTER;
                }
            }
            let refundStatus = this.pageData.refundStatus;
            let remarks = this.pageData.remarks;
            let cancelTime = this.pageData.cancelTime || 0;
            let nowTime = this.pageData.nowTime || 0;
            let countDownSeconds = Math.ceil((cancelTime - nowTime) / 1000);
            if (status === 2 && countDownSeconds > 0) {
                this.startTimer(countDownSeconds);
            } else {
                this.stopTimer();
            }
            if (status === 1) {
                callBack && callBack();
            } else if (callBack) {
                this.toastShow('售后订单已经改变');
                this.loadPageData();
                return;
            }
            this.isLoaded = true;
            this.refreshing = false;
            switch (result.data.type) {
                case 1: {
                    if (status === 1) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台处理';
                    } else if (status === 2) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '';
                    } else if (status === 3) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '';
                    } else if (status === 4) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '';
                    } else if (status === 5) {
                        this.headerTitle = '售后完成';
                        this.detailTitle = '退款成功';
                        if (refundStatus && (refundStatus === 3 || refundStatus === 4)) {
                            this.detailTitle = '退款失败，若有问题请联系客服';
                        }
                    } else if (status === 6) {
                        this.headerTitle = '售后关闭';
                        if (subStatus === 1) {
                            this.reject = '买家取消退款申请';
                            this.detailTitle = '退款关闭';
                        } else if (subStatus === 2) {
                            this.reject = '超时关闭原因：买家未提交物流信息';
                            this.detailTitle = '退款超时关闭';
                        } else if (subStatus === 3) {
                            this.reject = remarks ? '平台拒绝理由：' + remarks : '';
                            this.detailTitle = '平台拒绝退款';
                        }
                    }
                }
                    break;
                case 2: {
                    if (status === 1) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台处理';
                    } else if (status === 2) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待买家提交物流信息';
                    } else if (status === 3) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台确认收货';
                    } else if (status === 4) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台确认收货';
                    } else if (status === 5) {
                        this.headerTitle = '售后完成';
                        this.detailTitle = '退货成功';
                        if (refundStatus && (refundStatus === 3 || refundStatus === 4)) {
                            this.detailTitle = '退款失败，若有问题请联系客服';
                        }
                    } else if (status === 6) {
                        this.headerTitle = '售后关闭';
                        if (subStatus === 1) {
                            this.reject = '买家取消退货申请';
                            this.detailTitle = '退款退款关闭';
                        } else if (subStatus === 2) {
                            this.reject = '超时关闭原因：买家未提交物流信息';
                            this.detailTitle = '退款退款超时关闭';
                        } else if (subStatus === 3) {
                            this.reject = remarks ? '平台拒绝理由：' + remarks : '';
                            this.detailTitle = '平台拒绝退款退款';
                        }
                    }
                }
                    break;
                case 3: {
                    if (status === 1) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台处理';
                    } else if (status === 2) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待买家提交物流信息';
                    } else if (status === 3) {
                        this.headerTitle = '售后处理中';
                        this.detailTitle = '等待平台确认收货';
                    } else if (status === 4) {
                        this.headerTitle = '售后处理中';
                        if (this.pageData.sendExpressNo) {
                            this.detailTitle = '平台已安排发货';
                        } else {
                            this.detailTitle = '等待平台发货';
                        }
                    } else if (status === 5) {
                        this.headerTitle = '售后完成';
                        this.detailTitle = '换货成功';
                        if (refundStatus && (refundStatus === 3 || refundStatus === 4)) {
                            this.detailTitle = '退款失败，若有问题请联系客服';
                        }
                    } else if (status === 6) {
                        this.headerTitle = '售后关闭';
                        if (subStatus === 1) {
                            this.reject = '买家取消换货申请';
                            this.detailTitle = '换货关闭';
                        } else if (subStatus === 2) {
                            this.reject = '超时关闭原因：买家未提交物流信息';
                            this.detailTitle = '换货超时关闭';
                        } else if (subStatus === 3) {
                            this.reject = remarks ? '平台拒绝理由：' + remarks : '';
                            this.detailTitle = '平台拒绝换货';
                        }
                    }
                }
                    break;
            }
            // status,// 1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
            //     subStatus,  // REVOKED(1, "手动撤销"),OVERTIME(2, "超时关闭"),(3, "拒绝关闭");
            //     refundStatus,//退款状态: 1.待退款 2.退款成功 3.三方退款失败 4.平台退款失败 5.取消退款(关闭)

        // }).catch((error) => {
        //     this.refreshing = false;
        //     this.loadingDismiss && this.loadingDismiss();
        //     this.isLoaded = true;
        //
        // });
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
