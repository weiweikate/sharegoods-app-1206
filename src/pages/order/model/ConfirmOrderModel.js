import { observable, action, } from 'mobx'
import OrderApi from '../api/orderApi'
import StringUtils from "../../../utils/StringUtils";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import bridge from "../../../utils/bridge";
import user from '../../../model/user'
import API from '../../../api';
import { track, trackEvent } from "../../../utils/SensorsTrack";
// import RouterMap, { navigate } from "../../../navigation/RouterMap";

 class ConfirmOrderModel {
    @observable
    orderProductList=[]
    @observable
    payAmount='0'
    @observable
    totalFreightFee='0'
    @observable
    userAddressDTO=null
    @observable
    orderNo=null
    @observable
    tokenCoin=0
    @observable
    addressData={}
    @observable
    userCouponCode=null
    @observable
    tokenCoinText=null
    @observable
    couponName= null
    @observable
    canUseCou=false
    @observable
    couponList=[]
    @observable
    message=""
    @observable
    addressId=null
    @observable
    orderParamVO={}
    @observable
    isError=false

   @action clearData(){
       this.orderProductList=[]
       this.payAmount='0'
       this.totalFreightFee='0'
       this.userAddressDTO=null
       this.orderNo=null
       this.tokenCoin=0
       this.addressData={}
       this.userCouponCode=null
       this.tokenCoinText=null
       this.couponName= null
       this.canUseCou=false
       this.couponList=[]
       this.message=""
       this.addressId=null
       this.orderParamVO={}
       this.netFailedInfo = null;
       this.loadingState = PageLoadingState.loading;
   }

  @action  makeSureProduct(orderParamVO,params={}){
        this.orderParamVO=orderParamVO;
        switch(orderParamVO.orderType){
            case 99:
             return   OrderApi.makeSureOrder({
                    orderType: 1,//1.普通订单 2.活动订单  -- 下单必传
                    //orderSubType:  1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source:orderParamVO.source,//1.购物车 2.直接下单
                    channel:2,//1.小程序 2.APP 3.H5
                    orderProductList: orderParamVO.orderProducts,
                    ...params
                }).then(response => {
                    // bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    // bridge.hiddenLoading();
                  let error  = this.disPoseErr(err);
                  throw error
                });
                break;
            case 1:
             return   OrderApi.SeckillMakeSureOrder({
                    activityCode:orderParamVO.orderProducts[0].code,
                    channel:2,
                    num:orderParamVO.orderProducts[0].num,
                    source:2,
                    submitType:1,
                    ...params
                }).then(response => {
                    // bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    // bridge.hiddenLoading();
                  throw this.disPoseErr(err)
                });
                break;
            case 2:
             return   OrderApi.DepreciateMakeSureOrder({
                    activityCode:orderParamVO.orderProducts[0].code,
                    channel:2,
                    num:orderParamVO.orderProducts[0].num,
                    source:2,
                    submitType:1,
                    ...params
                }).then(response => {
                    // bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    // bridge.hiddenLoading();
                   throw this.disPoseErr(err)
                });
                break;
            case 3:
              return  OrderApi.PackageMakeSureOrder({
                    activityCode:orderParamVO.activityCode,
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: orderParamVO.orderSubType ,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source:2,//1.购物车 2.直接下单
                    channel:2,//1.小程序 2.APP 3.H5
                    orderProductList:orderParamVO.orderProducts,
                    submitType:1,
                    quantity:1,
                    ...params
                }).then(
                    response => {
                        // bridge.hiddenLoading();
                    return    this.handleNetData(response.data);
                    }
                ).catch(err => {
                    // bridge.hiddenLoading();
                   throw  this.disPoseErr(err)
                });
                break;

        }

  }

    disPoseErr=(err)=>{
          this.isError=true;
        if((err.code === 10003 && err.msg.indexOf("不在限制的购买时间") !== -1)||err.code === 54001){
            // navigate(RouterMap.LoginPage)
            this.loading=false
            this.netFailedInfo=null
            this.loadingState=PageLoadingState.success
        }else{
            this.loading=false
            this.netFailedInfo=err
            this.loadingState=PageLoadingState.fail
        }

        return err;

    }
    handleNetData = (data) => {
        this.isError=false
        this.loading=false
        this.loadingState=PageLoadingState.success
        this.orderProductList=data.orderProductList;
        this.addressData = data.userAddressDTO || data.userAddress || {}
        this.addressId=this.addressData.id
        this.payAmount = data.payAmount;
        this.totalFreightFee = data.totalFreightFee ? data.totalFreightFee : 0;
        this.couponList = data.couponList ? data.couponList : null;
        this.orderProductList.map((item)=>{
            if(item.restrictions & 1 === 1){
                this.canUseCou=true
            }
        });
        if(this.canUseCou){
            let arr=[];
            if(this.orderParamVO.orderType==99){
                this.orderParamVO.orderProducts.map((item, index) => {
                    arr.push({
                        priceCode: item.skuCode,
                        productCode: item.productCode,
                        amount: item.quantity||item.num
                    });
                });
                let params={productPriceIds: arr}
                API.listAvailable({ page: 1, pageSize: 20, ...params }).then(resp => {
                    let data = resp.data || {};
                    let dataList = data.data || [];
                    if (dataList.length === 0) {
                        this.couponName='暂无优惠券'
                    }
                }).catch(result => {
                    console.log(result)
                });
            }
        }

        return data;
    };

    @action submitProduct(orderParamVO){
        let baseParams = {
            message: this.message,
            tokenCoin: this.tokenCoin,
            userCouponCode: this.userCouponCode,
            addressId: this.addressId
        };
        if (StringUtils.isEmpty(this.addressId)) {
            bridge.$toast('请先添加地址');
            return;
        }
        if(orderParamVO.type<3){
            baseParams = {
                ...baseParams,
                activityCode: orderParamVO.orderProducts[0].code,
                channel: 2,
                num: orderParamVO.orderProducts[0].num,
                source: 2,
                submitType: 2,
            };
        }
        switch(orderParamVO.orderType){
            case 99:
                let paramsnor = {
                    ...baseParams,
                    orderProductList: orderParamVO.orderProducts,
                    // orderType: this.state.orderParam.orderType,
                    orderType:1,
                    source:orderParamVO.source,
                    channel:2,
                };
              return    OrderApi.submitOrder(paramsnor).then((response) => {
                    bridge.hiddenLoading();
                  let data = response.data;
                    track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddressDTO.receiver,
                        receiverProvince:data.userAddressDTO.province,receiverCity:data.userAddressDTO.city,receiverArea:data.userAddressDTO.area,receiverAddress:data.userAddressDTO.address,
                        discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                        yiYuanDiscountAmount:this.tokenCoin,storeCode:user.storeCode?user.storeCode:''})
                     this.isError=false
                    return response.data;
                }).catch(err => {
                    bridge.hiddenLoading();
                  throw this.disPoseErr(err)
                });
                break;
            case 1:
               return  OrderApi.SeckillSubmitOrder(baseParams).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                        receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                        discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                        yiYuanDiscountAmount:this.tokenCoin,storeCode:user.storeCode?user.storeCode:''})
                    this.isError=false
                     return data;
                }).catch(err => {
                    bridge.hiddenLoading();
                throw this.disPoseErr(err);
                });
                break;
            case 2:
              return  OrderApi.DepreciateSubmitOrder(baseParams).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                        receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                        discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                        yiYuanDiscountAmount:this.tokenCoin,storeCode:user.storeCode?user.storeCode:''})
                   this.isError=false
                    return data;
                }).catch(err => {
                    bridge.hiddenLoading();
               throw this.disPoseErr(err)
                });
                break;
            case 3:
                let params = {
                    ...baseParams,
                    activityCode:orderParamVO.activityCode,
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: orderParamVO.orderSubType ,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source:2,//1.购物车 2.直接下单
                    channel:2,//1.小程序 2.APP 3.H5
                    orderProductList:orderParamVO.orderProducts,
                    submitType:2,
                    quantity:1,
                };
              return  OrderApi.PackageSubmitOrder(params).then((response) => {
                    bridge.hiddenLoading()
                    let data = response.data;
                        track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                            receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                            discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                            yiYuanDiscountAmount:this.tokenCoin,storeCode:user.storeCode?user.storeCode:''})
                    this.isError=false
                    return data;
                }).catch(err => {
                   bridge.hiddenLoading();
                 throw this.disPoseErr(err)
                });
                break;

        }
    }


}
export  const confirmOrderModel = new ConfirmOrderModel();
