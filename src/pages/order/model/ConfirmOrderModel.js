import { observable, action } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import user from '../../../model/user';
import API from '../../../api';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from "../../shopCart/model/ShopCartCacheTool";

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
    canCommit = true;
    @observable
    loadingState = PageLoadingState.success;
    @observable
    giveUpCou = false;
    @observable
    couponCount=0;

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
        this.netFailedInfo = null;
        this.loadingState = PageLoadingState.success;
        this.canCommit = true;
        this.giveUpCou= false;
        this.couponCount=0;
    }

    @action makeSureProduct(orderParamVO, params = {}) {
        this.orderParamVO = orderParamVO;
        switch (orderParamVO.orderType) {
            case 99://普通商品
                OrderApi.makeSureOrder({
                    orderType: 1,//1.普通订单 2.活动订单  -- 下单必传
                    // orderSubType:  "",//1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: orderParamVO.source,//1.购物车 2.直接下单
                    systemVersion:310,
                     // couponsId:orderParamVO.source===4?(this.giveUpCou||params.userCouponCode?null:orderParamVO.couponsId):null,
                    couponsId: orderParamVO.couponsId,
                    // source: 4,//1.购物车 2.直接下单,4 周期券
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: orderParamVO.orderProducts,
                    ...params
                }).then(response => {
                    this.handleNetData(response.data);
                }).catch(err => {
                    this.disPoseErr(err, orderParamVO, params);
                });
                break;
            case 98:
                OrderApi.makeSureOrder({
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: 5,//1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: orderParamVO.source,//1.购物车 2.直接下单
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: orderParamVO.orderProducts,
                    ...params
                }).then(response => {
                    this.handleNetData(response.data);
                }).catch(err => {
                    this.disPoseErr(err, orderParamVO, params);
                });
                break;

            case 1:
                OrderApi.SeckillMakeSureOrder({
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
            case 2:
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
            case 3:
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
            default:
                break;

        }

    }

    disPoseErr = (err, orderParamVO, params) => {
        bridge.hiddenLoading();
        this.canCommit = true;
        if (err.code === 10009) {
            this.$navigate('login/login/LoginPage', {
                callback: () => {
                    setTimeout(() => {
                        this.makeSureProduct(orderParamVO, params);
                    }, 100);
                }
            });
        } else if (err.code === 10003 && err.msg.indexOf('不在限制的购买时间') !== -1) {
            this.netFailedInfo = null;
            this.loadingState = PageLoadingState.success;
            Alert.alert('提示', err.msg, [
                {
                    text: '确定', onPress: () => {
                        this.$navigateBack();
                    }
                }
            ]);
        } else if (err.code === 54001) {
            this.netFailedInfo = null;
            this.loadingState = PageLoadingState.success;
            bridge.$toast('商品库存不足！');
            this.$navigateBack();
        } else {
            this.netFailedInfo = err;
            this.loadingState = PageLoadingState.fail;
            bridge.$toastShow(err.msg);
        }
    };

    handleNetData = (data) => {
        bridge.hiddenLoading();
        this.canCommit = true;
        this.loadingState = PageLoadingState.success;
        this.orderProductList = data.orderProductList;
        this.addressData = data.userAddressDTO || data.userAddress || {};
        this.addressId = this.addressData.id;
        this.payAmount = data.payAmount;
        this.totalFreightFee = data.totalFreightFee ? data.totalFreightFee : 0;
        this.couponList = data.couponList ? data.couponList : null;
        this.couponCount=data.couponCount;
        this.orderProductList.map((item) => {
            if ((item.restrictions & 1) === 1) {
                this.canUseCou = true;
            }
        });
        if (this.canUseCou) {
            let arr = [];
            let params = {};
            if (this.orderParamVO.orderType == 99 || this.orderParamVO.orderType == 98) {
                this.orderParamVO.orderProducts.map((item, index) => {
                    arr.push({
                        priceCode: item.skuCode,
                        productCode: item.productCode,
                        amount: item.quantity || item.num
                    });
                });
                params = { productPriceIds: arr };
            } else if (this.orderParamVO.orderType == 1 || this.orderParamVO.orderType == 2 || this.orderParamVO.orderType == 3) {
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
                    activityType: this.orderParamVO.orderType
                };
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
        let baseParams = {
            message: this.message,
            tokenCoin: this.tokenCoin,
            userCouponCode: this.userCouponCode,
            addressId: this.addressId
        };
        switch (orderParamVO.orderType) {
            case 99:
                let paramsnor = {
                    ...baseParams,
                    orderProductList: orderParamVO.orderProducts,
                    // orderType: this.state.orderParam.orderType,
                    orderType: 1,
                    source:  orderParamVO.source,
                    channel: 2
                };
                OrderApi.submitOrder(paramsnor).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    this.canCommit = true;
                    shopCartCacheTool.getShopCartGoodsListData();
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderID: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddressDTO.receiver,
                        receiverProvince: data.userAddressDTO.province,
                        receiverCity: data.userAddressDTO.city,
                        receiverArea: data.userAddressDTO.area,
                        receiverAddress: data.userAddressDTO.address,
                        discountName: this.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.tokenCoin,
                        yiYuanCouponsAmount: this.tokenCoin,
                        storeCode: user.storeCode ? user.storeCode : ''
                    });
                }).catch(err => {
                    this.canCommit = true;
                    bridge.hiddenLoading();
                    this.disPoseErr(err, orderParamVO, {});
                });
                break;
            case 98:
                let paramsnor2 = {
                    ...baseParams,
                    orderProductList: orderParamVO.orderProducts,
                    orderSubType: 5,
                    orderType: 2,
                    source: orderParamVO.source,
                    channel: 2
                };
                OrderApi.submitOrder(paramsnor2).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    this.canCommit = true;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderID: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddressDTO.receiver,
                        receiverProvince: data.userAddressDTO.province,
                        receiverCity: data.userAddressDTO.city,
                        receiverArea: data.userAddressDTO.area,
                        receiverAddress: data.userAddressDTO.address,
                        discountName: this.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.tokenCoin,
                        yiYuanCouponsAmount: this.tokenCoin,
                        storeCode: user.storeCode ? user.storeCode : ''
                    });
                }).catch(err => {
                    this.canCommit = true;
                    bridge.hiddenLoading();
                    this.disPoseErr(err, orderParamVO, {});
                });
                break;
            case 1:
                let needParams = {
                    ...baseParams,
                    activityCode: orderParamVO.orderProducts[0].code,
                    channel: 2,
                    num: orderParamVO.orderProducts[0].num,
                    source: 2,
                    submitType: 2
                };
                OrderApi.SeckillSubmitOrder(needParams).then((response) => {
                    bridge.hiddenLoading();
                    let data = response.data;
                    this.canCommit = true;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderID: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.tokenCoin,
                        yiYuanCouponsAmount: this.tokenCoin,
                        storeCode: user.storeCode ? user.storeCode : ''
                    });
                }).catch(err => {
                    this.canCommit = true;
                    bridge.hiddenLoading();
                    this.disPoseErr(err, orderParamVO, {});
                });
                break;
            case 2:
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
                    this.canCommit = true;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderID: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.tokenCoin,
                        yiYuanCouponsAmount: this.tokenCoin,
                        storeCode: user.storeCode ? user.storeCode : ''
                    });
                }).catch(err => {
                    this.canCommit = true;
                    bridge.hiddenLoading();
                    this.disPoseErr(err, orderParamVO, {});
                });
                break;
            case 3:
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
                    this.canCommit = true;
                    callback(data);
                    shopCartCacheTool.getShopCartGoodsListData();
                    track(trackEvent.submitOrder, {
                        orderID: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.tokenCoin,
                        yiYuanCouponsAmount: this.tokenCoin,
                        storeCode: user.storeCode ? user.storeCode : ''
                    });
                }).catch(err => {
                    this.canCommit = true;
                    bridge.hiddenLoading();
                    this.disPoseErr(err, orderParamVO, {});
                });
                break;
            default:
                break;
        }
    }
}

export const confirmOrderModel = new ConfirmOrderModel();
