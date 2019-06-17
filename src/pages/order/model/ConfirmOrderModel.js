import { observable, action } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from "../../shopCart/model/ShopCartCacheTool";
import { navigateBack } from "../../../navigation/RouterMap";

class ConfirmOrderModel {

    @observable
    loadingState = PageLoadingState.success;
    @observable
    err=null
    @observable
    canUseCou = true;

    addressId =  '';
    orderParamVO = {};
    tokenCoin = 0
    userCouponCode = '';
    @observable
    message = '';

    @observable
    platformOrderNo = ''
    @observable
    productOrderList = []
    @observable
    failProductList = []
    @observable
    payInfo = {}
    @observable
    receiveInfo = {}

    @action clearData() {
        this.loadingState = PageLoadingState.success;
        this.err=null;
        this.canUseCou = false;

        this.addressId = null;
        this.message = '';
        this.tokenCoin = 0;
        this.orderParamVO = {};
        this.userCouponCode = null;

        this.platformOrderNo = null;
        this.productOrderList = [];
        this.failProductList = []
        this.payInfo = {};
        this.receiveInfo = {};

    }

    @action
    selectAddressId(addressId){
        this.addressId = addressId;
        this.tokenCoin = 0;
        this.makeSureProduct()
    }

    @action
    selecttokenCoin(num){
        this.tokenCoin = num;
        this.makeSureProduct()
    }
    @action
    selectUserCoupon(userCouponCode){
        this.tokenCoin = 0;
        this.userCouponCode = userCouponCode;
        this.makeSureProduct();
    }

    getParams(){
        return {
            couponInfo: { //券信息
                couponCodes: [this.userCouponCode], //List<string> 本次下单使用的优惠券code
                tokenCoin: this.tokenCoin//BigDecimal 一元券抵扣金额
            },
            receiveInfo: {
                id: this.addressId //int 收货地址ID
            },
            productList: this.orderParamVO.orderProducts,
            invokeInfo: { //接口请求信息
                source: this.orderParamVO.source,  //int 订单来源: 1.购物车 2.直接下单
                channel: 2//int 渠道来源: 1.小程序 2.APP 3.H5
            },
            ext: { //扩展信息
                userMessage: this.message// string 买家留言
            }
        }
    }

    @action makeSureProduct() {
        bridge.showLoading();
        OrderApi.makeSureOrder(this.getParams()).then(response => {
            bridge.hiddenLoading();
            this.err=null;
            this.loadingState = PageLoadingState.success;
            this.handleNetData(response.data || {});
        }).catch(err => {
            bridge.hiddenLoading();
            this.err=err;
            this.disPoseErr(err);
        });
    }


    disPoseErr = (err) => {
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
        } else {
            bridge.$toast(err.msg);
        }
    };

    handleNetData = (data) => {
        this.platformOrderNo = data.platformOrderNo || '';
        this.productOrderList = data.productOrderList || [];
        this.failProductList = data.failProductList || '';
        this.payInfo = data.payInfo || {};
        this.receiveInfo = data.receiveInfo || {};
        this.addressId =  this.receiveInfo.id;
        this.tokenCoin =  this.payInfo.tokenCoinAmount;
        // this.orderProductList.map((item) => {
        //     if ((item.restrictions & 1) === 1) {
        //         this.canUseCou = true;
        //     }
        // });
        // if (this.canUseCou) {
        //     let arr = [];
        //     let params = {};
        //     //老的降价拍礼包走
        //    if ( this.orderParamVO.orderType === OrderType.depreciate_old || this.orderParamVO.orderType === OrderType.gift) {
        //         this.orderParamVO.orderProducts.map((item, index) => {
        //             arr.push({
        //                 priceCode: item.skuCode,
        //                 productCode: item.productCode || item.prodCode,
        //                 amount: 1
        //             });
        //         });
        //         params = {
        //             productPriceIds: arr,
        //             activityCode: this.orderParamVO.activityCode,
        //             activityType: this.orderParamVO.orderType === OrderType.gift ? this.orderParamVO.orderSubType :  this.orderParamVO.orderType
        //         };
        //     } else{//其他
        //         this.orderParamVO.orderProducts.map((item, index) => {
        //
        //             let {quantity, num , skuCode, productCode, activityCode, batchNo} = item
        //             let  amount = quantity || num;
        //             arr.push({
        //                 priceCode: skuCode,
        //                 productCode: productCode,
        //                 amount: amount,
        //                 activityCode: activityCode,
        //                 batchNo
        //             });
        //         });
        //
        //         params = { productPriceIds: arr };
        //         //orderType1：秒杀，2：降价拍，3（，orderSubType 3升级礼包 4普通礼包）
        //     }
        //     API.listAvailable({ page: 1, pageSize: 20, ...params }).then(resp => {
        //         let data = resp.data || {};
        //         let dataList = data.data || [];
        //         if (dataList.length === 0) {
        //             this.couponName = '暂无优惠券';
        //         }
        //     }).catch(result => {
        //         console.log(result);
        //     });
        // }
    };

    @action submitProduct(callback) {
        if (StringUtils.isEmpty(this.addressId)) {
            bridge.$toast('请先添加地址');
            return;
        }
        if(!StringUtils.isEmpty(this.err)){
            return;
        }
        bridge.showLoading();
        OrderApi.submitOrder(this.getParams()).then((response) => {
            bridge.hiddenLoading();
            let data = response.data;
            shopCartCacheTool.getShopCartGoodsListData();
            callback(data);
            track(trackEvent.submitOrder, {
                orderId: data.orderNo,
                orderSubmitPage:this.orderParamVO.source==1?11:1
            });
        }).catch(err => {
            bridge.hiddenLoading();
            bridge.$toast(err.msg);
        });
    }
}

export const confirmOrderModel = new ConfirmOrderModel();
