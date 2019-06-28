import { observable, action } from 'mobx'
import OrderApi from '../api/orderApi'
// import StringUtils from "../../../utils/StringUtils";
import Toast from "../../../utils/bridge";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import { GetViewOrderStatus, OrderType } from '../order/OrderType';

export const orderStatus = {
    prePayment: 1,
    didPayment: 2
}


class OrderStatusModel {
    @observable status = 0
    @observable statusMsg = 0
}

export const orderStatusModel = new OrderStatusModel()

class OrderDetailModel {

    @observable detail = {}
    @observable statusDic = [{}]
    @observable expList=[]
    @observable warehouseOrderDTOList=[]
    @observable unSendProductInfoList=[]
    @observable status=null
    @observable deleteInfo=false

    @observable menu = []
    @observable moreDetail = '';
    @observable sellerState = '';
    @observable buyState = '';

    @observable baseInfo = {};
    @observable merchantOrder = {};
    @observable payInfo = {};
    @observable receiveInfo = {};
    @observable merchantOrderNo = ''
    @observable platformOrderNo = ''

    productsList() {
        return this.merchantOrder.productOrderList || []
    }


    @action loadDetailInfo(merchantOrderNo) {
        this.merchantOrderNo = merchantOrderNo;
        this.deleteInfo=false
        return OrderApi.lookDetail({
            merchantOrderNo:merchantOrderNo
        }).then(rep => {
            this.handleData(rep.data || {})
        }).catch(err=>{
            if(err.code===47002){
                this.deleteInfo=true
            }else{
                orderDetailModel.netFailedInfo=err
                orderDetailModel.loadingState=PageLoadingState.fail
            }
            Toast.hiddenLoading();
            Toast.$toast(err.msg);
        })
    }
    @action handleData(data){
        //判空
        this.baseInfo = data.baseInfo || {}
        this.merchantOrder = data.merchantOrder || {}
        this.payInfo = data.payInfo || {}
        this.receiveInfo = data.receiveInfo || {}
        let {cancelTime, nowTime, receiveTime, cancelReason} = this.baseInfo
        orderDetailModel.loadingState=PageLoadingState.success
        this.platformOrderNo = this.merchantOrder.platformOrderNo || '';
        let menu =  [...GetViewOrderStatus(this.merchantOrder.status).menu_orderDetail];

        switch (this.merchantOrder.status) {
            case OrderType.WAIT_PAY:
            {
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '等待买家付款';
                if (cancelTime - nowTime > 0){
                    this.startTimer((cancelTime - nowTime)/1000);
                }
                break;
            }
            case OrderType.WAIT_DELIVER:
            {
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '买家已付款';
                break;
            }
            case OrderType.DELIVERED:
            {
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '平台已发货';
                if (receiveTime - nowTime > 0){
                    this.startTimer((receiveTime - nowTime)/1000);
                }
                break;
            }
            case OrderType.COMPLETED:
            {
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '订单完成';
                if (this.merchantOrder.commentStatus){
                    menu.push({
                        id: 10,
                        operation: '晒单',
                        isRed: true
                    })
                }
                break;
            }
            case OrderType.CLOSED:
            {
                this.moreDetail = cancelReason;
                this.sellerState = '';
                this.buyState = '交易关闭';
                break;
            }
            default:
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '';
                break;
        }
        this.menu = menu;
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
        remainingTime = parseInt(remainingTime)
        this.stopTimer();
        if (remainingTime === null || remainingTime === undefined) {
            return;
        }
        /** 当前的时间已经超出，不开启定时器*/
        this.moreDetail = this.getRemainingTime(remainingTime);
        this.timer = setInterval(() => {
            remainingTime--;
            this.moreDetail = this.getRemainingTime(remainingTime);
            if (this.moreDetail === '已超时') {
                this.stopTimer();
                this.loadDetailInfo(this.merchantOrderNo);
            } else {

            }
        }, 1000);
    }


}
export  const orderDetailModel = new OrderDetailModel();

class AssistDetailModel{
    @observable
    isShowShowMessageModal=false;
    @observable
    orderId=null;
    @observable
    cancelArr=[];

    @action
    setIsShowShowMessageModal(bool){
        this.isShowShowMessageModal = bool;
    }
    @action
    setOrderId(data){
        this.orderId = data;
    }
    @action
    getCancelArr(arr){
        this.cancelArr = arr;
    }
}
export const assistDetailModel = new AssistDetailModel();
