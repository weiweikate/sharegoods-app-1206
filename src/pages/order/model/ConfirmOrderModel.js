import { action, observable } from 'mobx';
import OrderApi from '../api/orderApi';
import StringUtils from '../../../utils/StringUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import bridge from '../../../utils/bridge';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { Alert } from 'react-native';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import RouterMap, { routePop, routePush } from '../../../navigation/RouterMap';
import { payment } from '../../payment/Payment';
import API from '../../../api';
import MineAPI from '../../mine/api/MineApi';

class ConfirmOrderModel {

    @observable
    loadingState = PageLoadingState.success;
    @observable
    err = null;
    @observable
    canUseCou = true;
    @observable
    isAllVirtual = false;
    @observable
    canInvoke = false
    invokeItem = null
    @observable
    invokeSelect = false;

    addressId = '';
    addressData = {};
    isNoAddress = false;
    @observable
    addressModalShow = false;
    @observable
    addressList = [];


    orderParamVO = {};
    tokenCoin = 0;
    userCouponCode = '';
    @observable
    message = '';

    @observable
    platformOrderNo = '';
    @observable
    productOrderList = [];
    @observable
    failProductList = [];
    @observable
    payInfo = {};
    @observable
    receiveInfo = {};
    @observable
    err = null;

    @action clearData() {
        this.loadingState = PageLoadingState.success;
        this.err = null;
        this.canUseCou = false;

        // this.addressId = '';每次保留上次的地址
        this.message = '';
        this.tokenCoin = 0;
        this.orderParamVO = {};
        this.userCouponCode = '';

        this.platformOrderNo = null;
        this.productOrderList = [];
        this.failProductList = [];
        this.payInfo = {};
        this.receiveInfo = {};
        this.data = null;
        this.canInvoke = false
        this.invokeSelect = false
        this.invokeItem = null;
        this.addressModalShow = false;
        this.addressList = [];

    }

    @action
    selectAddressId(addressData) {
        let addressId = addressData.id || '';
        if (addressId && addressId === this.addressId){
            return;
        }
        addressId = addressId + '';
        this.addressId = addressId;
        this.addressData = addressData;
        this.tokenCoin = 0;
        this.makeSureProduct();
    }

    @action
    invokeTicket(item, callBack){
        bridge.showLoading('');
        API.invokeCoupons({ userCouponCode: item.code }).then((data) => {
            data = data.data;
            if (data) {
                callBack&&callBack();
                bridge.$toast('激活成功');
                if (this.canInvoke ) {
                    this.invokeSelect = true;
                    this.canInvoke = false;
                }
                this.selectUserCoupon(data.code)
            } else {
                bridge.$toast('激活失败');
            }
            bridge.hiddenLoading();
        }).catch((err) => {
            bridge.$toast(err.msg);
            bridge.hiddenLoading();
        });
    }

    @action
    selecttokenCoin(num) {
        this.tokenCoin = num;
        this.makeSureProduct();
    }

    @action
    selectUserCoupon(userCouponCode) {
        if (this.userCouponCode == userCouponCode) {
            return;
        }
        this.tokenCoin = 0;
        this.userCouponCode = userCouponCode;
        this.makeSureProduct();
    }

    @action
    judgeIsAllVirtual(orderProducts) {
        let isAllVirtual = true;
        (orderProducts || []).forEach(item => {
            // "skuCode":, //string 平台skuCode
            // "quantity":, //int 购买数量
            // "activityCode":, //string 活动code
            // "batchNo": //string 活动批次号
            let { productType } = item;
            if (productType !== 3) {
                isAllVirtual = false;
            }
        });
        this.isAllVirtual = isAllVirtual;
    }

    getAvailableProducts() {
        let orderProducts = this.orderParamVO.orderProducts || [];
        return orderProducts.filter((item => {
            return item.fail === false;
        }));
    }

