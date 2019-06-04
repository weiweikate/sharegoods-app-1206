import { observable, action } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import API from '../../../api';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from "../../shopCart/model/ShopCartCacheTool";
import { navigateBack } from "../../../navigation/RouterMap";
import { OrderType } from '../../../utils/EnumUtil';

class ConfirmOrderModel {
    @observable
    orderProductList = [];
    @observable
    payAmount = '0';
    @observable
    totalFreightFee = '0';
    @observable
    userAddressDTO = null;
    @observable
    orderNo = null;
    @observable
    tokenCoin = 0;
    @observable
    addressData = {};
    @observable
    userCouponCode = null;
    @observable
    tokenCoinText = null;
    @observable
    couponName = null;
    @observable
    canUseCou = false;
    @observable
    couponList = [];
    @observable
    message = '';
    @observable
    addressId = null;
    @observable
    orderParamVO = {};
    @observable
    loadingState = PageLoadingState.success;
    @observable
    giveUpCou = false;
    @observable
    couponCount=0;
    @observable
    couponData={}
    @observable
    err=null
    @observable
    allProductPrice = 0;
    @observable
    promotionAmount
    @observable
    couponAmount

    @action clearData() {
        this.orderProductList = [];
        this.payAmount = '0';
        this.totalFreightFee = '0';
        this.userAddressDTO = null;
        this.orderNo = null;
        this.tokenCoin = 0;
        this.addressData = {};
        this.userCouponCode = null;
        this.tokenCoinText = null;
        this.couponName = null;
        this.canUseCou = false;
        this.couponList = [];
        this.message = '';
        this.addressId = null;
        this.orderParamVO = {};
        this.giveUpCou= false;
        this.couponCount=0;
        this.couponData={};
        this.err=null;
        this.allProductPrice = 0;
        this.couponAmount=0
        this.promotionAmount='';
    }

    @action makeSureProduct(orderParamVO, params = {}) {
        this.orderParamVO = orderParamVO;
        this.err=null;
        switch (orderParamVO.orderType) {
            case OrderType.depreciate_old:// 2.降价拍
                return OrderApi.DepreciateMakeSureOrder({
                    activityCode: orderParamVO.orderProducts[0].code,
                    channel: 2,
                    num: orderParamVO.orderProducts[0].num,
                    source: 2,
                    submitType: 1,
                    ...params
                }).then(response => {
                    this.handleNetData(response.data);
                }).catch(err => {
                    this.disPoseErr(err, orderParamVO, params);
                });
                break;
            case OrderType.gift://礼包
                return OrderApi.PackageMakeSureOrder({
                    activityCode: orderParamVO.activityCode,
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: orderParamVO.orderSubType,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: 2,//1.购物车 2.直接下单
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: orderParamVO.orderProducts,
                    submitType: 1,
                    quantity: 1,
                    ...params
                }).then(
                    response => {
                        this.handleNetData(response.data);
                    }
                ).catch(err => {
                    this.disPoseErr(err, orderParamVO, params);
                });
                break;
            default://其他
                OrderApi.makeSureOrder({
                    couponInfo:{ //券信息
                        couponCodes:[this.userCouponCode], //List<string> 本次下单使用的优惠券code
                        tokenCoin: params.tokenCoin//BigDecimal 一元券抵扣金额
                    },
                    receiveInfo:{
                        id: params.addressId //int 收货地址ID
                    },
                    productList: orderParamVO.orderProducts,
                    invokeInfo: { //接口请求信息
                        source: orderParamVO.source,  //int 订单来源: 1.购物车 2.直接下单
                        channel:  2//int 渠道来源: 1.小程序 2.APP 3.H5
                    },
                    ext:{ //扩展信息
                        userMessage: this.message// string 买家留言
                    }
                }).then(response => {
                    this.handleNetData(response.data);
                }).catch(err => {
                    this.disPoseErr(err, orderParamVO, params);
                });
                break;

        }

    }

    disPoseErr = (err, orderParamVO, params) => {
        bridge.hiddenLoading();
        this.err=err;
        if (err.code === 10003 && err.msg.indexOf('不在限制的购买时间') !== -1) {
            Alert.alert('提示', err.msg, [
                {
                    text: '确定', onPress: () => {
                        navigateBack()
                    }
                }
            ]);
        } else if (err.code === 54001) {
            bridge.$toast('商品库存不足！');
          // navigateBack()
        } else {
            bridge.$toast(err.msg);
            // navigateBack()
        }
    };

