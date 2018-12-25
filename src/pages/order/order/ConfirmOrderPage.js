import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from "../../../utils/bridge";
import GoodsItem from '../components/confirmOrder/GoodsItem';
import { confirmOrderModel} from "../model/ConfirmOrderModel";
import { observer } from "mobx-react/native";
import BasePage from '../../../BasePage';
import { NavigationActions } from 'react-navigation';
import DesignRule from 'DesignRule';
import ConfirmAddressView from "../components/confirmOrder/ConfirmAddressView";
import ConfirmPriceView from "../components/confirmOrder/ConfirmPriceView";
import ConfirmBottomView from "../components/confirmOrder/ConfirmBottomView";
import { PageLoadingState, renderViewByLoadingState } from "../../../components/pageDecorator/PageState";


@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData:[],
        };
    }
    $navigationBarOptions = {
        title: '确认订单',
        show: true // false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: confirmOrderModel.loadingState,
            netFailedProps: {
                netFailedInfo: confirmOrderModel.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    _reload=()=>{
        confirmOrderModel.netFailedInfo = null;
        confirmOrderModel.loadingState = PageLoadingState.loading;
        this.loadPageData;
    }
    //**********************************ViewPart******************************************
    _renderContent=()=>{
        console.log("this.state.viewData",this.state.viewData)
        return(
            <View style={{flex:1,justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom}}>
                <ScrollView>
                    <ConfirmAddressView selectAddress={()=>this.selectAddress()}/>
                    {this.state.viewData.map((item,index)=>{
                       return   <GoodsItem
                           uri={item.specImg}
                           goodsName={item.productName}
                           salePrice={StringUtils.formatMoneyString(item.unitPrice)}
                           category={item.specValues}
                           goodsNum={'x' + item.quantity}
                       />
                    })}
                    <ConfirmPriceView jumpToCouponsPage={()=>this.jumpToCouponsPage() }/>
                </ScrollView>
                <ConfirmBottomView commitOrder={()=>this.commitOrder()}/>
            </View>
            )

    }

    _render() {
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
            </View>

        );
    }
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };

    componentDidMount() {
        this.loadPageData;
    }

   async loadPageData(params) {
        bridge.showLoading();
       let data =  await  confirmOrderModel.makeSureProduct(this.params.orderParamVO,params)
       console.log("confirm data" ,confirmOrderModel.orderProductList);
        this.setState({viewData:data.orderProductList});

    }

    selectAddress = () => {//地址重新选择
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            callBack: (json) => {
                console.log(json);
                confirmOrderModel.addressId=json.id
                let params = {
                    addressId:json.id,
                     tokenCoin: 0,
                    tokenCoinText: '选择使用1元券',
                    userCouponCode: this.state.userCouponCode
                };
                this.loadPageData(params);
            }
        });
    };
  commitOrder = async () => {
      bridge.showLoading();
      let data = await confirmOrderModel.makeSureProduct(this.params.orderParamVO);
      this.replaceRouteName(data);
  }
        // let baseParams = {
        //     message: this.state.message,
        //     tokenCoin: this.state.tokenCoin,
        //     userCouponCode: this.state.userCouponCode,
        //     addressId: this.state.addressId
        // };
        //
        // if (StringUtils.isEmpty(this.state.addressId)) {
        //     bridge.$toast('请先添加地址');
        //     return;
        // }
        // this.$loadingShow();
        // if (this.state.orderParam && this.state.orderParam.orderType === 1 || this.state.orderParam.orderType === 2) {
        //     let params = {
        //         ...baseParams,
        //         activityCode: this.params.orderParamVO.orderProducts[0].code,
        //         channel: 2,
        //         num: this.params.orderParamVO.orderProducts[0].num,
        //         source: 2,
        //         submitType: 2,
        //     };
        //     if (this.state.orderParam && this.state.orderParam.orderType === 1) {//如果是秒杀的下单
        //         OrderApi.SeckillSubmitOrder(params).then((response) => {
        //             this.$loadingDismiss();
        //             let data = response.data;
        //             track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
        //                 receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
        //                 discountName:this.state.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.state.tokenCoin,numberOfYiYuan:this.state.tokenCoin,
        //                 YiyuanDiscountAmount:this.state.tokenCoin})
        //             MineApi.getUser().then(res => {
        //                 this.$loadingDismiss();
        //                 let data = res.data;
        //                 userOrderNum.getUserOrderNum();
        //                 user.saveUserInfo(data);
        //             }).catch(err => {
        //             });
        //             this.replaceRouteName(data);
        //
        //         }).catch(e => {
        //             this.$loadingDismiss();
        //             console.log(e);
        //             this.$toastShow(e.msg);
        //             if (e.code === 10009) {
        //                 this.$navigate('login/login/LoginPage', {
        //                     callback: () => {
        //                         this.loadPageData();
        //                     }
        //                 });
        //             }
        //         });
        //     } else if (this.state.orderParam && this.state.orderParam.orderType === 2) {
        //         OrderApi.DepreciateSubmitOrder(params).then((response) => {
        //             this.$loadingDismiss();
        //             let data = response.data;
        //             track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
        //                 receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
        //                 discountName:this.state.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.state.tokenCoin,numberOfYiYuan:this.state.tokenCoin,
        //                 YiyuanDiscountAmount:this.state.tokenCoin})
        //             MineApi.getUser().then(res => {
        //                 this.$loadingDismiss();
        //                 let data = res.data;
        //                 userOrderNum.getUserOrderNum();
        //                 user.saveUserInfo(data);
        //             }).catch(err => {
        //             });
        //             this.replaceRouteName(data);
        //         }).catch(e => {
        //             this.$loadingDismiss();
        //             console.log(e);
        //             this.$toastShow(e.msg);
        //             if (e.code === 10009) {
        //                 this.$navigate('login/login/LoginPage', {
        //                     callback: () => {
        //                         this.loadPageData();
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // }
        //     else if (this.state.orderParam && this.state.orderParam.orderType === 3) {
        //         let params1 = {
        //             ...baseParams,
        //             activityCode:this.params.orderParamVO.activityCode,
        //             orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
        //             orderSubType: this.params.orderParamVO.orderSubType ,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
        //             source:2,//1.购物车 2.直接下单
        //             channel:2,//1.小程序 2.APP 3.H5
        //             orderProductList:this.params.orderParamVO.orderProducts,
        //             submitType:2,
        //             quantity:1,
        //         };
        //         OrderApi.PackageSubmitOrder(params1).then((response) => {
        //             this.$loadingDismiss();
        //             let data = response.data;
        //             MineApi.getUser().then(res => {
        //                 this.$loadingDismiss();
        //                 let data = res.data;
        //                 track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddress.receiver,
        //                     receiverProvince:data.userAddress.province,receiverCity:data.userAddress.city,receiverArea:data.userAddress.area,receiverAddress:data.userAddress.address,
        //                     discountName:this.state.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.state.tokenCoin,numberOfYiYuan:this.state.tokenCoin,
        //                     YiyuanDiscountAmount:this.state.tokenCoin})
        //                 user.saveUserInfo(data);
        //                 userOrderNum.getUserOrderNum();
        //             }).catch(err => {
        //             });
        //             this.replaceRouteName(data);
        //         }).catch(e => {
        //             this.$loadingDismiss();
        //             console.log(e);
        //             this.$toastShow(e.msg);
        //             if (e.code === 10009) {
        //                 this.$navigate('login/login/LoginPage', {
        //                     callback: () => {
        //                         this.loadPageData();
        //                     }
        //                 });
        //             }
        //         });
        //
        //     }
        //  else {
        //     let params = {
        //         ...baseParams,
        //         orderProductList: this.state.orderParam.orderProducts,
        //         // orderType: this.state.orderParam.orderType,
        //         orderType:1,
        //         source:this.state.orderParam.source,
        //         channel:2,
        //     };
        //     OrderApi.submitOrder(params).then((response) => {
        //         this.$loadingDismiss();
        //         let data = response.data;
        //         track(trackEvent.submitOrder,{orderID:data.orderNo,orderAmount:data.payAmount,transportationCosts:data.totalFreightFee,receiverName:data.userAddressDTO.receiver,
        //             receiverProvince:data.userAddressDTO.province,receiverCity:data.userAddressDTO.city,receiverArea:data.userAddressDTO.area,receiverAddress:data.userAddressDTO.address,
        //             discountName:this.state.tokenCoinText,discountAmount:1,ifUseYiYuan:!!this.state.tokenCoin,numberOfYiYuan:this.state.tokenCoin,
        //             YiyuanDiscountAmount:this.state.tokenCoin})
        //         MineApi.getUser().then(res => {
        //             this.$loadingDismiss();
        //             let data = res.data;
        //             userOrderNum.getUserOrderNum();
        //             user.saveUserInfo(data);
        //         }).catch(err => {
        //         });
        //
        //         this.replaceRouteName(data);
        //
        //     }).catch(e => {
        //         this.$loadingDismiss();
        //         this.$toastShow(e.msg);
        //         if (e.code === 54001) {
        //             this.$toastShow('商品库存不足！');
        //             // shopCartCacheTool.getShopCartGoodsListData();
        //             this.$navigateBack();
        //         }
        //     });
        //
        // }
    // };
    //选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {
            this.$navigate('mine/coupons/CouponsPage', {
                justOne: (parseInt(confirmOrderModel.payAmount)+parseInt(confirmOrderModel.tokenCoin) )? (parseInt(confirmOrderModel.payAmount)+parseInt(confirmOrderModel.tokenCoin) ) : 1, callBack: (data) => {
                    console.log(typeof data);
                    if (parseInt(data) >= 0) {
                        let params = { tokenCoin: parseInt(data) > 0 &&parseInt(data)<=(parseInt(confirmOrderModel.payAmount)+parseInt(confirmOrderModel.tokenCoin))? parseInt(data):0,
                            userCouponCode: confirmOrderModel.userCouponCode,
                            addressId:confirmOrderModel.addressId,
                        };
                            confirmOrderModel.tokenCoin= parseInt(data) > 0 &&parseInt(data)<=(parseInt(confirmOrderModel.payAmount)+parseInt(confirmOrderModel.tokenCoin))? parseInt(data):0,
                            confirmOrderModel.tokenCoinText=parseInt(data) > 0 &&(parseInt(confirmOrderModel.payAmount)+parseInt(confirmOrderModel.tokenCoin))? '-¥' + parseInt(data) : '选择使用1元券'
                        this.loadPageData(params);
                    }
                }
            });
        } else {
            this.$navigate('mine/coupons/CouponsPage', {
                fromOrder: 1,
                orderParam: confirmOrderModel.orderParamVO, callBack: (data) => {
                    console.log('CouponsPage',data);
                    if (data && data.id) {
                        let params = { userCouponCode: data.code, tokenCoin: 0 };
                            confirmOrderModel.userCouponCode=data.code,
                            confirmOrderModel.couponName= data.name,
                            confirmOrderModel.tokenCoin= 0,
                            confirmOrderModel.tokenCoinText= '选择使用1元券',
                            confirmOrderModel.addressId=this.state.addressId
                        this.loadPageData(params);
                    } else if (data === 'giveUp') {
                        confirmOrderModel.userCouponCode=null,
                            confirmOrderModel.couponName= null
                        this.loadPageData();
                    }
                }
            });
        }
    };

    replaceRouteName(data) {
        // this.$navigate('payment/PaymentMethodPage',
        //     {
        //         orderNum: data.orderNo,
        //         amounts: data.payAmount,
        //         pageType: 0,
        //        }
        // )
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'payment/PaymentMethodPage',
            params: {
                orderNum: data.orderNo,
                amounts: data.payAmount,
                pageType: 0,
            }
        });
        this.props.navigation.dispatch(replace);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor,
    }, selectText: {
        fontSize: ScreenUtils.px2dp(16), color: 'white'
    }, blackText: {
        fontSize:  ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_mainTitle
    }, grayText: {
        fontSize: ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_instruction
    }, inputTextStyle: {
        marginLeft: ScreenUtils.autoSizeWidth(20), height: ScreenUtils.autoSizeWidth(40), flex: 1, backgroundColor: 'white', fontSize: ScreenUtils.px2dp(14),
    }, selectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: DesignRule.textColor_secondTitle,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.textColor_secondTitle,
        justifyContent: 'center',
        alignItems: 'center'
    }, unSelectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.textColor_secondTitle,
        justifyContent: 'center',
        alignItems: 'center'
    }, couponsStyle: {
        height: ScreenUtils.autoSizeWidth(44),
        flexDirection: 'row',
        paddingLeft: ScreenUtils.autoSizeWidth(15),
        paddingRight: ScreenUtils.autoSizeWidth(15),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addressSelectStyle:{
        minHeight: ScreenUtils.autoSizeWidth(80) ,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ScreenUtils.autoSizeWidth(10),
        paddingBottom: ScreenUtils.autoSizeWidth(10)
    },
    commonTextStyle:{
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.textColor_mainTitle
    },
    receiverAddressStyle:{
        fontSize:ScreenUtils.px2dp(13),
        color: DesignRule.textColor_mainTitle,
        marginTop:ScreenUtils.autoSizeWidth(5)
    },
    hintStyle:{
        fontSize: ScreenUtils.px2dp(13),
        color: DesignRule.textColor_hint,
        marginLeft: ScreenUtils.autoSizeWidth(15)
    },
    arrowRightStyle:{ width:ScreenUtils.autoSizeWidth(10),height: ScreenUtils.autoSizeWidth(14), marginRight: ScreenUtils.autoSizeWidth(15) },
    giftOutStyle:{
        marginTop: ScreenUtils.autoSizeWidth(20),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    giftInnerStyle:{
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: DesignRule.mainColor,
        marginLeft: ScreenUtils.autoSizeWidth(20)
    },
    giftTextStyles:{
        fontSize: ScreenUtils.px2dp(11),
        color: DesignRule.mainColor,
        padding: ScreenUtils.autoSizeWidth(3)
    },
    couponIconStyle:{
        width: ScreenUtils.autoSizeWidth(15),
        height: ScreenUtils.autoSizeWidth(12),
        position: 'absolute',
        left: ScreenUtils.autoSizeWidth(15),
        top: ScreenUtils.autoSizeWidth(12)
    },
    couponsOutStyle:{
        height: ScreenUtils.autoSizeWidth(34),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: ScreenUtils.autoSizeWidth(36)
    },
    couponsTextStyle:{
        color: DesignRule.textColor_instruction,
        fontSize:ScreenUtils.px2dp(13) ,
        alignSelf: 'center'
    },
    couponsNumStyle:{
        color: DesignRule.textColor_instruction,
        fontSize: ScreenUtils.px2dp(13) ,
        alignSelf: 'center',
        marginRight: ScreenUtils.autoSizeWidth(13.5)
    },
    couponsLineStyle:{
        marginLeft: ScreenUtils.autoSizeWidth(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: '100%'
    },
    commitOutStyle:{ height: ScreenUtils.autoSizeHeight(49), flexDirection: 'row',backgroundColor:DesignRule.white,justifyContent: 'flex-end', alignItems: 'center'},
    commitAmountStyle:{
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.mainColor,
        marginRight: ScreenUtils.autoSizeWidth(15)
    },
    commitTouStyle:{
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: ScreenUtils.autoSizeHeight(49),
    }
});
