import { observable, action } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from "../../shopCart/model/ShopCartCacheTool";
import { navigateBack, replaceRoute } from '../../../navigation/RouterMap';

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
        this.canUseCou = true;

        this.addressId = '';
        this.message = '';
        this.tokenCoin = 0;
        this.orderParamVO = {};
        this.userCouponCode = '';

        this.platformOrderNo = null;
        this.productOrderList = [];
        this.failProductList = []
        this.payInfo = {};
        this.receiveInfo = {};
        this.data = {};

    }

    @action
    selectAddressId(addressId){
        addressId = addressId + '';
        if (this.addressId == addressId && this.addressId && this.addressId.length > 0) {
            return;
        }
        this.addressId = addressId;
        this.tokenCoin = 0;
        this.makeSureProduct()
    }

    @action
    selecttokenCoin(num){
        if (this.tokenCoin == num) {
            return;
        }
        this.tokenCoin = num;
        this.makeSureProduct()
    }
    @action
    selectUserCoupon(userCouponCode){
        if ( this.userCouponCode == userCouponCode) {
            return;
        }
        this.tokenCoin = 0;
        this.userCouponCode = userCouponCode;
        this.makeSureProduct();
    }

    getParams(){
        let productList = (this.orderParamVO.orderProducts || []).map(item => {
            // "skuCode":, //string 平台skuCode
            // "quantity":, //int 购买数量
            // "activityCode":, //string 活动code
            // "batchNo": //string 活动批次号
            let {skuCode, quantity, activityCode, batchNo} = item;
            return {skuCode, quantity, activityCode, batchNo};
        })

        return {
            couponInfo: { //券信息
                couponCodes: [this.userCouponCode], //List<string> 本次下单使用的优惠券code
                tokenCoin: this.tokenCoin//BigDecimal 一元券抵扣金额
            },
            receiveInfo: {
                id: this.addressId //int 收货地址ID
            },
            productList: productList,
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
        if (this.data){
            this.handleNetData(this.data);
        }
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
        this.data = data;
        this.platformOrderNo = data.platformOrderNo || '';
        this.productOrderList = data.productOrderList || [];
        this.payInfo = data.payInfo || {};
        this.receiveInfo = data.receiveInfo || {};
        this.addressId =  this.receiveInfo.id + '';
        this.tokenCoin =  this.payInfo.tokenCoinAmount;
        //遍历出失效对应商品信息
        let failProductList = [];
        let list = data.failProductList || [];
        let orderProducts = this.orderParamVO.orderProducts || []
        for (let i = 0; i < list.length; i++){
            for (let j = 0; j < orderProducts.length; j++){
                if (list[i].skuCode == orderProducts[j].skuCode &&
                    list[i].quantity == orderProducts[j].quantity &&
                    list[i].activityCode == orderProducts[j].activityCode &&
                    list[i].batchNo == orderProducts[j].batchNo
                ){
                    failProductList.push(orderProducts[j]);
                    break;
                }
            }
        }
        this.failProductList = failProductList;
    };

    @action submitProduct() {
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
            let data = response.data || {};
            if (this.orderParamVO.source === 1) {
                shopCartCacheTool.getShopCartGoodsListData();
            }
            replaceRoute('payment/PaymentPage', {
                    orderNum: data.platformOrderNo,
                    amounts: data.payInfo.payAmount,
                    orderProductList: data.productOrderList,
                    platformOrderNo: data.platformOrderNo
            })
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
