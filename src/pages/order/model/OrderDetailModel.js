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

export const orderStatusMessage = {
    [orderStatus.prePayment] : '等待买家付款',
    [orderStatus.didPayment] : '买家已付款'
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
            this.handleData(rep)
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
    @action handleData(rep){
        //判空
        let data = rep.data || {};
        this.baseInfo = data.baseInfo || {}
        this.merchantOrder = data.merchantOrder || {}
        this.payInfo = data.payInfo || {}
        this.receiveInfo = data.receiveInfo || {}

        orderDetailModel.loadingState=PageLoadingState.success
        this.platformOrderNo = this.merchantOrder.platformOrderNo || '';
        let menu =  GetViewOrderStatus(this.merchantOrder.status).menu_orderDetail;
        switch (this.merchantOrder.status) {
            case OrderType.WAIT_PAY:
            {
                this.moreDetail = '';
                this.sellerState = '';
                this.buyState = '';
                break;
            }
            case OrderType.WAIT_DELIVER:
            {
                break;
            }
            case OrderType.DELIVERED:
            {

                break;
            }
            case OrderType.COMPLETED:
            {
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
