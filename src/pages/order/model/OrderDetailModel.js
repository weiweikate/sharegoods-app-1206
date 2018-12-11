import { observable, action, computed } from 'mobx'
import OrderApi from '../api/orderApi'
import StringUtils from "../../../utils/StringUtils";

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
    @observable expressList=[]
    @observable warehouseOrderDTOList=[]
    @observable status=null

    @action  getOrderNo(){
     return   this.status>1?this.warehouseOrderDTOList[0].warehouseOrderNo:this.warehouseOrderDTOList[0].platformOrderNo
    }


    @action  productsList() {
        let dataArr = []
        this.warehouseOrderDTOList.map((value) => {
            value.products.map((item)=>{
                dataArr.push({
                    productId: item.id,
                    uri: item.specImg,
                    goodsName: item.productName,
                    salePrice: StringUtils.isNoEmpty(item.payAmount) ? item.payAmount : 0,
                    category: item.specValues,
                    goodsNum: item.quantity,
                    // afterSaleService: this.getAfterSaleService(item, index),
                    // returnProductStatus: item.returnProductStatus,
                    // returnType: item.returnType,
                    status: item.status,
                    activityCode: item.activityCode,
                    orderProductNo:item.orderProductNo,
                    serviceNo:item.serviceNo,
                    afterSaleTime:item.afterSaleTime,
                    orderSubType:item.orderSubType,
                    prodCode:item.prodCode

                })
            })
        })
        console.log('dataArr',dataArr);
        return dataArr
    }


    @action loadDetailInfo(orderNo) {
        orderDetailAfterServiceModel.addAfterServiceList();
        return OrderApi.lookDetail({
            orderNo:orderNo
        }).then(rep => {
            this.detail = rep.data
            this.expressList = rep.data.warehouseOrderDTOList[0].expressList
            orderStatusModel.statusMsg = orderStatusMessage[rep.data.status]
            orderDetailModel.giftCouponDTOList=rep.data.giftCouponDTOList||[]
            orderDetailModel.orderSubType=rep.data.orderSubType
            this.warehouseOrderDTOList=rep.data.warehouseOrderDTOList
            orderDetailModel.receiverPhone=rep.data.receiverPhone
            orderDetailModel.receiver=rep.data.receiver
            orderDetailModel.tokenCoinAmount=rep.data.tokenCoinAmount
            orderDetailModel.platformOrderNo=rep.data.platformOrderNo
            orderDetailModel.source=rep.data.source
            orderDetailModel.channel=rep.data.channel
            orderDetailModel.quantity=rep.data.quantity
            orderDetailModel.province=rep.data.province
            orderDetailModel.street=rep.data.street
            orderDetailModel.city=rep.data.city
            orderDetailModel.area=rep.data.area
            orderDetailModel.address=rep.data.address
            this.status=rep.data.warehouseOrderDTOList[0].status
            orderDetailModel.payAmount=rep.data.payAmount

            return rep
        })
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
    totalAsList={};
    @observable
    menu=[]

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
            buyState:'订单已关闭',
            moreDetail:'',
            sellerState:'已关闭',
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
