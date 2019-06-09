import { observable, action } from 'mobx'
import OrderApi from '../api/orderApi'
// import StringUtils from "../../../utils/StringUtils";
import Toast from "../../../utils/bridge";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import { OrderType } from '../order/OrderType';

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

    productsList() {
        return this.merchantOrder.productOrderList || []
    }


    @action loadDetailInfo(merchantOrderNo) {
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
        let menu = [];
        switch (this.merchantOrder.status) {
            case OrderType.WAIT_PAY:
            {
                menu = [{ id:1, operation:'取消订单', isRed:false, },
                       { id:2, operation:'去支付', isRed:true, }]
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



class OrderDetailAfterServiceModel{

    @observable
    AfterServiceList=[];
    @observable
    currentAsList=[];
    @observable
    buyState:'';
    @observable
    moreDetail:'';
    @observable
    sellerState:'';
    @observable
    totalAsList={};
    @observable
    menu=[]
    @observable
    sellerState=''

    @action
    addAfterServiceList=()=>{
        this.AfterServiceList = [ {

        }, {
            index:1,
            buyState:'等待买家付款',
            menu:[
                {
                    id:1,
                    operation:'取消订单',
                    isRed:false,
                },{
                    id:2,
                    operation:'去支付',
                    isRed:true,
                },
            ],
        }, {
            index:2,
            buyState:'买家已付款',
            moreDetail:'',
            sellerState:'订单正在处理中...',
            menu:[
                {
                    id:4,
                    operation:'订单退款',
                    isRed:false,
                }
            ],
        },{
            index:3,
            buyState:'卖家已发货',
            moreDetail:'',
            sellerState:'等待平台发货',
            menu:[
                {
                    id:5,
                    operation:'查看物流',
                    isRed:false,
                },{
                    id:6,
                    operation:'确认收货',
                    isRed:true,
                },
            ],
        },{
            index:4,
            buyState:'订单已完成',
            moreDetail:'',
            sellerState:'已签收',
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
            ],
        },{
            index:5,
            buyState:'交易关闭',
            moreDetail:'',
            sellerState:'已关闭',
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
            ],
        },]
    }

}
export const orderDetailAfterServiceModel = new OrderDetailAfterServiceModel();

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
