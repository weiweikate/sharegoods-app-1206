import { observable, action } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from "../../shopCart/model/ShopCartCacheTool";
import { navigateBack, routePush } from '../../../navigation/RouterMap';
import { payment } from '../../payment/Payment';
import RouterMap from '../../../navigation/RouterMap';
import API from '../../../api';

class ConfirmOrderModel {

    @observable
    loadingState = PageLoadingState.success;
    @observable
    err=null
    @observable
    canUseCou = true;
    @observable
    isAllVirtual = false;

    addressId =  '';
    addressData = {};
    isNoAddress = false;

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
        this.data = null;

    }

    @action
    selectAddressId(addressData){
        let addressId = addressData.id || '';
            addressId = addressId + '';
        this.addressId = addressId;
        this.addressData = addressData;
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

    @action
    judgeIsAllVirtual(orderProducts){
        let isAllVirtual = true;
        (orderProducts || []).forEach(item => {
            // "skuCode":, //string 平台skuCode
            // "quantity":, //int 购买数量
            // "activityCode":, //string 活动code
            // "batchNo": //string 活动批次号
            let { productType} = item;
            if (productType !== 3){
                isAllVirtual = false;
            }
        })
        this.isAllVirtual = isAllVirtual;
    }

    getAvailableProducts(){
        let orderProducts =  this.orderParamVO.orderProducts || [];
           return orderProducts.filter((item => {
                return item.fail === false;
            }))
    }

    getParams(filterFail){
        let orderProducts =  this.orderParamVO.orderProducts || [];
        if (filterFail){
            orderProducts = this.getAvailableProducts();
        }
        let productList = orderProducts.map(item => {
            // "skuCode":, //string 平台skuCode
            // "quantity":, //int 购买数量
            // "activityCode":, //string 活动code
            // "batchNo": //string 活动批次号
            let {skuCode, quantity, activityCode, batchNo} = item;
            return {skuCode, quantity, activityCode, batchNo};
        })
        let {receiver, receiverPhone, province, city, area, street, address} = this.addressData;
        return {
            couponInfo: { //券信息
                couponCode: this.userCouponCode, //本次下单使用的优惠券code
                tokenCoin: this.tokenCoin//BigDecimal 一元券抵扣金额
            },
            receiveInfo: {
                id: this.addressId, //int 收货地址ID
                receiver,
                receiverPhone,
                province,
                city,
                area,
                street,
                address
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

    getCouponParams(){
        let orderProducts =  this.orderParamVO.orderProducts || [];
        let arr = orderProducts.map((item) => {
            return {
                priceCode: item.skuCode,
                productCode: item.productCode,
                amount: item.quantity,
                activityCode: item.activityCode,
                batchNo: item.batchNo
            };
        });
        let  params = { productPriceIds: arr };
       return { sgAppVersion: 310, ...params}
    }

    @action
    makeSureProduct_selectDefaltCoupon(couponsId){
        if (couponsId){
            API.listAvailable(this.getCouponParams()).then((data) => {
               // couponConfigId	Integer	823
               data = data.data || {};
                (data.data || []).forEach((item) => {
                    if (item.couponConfigId == couponsId) {
                        this.userCouponCode = item.code;
                    }
                })
            }).finally(()=> {
                this.makeSureProduct();
            })
        }else {
           this.makeSureProduct();
        }
    }

    @action makeSureProduct() {
        this.isNoAddress = false;
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
        if (this.data){//原来有数据，清除选择优惠券信息
            this.data.payInfo.payAmount +=  this.data.payInfo.couponAmount;
            this.data.payInfo.couponAmount = 0;//清除优惠券信息
            this.handleNetData(this.data);
        }else {//原来没有数据的时候，展示自己带下来的数据
            this.productOrderList = this.orderParamVO.orderProducts || []
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
        } else if (err.code === 43009){
            this.isNoAddress = true;
            Alert.alert('','您还没有收货地址，请点击添加',
                [{text: '取消', onPress: () => {}},
                    {text: '添加', onPress: () => {
                            routePush(RouterMap.AddressEditAndAddPage,{
                                callBack: (json) => {
                                    this.selectAddressId(json)
                                },
                                from: 'add'
                            });
                        }}
                ])
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
        this.addressId =  this.receiveInfo.id? this.receiveInfo.id+'' : '';
        this.addressData = this.receiveInfo;
        this.tokenCoin =  this.payInfo.tokenCoinAmount;
        if (this.payInfo.couponAmount === 0){
            this.userCouponCode = '';
        }
        let canUseCou = false;
        this.productOrderList.forEach(item=> {
            if (item.canCoupon === true){
                canUseCou = true;
            }
        })
        this.canUseCou = canUseCou;
        //遍历出失效对应商品信息
        let failProductList = [];
        let list = data.failProductList || [];
        let orderProducts = this.orderParamVO.orderProducts || []
            for (let j = 0; j < orderProducts.length; j++){
                let product = orderProducts[j];
                product.fail = false;
                for (let i = 0; i < list.length; i++){
                if (list[i].skuCode == orderProducts[j].skuCode &&
                    list[i].quantity == orderProducts[j].quantity &&
                    list[i].activityCode == orderProducts[j].activityCode &&
                    list[i].batchNo == orderProducts[j].batchNo
                ){
                    product.fail = true;
                    failProductList.push({...product, failReason: list[i].failReason});
                    break;
                }
            }
        }
        this.failProductList = failProductList;
    };

    @action submitProduct() {
        if (StringUtils.isEmpty(this.addressId) && !this.isAllVirtual) {
            bridge.$toast('请先添加地址');
            return;
        }
        if(!StringUtils.isEmpty(this.err)){
            return;
        }
        if (this.productOrderList.length === 0){
            return;
        }

        bridge.showLoading();
        OrderApi.submitOrder(this.getParams(true)).then((response) => {
            bridge.hiddenLoading();
            let data = response.data || {};
            if (this.orderParamVO.source === 1) {
                shopCartCacheTool.getShopCartGoodsListData();
            }
            payment.checkOrderToPage(data.platformOrderNo,data.productOrderList[0].productName);
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
