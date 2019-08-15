import { observable, action } from 'mobx'
import OrderApi from '../api/orderApi'
// import StringUtils from "../../../utils/StringUtils";
import Toast from "../../../utils/bridge";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import { checkOrderAfterSaleService, GetViewOrderStatus, OrderType } from '../order/OrderType';


class OrderDetailModel {
    @observable data = {};
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
    @observable isAllVirtual = true;
    @observable isPhoneOrder = false;
    @observable loadingState = PageLoadingState.loading

    productsList() {
        return this.merchantOrder.productOrderList || []
    }


    @action loadDetailInfo(merchantOrderNo) {
        this.merchantOrderNo = merchantOrderNo;
        this.deleteInfo=false
        return OrderApi.lookDetail({
            merchantOrderNo:merchantOrderNo
        }).then(rep => {
            this.data = rep.data;
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
    @action dataHandleConfirmOrder(){
        if (this.data&&this.data.merchantOrder) {
            this.data.merchantOrder.status = OrderType.COMPLETED;
            this.handleData({...this.data})
        }
    }
    @action handleData(data){
        this.stopTimer();
        //判空
        this.baseInfo = data.baseInfo || {}
        this.merchantOrder = data.merchantOrder || {}
        this.payInfo = data.payInfo || {}
        this.receiveInfo = data.receiveInfo || {}
        let {cancelTime, nowTime, receiveTime, cancelReason} = this.baseInfo
        orderDetailModel.loadingState=PageLoadingState.success
        this.platformOrderNo = this.merchantOrder.platformOrderNo || '';
        let menu =  [...GetViewOrderStatus(this.merchantOrder.status).menu_orderDetail];
        let hasAfterSaleService = checkOrderAfterSaleService(this.merchantOrder.productOrderList, this.merchantOrder.status, this.baseInfo.nowTime);
        let isAllVirtual = true;
        let isPhoneOrder = true;
        this.merchantOrder.productOrderList.forEach((item) => {
            if (item.orderType != 1){
                isAllVirtual = false;
            }

            if ((item.resource || {}).resourceType !== 'TELEPHONE_CHARGE'){
                isPhoneOrder = false;
            }
        });
        this.isPhoneOrder = isPhoneOrder;

        this.isAllVirtual = isAllVirtual;


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
                if (isPhoneOrder){
                    this.buyState = '等待发货';
                    this.moreDetail = '注:充值1个工作日未到账，订单金额会原路退回';
                }
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
                if (hasAfterSaleService){
                    let cancelIndex = -1;
                    menu.forEach((item, index) => {
                        if (item.operation === '删除订单') {
                            cancelIndex = index ;
                        }
                    })
                    if (cancelIndex !== -1) {
                        menu.splice(cancelIndex, 1);
                    }
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
        menu = menu.filter((item) => {
            if (!isAllVirtual) {
                return true;
            }
            if (item.operation === '查看物流' || item.operation === '确认收货') {
                return false;
            }

            if (isPhoneOrder && item.operation === '再次购买') {
                return false;
            }
            return true;
        });
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

        let time =  d + '天' + H + '小时' + m + '分' + s + '秒';
        if (d === 0){
            time =  H + '小时' + m + '分' + s + '秒';
            if (H === 0){
                time = m + '分' + s + '秒';
            }
        }
        if (this.merchantOrder.status ===  OrderType.WAIT_PAY){
            return '还剩'+ time + '时间自动关闭订单'
        }else {
            return '还剩'+ time + '时间自动确认收货'
        }

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