    getParams(filterFail) {
        let orderProducts = this.orderParamVO.orderProducts || [];
        if (filterFail) {
            orderProducts = this.getAvailableProducts();
        }
        let productList = orderProducts.map(item => {
            // "skuCode":, //string 平台skuCode
            // "quantity":, //int 购买数量
            // "activityCode":, //string 活动code
            // "batchNo": //string 活动批次  (拼团业务传递团id)
            let { skuCode, quantity, batchNo, sgspm = '', sgscm = '',activityList  = []} = item;
            sgspm = sgspm || ''
            sgscm = sgscm || ''
            if (batchNo){
                return { skuCode, quantity,batchNo, activityList, sgspm, sgscm };
            }else {
                return { skuCode, quantity, activityList, sgspm,  sgscm};
            }

        });
        let { receiver, receiverPhone, province, city, area, street, address } = this.addressData;
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
                channel: 2,//int 渠道来源: 1.小程序 2.APP 3.H5
                bizTag:  this.orderParamVO.bizTag,//"bizTag": //String 订单标记 group-拼团 非拼团不需要传  －－－－－－－－－－－－0917拼团业务新增
                // sgspm: this.orderParamVO.sgspm,
                // sgscm: this.orderParamVO.sgscm
            },
            ext: { //扩展信息
                userMessage: this.message// string 买家留言
            }
        };
    }

    getCouponParams() {
        let orderProducts = this.orderParamVO.orderProducts || [];
        let arr = orderProducts.map((item) => {
            return {
                priceCode: item.skuCode,
                productCode: item.productCode,
                amount: item.quantity,
                batchNo: item.batchNo,
                promotions: item.activityList
            };
        });
        let params = { productPriceIds: arr };
        return { sgAppVersion: 310, ...params };
    }

    @action
    makeSureProduct_selectDefaltAddress(){
        let addressData = this.orderParamVO.address
        //不存在街道code，直接请求
        if (!addressData || !addressData.areaCode || this.isAllVirtual) {
            return this.makeSureProduct_selectDefaltCoupon(this.orderParamVO.couponsId)
        }
        const { province, city, area, provinceCode, cityCode, areaCode} = addressData;
        //选择了收货地址
        if (addressData.id){
            let addressId = addressData.id || '';
            addressId = addressId + '';
            this.addressId = addressId;
            this.addressData = addressData;
            this.tokenCoin = 0;
            return this.makeSureProduct_selectDefaltCoupon(this.orderParamVO.couponsId)
        }
        //进行匹配区的收货地址
        MineAPI.queryAddrList().then((data)=> {
            data = data.data || [];
            if (data.length === 0){//只有默认地址或没有地址
                return;
            }

            let flag = false;

            data = data.filter((item, index) => {
                if (this.addressId){//当前选择的地址，过滤
                    if (this.addressId == item.id ){
                        if (addressData.areaCode == item.areaCode){
                            flag = true;
                        }
                        return false;
                    }
                } else if (index === 0){
                    if (addressData.areaCode == item.areaCode){
                        flag = true;
                    }
                    return false;
                }
                return addressData.areaCode == item.areaCode;
            })

            if (data.length !== 0) {
                this.addressList = data;
                this.addressModalShow = true;
            }else {
                if (flag){
                    return;
                }
                Alert.alert('', '您在浏览商品中选择了新的收货地址，是否添加新地址？',
                    [{
                        text: '取消', onPress: () => {
                        }
                    },
                        {
                            text: '添加', onPress: () => {
                                routePush(RouterMap.AddressEditAndAddPage, {
                                    callBack: (json) => {
                                        this.selectAddressId(json);
                                    },
                                    from: 'add',
                                    province,
                                    city,
                                    area,
                                    provinceCode,
                                    cityCode,
                                    areaCode,
                                    areaText: province + city + area
                                });
                            }
                        }
                    ]);

            }
        }).finally(()=> {
            this.makeSureProduct_selectDefaltCoupon(this.orderParamVO.couponsId)
        })
    }
    @action
    closeAddressModal(){
        this.addressModalShow = false;
    }
    @action
    addressModal_selecetAddress(index){
        this.closeAddressModal();
        this.selectAddressId(this.addressList[index]);
    }

    @action
    makeSureProduct_selectDefaltCoupon(couponsId) {
       //拼团不能使用优惠券
        if (this.orderParamVO.bizTag === 'group') {
            this.makeSureProduct();
            return;
        }
            API.listAvailable(this.getCouponParams()).then((data) => {
                // couponConfigId	Integer	823
                data = data.data || {};
                let userCouponCode = '';
                (data.data || []).find((item)=>{
                    if (item.canInvoke === true && item.type == 5 && !this.invokeItem)
                    {
                        this.canInvoke = true;
                        this.invokeItem = item;
                    }
                        if (item.status !== 0){
                        return;//不可用
                    }
                    if (item.couponConfigId == couponsId) {//如果是匹配的兑换券，就结束循环
                        userCouponCode = item.code;
                        this.canInvoke = false
                        this.invokeItem = null
                        return true;
                    }
                    if (item.type == 5 && !userCouponCode) {//是兑换券，且userCouponCode还没空（为了找第一个可用兑换券）
                        userCouponCode = item.code;
                        if (!couponsId) {//id为空，不需要匹配对应的优惠券就结束循环
                            this.canInvoke = false
                            this.invokeItem = null
                            return true;
                        }
                    }
                });
                this.userCouponCode = userCouponCode;
            }).finally(() => {
                this.makeSureProduct();
            });
    }

    @action makeSureProduct() {
        this.isNoAddress = false;
        console.log(this.getParams())
        bridge.showLoading();
        OrderApi.makeSureOrder(this.getParams()).then(response => {
            bridge.hiddenLoading();
            this.err = null;
            this.loadingState = PageLoadingState.success;
            this.handleNetData(response.data || {});
        }).catch(err => {
            bridge.hiddenLoading();
            this.err = err;
            this.disPoseErr(err);

        });
    }


    disPoseErr = (err) => {
        if (this.data) {//原来有数据，清除选择优惠券信息
            // this.data.payInfo.payAmount += this.data.payInfo.couponAmount;
            // this.data.payInfo.couponAmount = 0;//清除优惠券信息
            // this.handleNetData(this.data);
             this.receiveInfo = {};
        } else {//原来没有数据的时候，展示自己带下来的数据
            this.productOrderList = this.orderParamVO.orderProducts || [];
        }
        if (err.code === 10003 && err.msg.indexOf('不在限制的购买时间') !== -1) {
            Alert.alert('提示', err.msg, [
                {
                    text: '确定', onPress: () => {
                        routePop();
                    }
                }
            ]);
        } else if (err.code === 54001) {
            bridge.$toast('商品库存不足！');
        } else if (err.code === 43009) {
            let addressData = this.orderParamVO.address || {};
            const { province, city, area, provinceCode, cityCode, areaCode} = addressData;
            this.isNoAddress = true;
            Alert.alert('', '您还没有收货地址，请点击添加',
                [{
                    text: '取消', onPress: () => {
                    }
                },
                    {
                        text: '添加', onPress: () => {
                            routePush(RouterMap.AddressEditAndAddPage, {
                                callBack: (json) => {
                                    this.selectAddressId(json);
                                },
                                from: 'add',
                                province,
                                city,
                                area,
                                provinceCode,
                                cityCode,
                                areaCode,
                                areaText: province + city + area
                            });
                        }
                    }
                ]);
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
        this.addressId = this.receiveInfo.id ? this.receiveInfo.id + '' : '';
        this.addressData = this.receiveInfo;
        this.tokenCoin = this.payInfo.tokenCoinAmount;
        if (this.payInfo.couponAmount === 0) {
            this.userCouponCode = '';
        }
        let canUseCou = false;//拼团优惠券不可用
        if (this.orderParamVO.bizTag !== 'group') {
            this.productOrderList.forEach(item => {
                if (item.canCoupon === true) {
                    canUseCou = true;
                }
            });
        }
        this.canUseCou = canUseCou;
        //遍历出失效对应商品信息
        let failProductList = [];
        let list = data.failProductList || [];
        let orderProducts = this.orderParamVO.orderProducts || [];
        for (let j = 0; j < orderProducts.length; j++) {
            let product = orderProducts[j];
            product.fail = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].skuCode == orderProducts[j].skuCode &&
                    list[i].quantity == orderProducts[j].quantity &&
                    list[i].activityCode == orderProducts[j].activityCode &&
                    list[i].batchNo == orderProducts[j].batchNo
                ) {
                    product.fail = true;
                    failProductList.push({ ...product, failReason: list[i].failReason });
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
        if (!StringUtils.isEmpty(this.err)) {
            return;
        }
        if (!this.productOrderList) {
            return;
        }
        if (this.productOrderList.length === 0) {
            return;
        }

        bridge.showLoading();
        OrderApi.submitOrder(this.getParams(true)).then((response) => {
            bridge.hiddenLoading();
            let data = response.data || {};
            if (this.orderParamVO.source === 1) {
                shopCartCacheTool.getShopCartGoodsListData();
            }
            payment.checkOrderToPage(data.platformOrderNo, data.productOrderList[0].productName, 'order');
            track(trackEvent.submitOrder, {
                orderId: data.orderNo,
                orderSubmitPage: this.orderParamVO.source == 1 ? 11 : 1
            });
        }).catch(err => {
            bridge.hiddenLoading();
            if (err.code !== -1){
                Alert.alert(err.msg+'，请刷新页面或返回修改？',null,[{
                    text: '返回', onPress: () => {
                        routePop();
                    }
                },
                    {
                        text: '刷新', onPress: () => {
                            this.makeSureProduct();
                        }
                    }
                ])
            }else {
                bridge.$toast(err.msg);
            }

        });
    }
}

export const confirmOrderModel = new ConfirmOrderModel();
