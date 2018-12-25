import { observable, action, } from 'mobx'
import OrderApi from '../api/orderApi'
import StringUtils from "../../../utils/StringUtils";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import bridge from "../../../utils/bridge";
import API from '../../../api';
import { track, trackEvent } from "../../../utils/SensorsTrack";

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
                    bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    bridge.hiddenLoading();
                  return  this.disPoseErr(err);
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
                    bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    bridge.hiddenLoading();
                  return  this.disPoseErr(err)
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
                    bridge.hiddenLoading();
                 return   this.handleNetData(response.data);
                }).catch(err => {
                    bridge.hiddenLoading();
                   return this.disPoseErr(err)
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
                        bridge.hiddenLoading();
                    return    this.handleNetData(response.data);
                    }
                ).catch(err => {
                    bridge.hiddenLoading();
                   return  this.disPoseErr(err)
                });
                break;

        }

  }

    disPoseErr=(err)=>{
        confirmOrderModel.loading=false
        confirmOrderModel.netFailedInfo=err
        confirmOrderModel.loadingState=PageLoadingState.fail
        return err;
        // if (err.code === 10009) {
        //     this.$navigate('login/login/LoginPage', {
        //         callback: () => {
        //             this.loadPageData();
        //         }
        //     });
        // } else if (err.code === 10003 && err.msg.indexOf('不在限制的购买时间') !== -1) {
        //     Alert.alert('提示', err.msg, [
        //         {
        //             text: '确定', onPress: () => {
        //                 this.$navigateBack();
        //             }
        //         }
        //         // { text: '否' }
        //     ]);
        // } else if (err.code === 54001) {
        //     bridge.$toast('商品库存不足！');
        //     this.$navigateBack();
        // }
        // else {
        //     this.$toastShow(err.msg);
        // }
    }
    handleNetData = (data) => {
        confirmOrderModel.loading=false
        confirmOrderModel.loadingState=PageLoadingState.success
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
                        YiyuanDiscountAmount:this.tokenCoin})
                     // this.replaceRouteName(data);
                    return response.data;
                }).catch(err => {
                    bridge.hiddenLoading();
                  // this.disPoseErr(err)
                });
                break;
            case 1:
               return  OrderApi.SeckillSubmitOrder(baseParams).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                        receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                        discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                        YiyuanDiscountAmount:this.tokenCoin})
                    // this.replaceRouteName(data);
                     return data;
                }).catch(err => {
                    bridge.hiddenLoading();
                // this.disPoseErr(err);
                });
                break;
            case 2:
                OrderApi.DepreciateSubmitOrder(baseParams).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                        receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                        discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                        YiyuanDiscountAmount:this.tokenCoin})
                    // this.replaceRouteName(data);
                    return data;
                }).catch(err => {
                    bridge.hiddenLoading();
               // this.disPoseErr(err)
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
                OrderApi.PackageSubmitOrder(params).then((response) => {
                    bridge.hiddenLoading()
                    let data = response.data;
                        track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
                            receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
                            discountName:this.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.tokenCoin,numberOfYiYuan:this.tokenCoin,
                            YiyuanDiscountAmount:this.tokenCoin})
                    // this.replaceRouteName(data);
                    return data;
                }).catch(err => {
                   bridge.hiddenLoading();
                 // this.disPoseErr(err)
                });
                break;

        }
    }

    // replaceRouteName(data) {
    //     // this.$navigate('payment/PaymentMethodPage',
    //     //     {
    //     //         orderNum: data.orderNo,
    //     //         amounts: data.payAmount,
    //     //         pageType: 0,
    //     //        }
    //     // )
    //     let replace = NavigationActions.replace({
    //         key: this.props.navigation.state.key,
    //         routeName: 'payment/PaymentMethodPage',
    //         params: {
    //             orderNum: data.orderNo,
    //             amounts: data.payAmount,
    //             pageType: 0,
    //         }
    //     });
    //     this.props.navigation.dispatch(replace);
    // }


}
export  const confirmOrderModel = new ConfirmOrderModel();
