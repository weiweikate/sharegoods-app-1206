import { observable, action, computed } from 'mobx'
import OrderApi from '../api/orderApi'
import StringUtils from '../../../utils/StringUtils';
import Toast from '../../../utils/bridge';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';

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

    @action  getOrderNo(){
     return   this.status > 1 ? this.warehouseOrderDTOList[0].warehouseOrderNo : this.warehouseOrderDTOList[0].platformOrderNo
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
                    orderCustomerServiceInfoDTO:item.orderCustomerServiceInfoDTO,
                    afterSaleTime:item.afterSaleTime,
                    orderSubType:item.orderSubType,
                    prodCode:item.prodCode

                })
            })
        })
        return dataArr
    }


    @action loadDetailInfo(orderNo) {
        this.deleteInfo = false
        orderDetailAfterServiceModel.addAfterServiceList();
        return OrderApi.lookDetail({
            orderNo:orderNo
        }).then(rep => {
            this.detail = rep.data
            this.expList = rep.data.warehouseOrderDTOList[0].expList || []
            this.unSendProductInfoList = rep.data.warehouseOrderDTOList[0].unSendProductInfoList || []
            orderStatusModel.statusMsg = orderStatusMessage[rep.data.status]
            orderDetailModel.giftCouponDTOList = rep.data.giftCouponDTOList || []
            orderDetailModel.orderSubType = rep.data.orderSubType
            this.warehouseOrderDTOList = rep.data.warehouseOrderDTOList
            orderDetailModel.receiverPhone = rep.data.receiverPhone
            orderDetailModel.receiver = rep.data.receiver
            orderDetailModel.tokenCoinAmount = rep.data.tokenCoinAmount
            orderDetailModel.platformOrderNo = rep.data.platformOrderNo
            orderDetailModel.source = rep.data.source
            orderDetailModel.channel = rep.data.channel
            orderDetailModel.quantity = rep.data.quantity
            orderDetailModel.province = rep.data.province
            orderDetailModel.street = rep.data.street
            orderDetailModel.city = rep.data.city
            orderDetailModel.area = rep.data.area
            orderDetailModel.address = rep.data.address
            this.status = rep.data.warehouseOrderDTOList[0].status
            orderDetailModel.payAmount = rep.data.payAmount
            // orderDetailModel.loading=false
            orderDetailModel.loadingState = PageLoadingState.success

            return rep
        }).catch(err=>{
                if(err.code === 47002){
                    this.deleteInfo = true
                }else{
                    orderDetailModel.netFailedInfo = err
                    orderDetailModel.loadingState = PageLoadingState.fail
                }
                // orderDetailModel.netFailedInfo=err
                // orderDetailModel.loadingState=PageLoadingState.fail
            Toast.hiddenLoading();
            Toast.$toast(err.msg);
            console.log(err);
        })
    }


    @computed
    get upDateOrderProductList(){
      let k =  this.warehouseOrderDTOList.length;
      console.log('upDateOrderProductList',k);
        // return this.orderProductList.length;
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
    isShowSingleSelctionModal=false;
    @observable
    isShowShowMessageModal=false;
    @observable
    orderId=null;
    @observable
    cancelArr=[];

    @action
    setIsShowSingleSelctionModal(bool){
        this.isShowSingleSelctionModal = bool
    }
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
