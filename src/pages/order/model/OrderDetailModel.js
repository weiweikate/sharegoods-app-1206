import { observable, action, computed } from 'mobx'
import OrderApi from '../api/orderApi'

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
    @observable statusDic = [{

    }]
    @action loadDetailInfo(orderId, id, status, orderNum) {
        OrderApi.lookDetail({
            id: orderId,
            userId: id,
            status: status,
            orderNum:orderNum
        }).then(rep => {
            this.detail = rep.data
            orderStatusModel.status = rep.data.status
            orderStatusModel.statusMsg = orderStatusMessage[rep.data.status]
        })
    }

    @observable
    address = '';
    @observable
    adminRemark = null;
    @observable
    adminStars = null;
    @observable
    area = '';
    @observable
    areaCode = '';
    @observable
    autoReceiveTime = null;
    @observable
    buyerRemark = '';
    @observable
    cancelTime = null;
    @observable
    city = '';
    @observable
    cityCode = '';
    @observable
    cloudHadSend = null;
    @observable
    couponId = null;
    @observable
    couponPrice = null;
    @observable
    createTime = null;
    @observable
    dealerName = null;
    @observable
    deliverTime = null;
    @observable
    expressName = null;
    @observable
    expressNo = null;
    @observable
    finishTime = null;
    @observable
    freightPrice = '';
    @observable
    hadSquareUp = null;
    @observable
    hasReturnGoods = null;
    @observable
    id = null;
    @observable
    needPrice = '';
    @observable
    orderNum = '';
    @observable
    orderPayRecord = null;
    @observable
    orderType = null;
    @observable
    outTradeNo = null;
    @observable
    payTime = null;
    @observable
    pickedUp = null;
    @observable
    pickupAddressId = null;
    @observable
    platformPayTime = null;
    @observable
    province = '';
    @observable
    provinceCode = '';
    @observable
    receiver = '';
    @observable
    recevicePhone = '';
    @observable
    scorePrice = null;
    @observable
    sendTime = null;
    @observable
    shutOffTime = null;
    @observable
    status = null;
    @observable
    storeId = null;
    @observable
    tokenCoin = null;
    @observable
    totalGroupPrice = '';
    @observable
    totalOrderPrice = '';
    @observable
    totalPrice = null;
    @observable
    totalProductPrice = '';
    @observable
    totalSettlementPrice = '';
    @observable
    totalUserScore = null;
    @observable
    userHide = null;
    @observable
    userId = null;
    @observable
    userScoreToBalance = null;
    @observable
    orderProductList = [];

    @action
    saveOrderDetailInfo(data){
        this.address = data.address;
        this.adminRemark = data.adminRemark;
        this.adminStars = data.adminStars;
        this.area = data.area;
        this.areaCode = data.areaCode;
        this.autoReceiveTime = data.autoReceiveTime;
        this.buyerRemark = data.buyerRemark;
        this.cancelTime = data.cancelTime;
        this.city = data.city;
        this.cityCode = data.cityCode;
        this.cloudHadSend = data.cloudHadSend;
        this.couponId = data.couponId;
        this.couponPrice = data.couponPrice;
        this.createTime = data.createTime;
        this.dealerName = data.dealerName;
        this.deliverTime = data.deliverTime;
        this.expressName = data.expressName;
        this.expressNo = data.expressNo;
        this.finishTime = data.finishTime;
        this.freightPrice = data.freightPrice;
        this.hadSquareUp = data.hadSquareUp;
        this.hasReturnGoods = data.hasReturnGoods;
        this.id = data.id;
        this.needPrice = data.needPrice;
        this.orderNum = data.orderNum;
        this.orderPayRecord = data.orderPayRecord;
        this.orderType = data.orderType;
        this.outTradeNo = data.outTradeNo;
        this.payTime = data.payTime;
        this.pickedUp = data.pickedUp;
        this.pickupAddressId = data.pickupAddressId;
        this.platformPayTime = data.platformPayTime;
        this.province = data.province;
        this.provinceCode = data.provinceCode;
        this.receiver = data.receiver;
        this.recevicePhone = data.recevicePhone;
        this.scorePrice = data.scorePrice;
        this.sendTime = data.sendTime;
        this.shutOffTime = data.shutOffTime;
        this.status = data.status;
        this.storeId = data.storeId;
        this.tokenCoin = data.tokenCoin;
        this.totalGroupPrice = data.totalGroupPrice;
        this.totalOrderPrice = data.totalOrderPrice;
        this.totalPrice = data.totalPrice;
        this.totalProductPrice = data.totalProductPrice;
        this. totalSettlementPrice = data.totalSettlementPrice;
        this.totalUserScore = data.totalUserScore;
        this.userHide = data.userHide;
        this.userId = data.userId;
        this.userScoreToBalance = data.userScoreToBalance;
        this.orderProductList = data.orderProductList;
        orderDetailAfterServiceModel.addAfterServiceList();
    }
    @action
    clearOrderDetailInfo(){
        this.address = '';
        this.adminRemark = null;
        this.adminStars = null;
        this.area = '';
        this.areaCode = '';
        this.autoReceiveTime = null;
        this.buyerRemark = '';
        this.cancelTime = null;
        this.city = '';
        this.cityCode = '';
        this.cloudHadSend = null;
        this.couponId = null;
        this.couponPrice = null;
        this.createTime = null;
        this.dealerName = null;
        this.deliverTime = null;
        this.expressName = null;
        this.expressNo = null;
        this.finishTime = null;
        this.freightPrice = '';
        this.hadSquareUp = null;
        this.hasReturnGoods = null;
        this.id = null;
        this.needPrice = '';
        this.orderNum = '';
        this.orderPayRecord = null;
        this.orderType = null;
        this.outTradeNo = null;
        this.payTime = null;
        this.pickedUp = null;
        this.pickupAddressId = null;
        this.platformPayTime = null;
        this.province = '';
        this.provinceCode = '';
        this.receiver = '';
        this.recevicePhone = '';
        this.scorePrice = null;
        this.sendTime = null;
        this.shutOffTime = null;
        this.status = null;
        this.storeId = null;
        this.tokenCoin = null;
        this.totalGroupPrice = '';
        this.totalOrderPrice = '';
        this.totalPrice = null;
        this.totalProductPrice = '';
        this. totalSettlementPrice = '';
        this.totalUserScore = null;
        this.userHide = null;
        this.userId = null;
        this.userScoreToBalance = null;
        this.orderProductList = [];
    }

    @computed
    get upDateOrderProductList(){
        return this.orderProductList.length;
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
    sellerTime:'';
    @observable
    totalAsList=null;


    @action
    addAfterServiceList=()=>{
        this.AfterServiceList=[ {

        }, {
            index:1,
            buyState:'等待买家付款',
            disNextView:false,
            menu:[
                {
                    id:1,
                    operation:'取消订单',
                    isRed:false,
                },{
                    id:2,
                    operation:'去支付',
                    isRed:true,
                },{
                    id:3,
                    operation:'继续支付',
                    isRed:true,
                },
            ],
        }, {
            index:2,
            buyState:'买家已付款',
            moreDetail:'',
            sellerState:'等待卖家发货...',
            sellerTime:'',
            disNextView:true,
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
            // moreDetail:'06天18:24:45后自动确认收货',
            sellerState:'仓库正在扫描出库...',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
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
            sellerTime:'',
            disNextView:true,
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
            buyState:'订单已完成',
            moreDetail:'',
            sellerState:'已签收',
            disNextView:true,
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
            index:6,
            buyState:'已完成',
            moreDetail:'',
            sellerState:'已关闭',
            disNextView:true,
            menu:[
                {
                    id:9,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:7,
            buyState:'交易关闭',
            moreDetail:'',
            sellerState:'已关闭',
            disNextView:true,
            menu:[
                {
                    id:9,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:8,
            buyState:'交易关闭',
            moreDetail:'',
            disNextView:true,
            menu:[
                {
                    id:9,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },]
    }

}
export const orderDetailAfterServiceModel =new OrderDetailAfterServiceModel();

class AssistDetailModel{
    @observable
    isShowSingleSelctionModal=false;
    @observable
    isShowShowMessageModal=false;
    @observable
    orderId=null;
    @observable
    cancelArr=[];

    @action
    setIsShowSingleSelctionModal(bool){
        this.isShowSingleSelctionModal=bool
    }
    @action
    setIsShowShowMessageModal(bool){
        this.isShowShowMessageModal=bool;
    }
    @action
    setOrderId(data){
        this.orderId=data;
    }
    @action
    getCancelArr(arr){
        this.cancelArr=arr;
    }
}
export const assistDetailModel=new AssistDetailModel();