    handleNetData = (data) => {
        this.err=null;
        bridge.hiddenLoading();
        this.loadingState = PageLoadingState.success;
        this.orderProductList = data.orderProductList;
        this.addressData = data.userAddressDTO || data.userAddress || {};
        this.addressId = this.addressData.id;
        this.payAmount = data.payAmount;
        this.totalFreightFee = data.totalFreightFee ? data.totalFreightFee : 0;
        this.couponList = data.couponList ? data.couponList : null;
        this.couponCount=data.couponCount;
        this.allProductPrice = data.totalAmount;
        this.promotionAmount = data.promotionAmount;
        this.couponAmount = data.couponAmount;
        this.orderProductList.map((item) => {
            if ((item.restrictions & 1) === 1) {
                this.canUseCou = true;
            }
        });
        if (this.canUseCou) {
            let arr = [];
            let params = {};
            //老的降价拍礼包走
           if ( this.orderParamVO.orderType === OrderType.depreciate_old || this.orderParamVO.orderType === OrderType.gift) {
                this.orderParamVO.orderProducts.map((item, index) => {
                    arr.push({
                        priceCode: item.skuCode,
                        productCode: item.productCode || item.prodCode,
                        amount: 1
                    });
                });
                params = {
                    productPriceIds: arr,
                    activityCode: this.orderParamVO.activityCode,
                    activityType: this.orderParamVO.orderType === OrderType.gift ? this.orderParamVO.orderSubType :  this.orderParamVO.orderType
                };
            } else{//其他
                this.orderParamVO.orderProducts.map((item, index) => {

                    let {quantity, num , skuCode, productCode, activityCode, batchNo} = item
                    let  amount = quantity || num;
                    arr.push({
                        priceCode: skuCode,
                        productCode: productCode,
                        amount: amount,
                        activityCode: activityCode,
                        batchNo
                    });
                });

                params = { productPriceIds: arr };
                //orderType1：秒杀，2：降价拍，3（，orderSubType 3升级礼包 4普通礼包）
            }
            API.listAvailable({ page: 1, pageSize: 20, ...params }).then(resp => {
                let data = resp.data || {};
                let dataList = data.data || [];
                if (dataList.length === 0) {
                    this.couponName = '暂无优惠券';
                }
            }).catch(result => {
                console.log(result);
            });
        }
        return data;
    };

    @action submitProduct(orderParamVO, { callback }) {
        if (StringUtils.isEmpty(this.addressId)) {
            bridge.$toast('请先添加地址');
            bridge.hiddenLoading();
            return;
        }
        if(!StringUtils.isEmpty(this.err)){
            bridge.hiddenLoading();
            return;
        }
        let baseParams = {
            message: this.message,
            tokenCoin: this.tokenCoin,
            userCouponCode: this.userCouponCode,
            addressId: this.addressId,
        };
        switch (orderParamVO.orderType) {
            case OrderType.depreciate_old:
                let needParams2 = {
                    ...baseParams,
                    activityCode: orderParamVO.orderProducts[0].code,
                    channel: 2,
                    num: orderParamVO.orderProducts[0].num,
                    source: 2,
                    submitType: 2
                };
                OrderApi.DepreciateSubmitOrder(needParams2).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderSubmitPage: 1
                    });
                }).catch(err => {
                    bridge.hiddenLoading();
                    bridge.$toast(err.msg);
                });
                break;
            case OrderType.gift:
                let params = {
                    ...baseParams,
                    activityCode: orderParamVO.activityCode,
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: orderParamVO.orderSubType,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: 2,//1.购物车 2.直接下单
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: orderParamVO.orderProducts,
                    submitType: 2,
                    quantity: 1
                };
                OrderApi.PackageSubmitOrder(params).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderSubmitPage: 1
                    });
                }).catch(err => {
                    bridge.hiddenLoading();
                    bridge.$toast(err.msg);
                });
                break;
            default://其他走正常下单接口
                let paramsnor = {
                    ...baseParams,
                    orderProductList: orderParamVO.orderProducts,
                    // orderType: this.state.orderParam.orderType,
                    orderType: 1,
                    source:  orderParamVO.source,
                    channel: 2,
                    sgAppVersion:310,
                    couponsId: orderParamVO.couponsId,
                };
                OrderApi.submitOrder(paramsnor).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    shopCartCacheTool.getShopCartGoodsListData();
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderSubmitPage:orderParamVO.source==1?11:1
                    });
                }).catch(err => {
                    bridge.hiddenLoading();
                    bridge.$toast(err.msg);
                });
                break;

        }
    }
}

export const confirmOrderModel = new ConfirmOrderModel();
