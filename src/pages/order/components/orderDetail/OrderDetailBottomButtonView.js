import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert, NativeModules
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import { orderDetailAfterServiceModel, orderDetailModel ,assistDetailModel} from '../../model/OrderDetailModel';
import OrderApi from '../../api/orderApi';
import Toast from '../../../../utils/bridge';
import shopCartCacheTool from '../../../shopCart/model/ShopCartCacheTool';
import { observer } from 'mobx-react/native';
const {px2dp} = ScreenUtils;

@observer
export default  class OrderDetailBottomButtonView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={styles.containerStyle}>
            {this.renderMenu()}
            </View>
        )
    }
    renderMenu = () => {
        let nameArr = orderDetailAfterServiceModel.menu;
        console.log('OrderDetailBottomButtonView',orderDetailAfterServiceModel.totalAsList);
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i} style={[styles.touchableStyle,{borderColor: nameArr[i].isRed ? DesignRule.mainColor : DesignRule.color_ddd}]} onPress={() => {
                    this.operationMenuClick(nameArr[i]);
                }}>
                    <Text style={{ color: nameArr[i].isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}>{nameArr[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    operationMenuClick = (menu) => {
        /*
         * 取消订单                 ->  1
         * 去支付                   ->  2
         * 继续支付                 ->  3
         * 订单退款                 ->  4
         * 查看物流                 ->  5
         * 确认收货                 ->  6
         * 删除订单(已完成)          ->  7
         * 再次购买                 ->  8
         * 删除订单(已关闭(取消))    ->  9
         * */
        switch (menu.id) {
            case 1:
                if(assistDetailModel.cancelArr.length > 0){
                    assistDetailModel.setIsShowSingleSelctionModal(true);
                }else{
                    NativeModules.commModule.toast('无取消类型！');
                }

                break;
            case 2:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: orderDetailModel.warehouseOrderDTOList[0].outTradeNo,
                    amounts: orderDetailModel.payAmount
                });
                break;
            case 3:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum:  orderDetailModel.warehouseOrderDTOList[0].outTradeNo,
                    amounts: orderDetailModel.payAmount,
                });
                break;
            case 4:
                break;
            case 5:
                if(!orderDetailModel.warehouseOrderDTOList[0].expList){
                    NativeModules.commModule.toast('当前物流信息不存在！');
                    return;
                }
                 if(orderDetailModel.warehouseOrderDTOList[0].expList.length === 0){
                    NativeModules.commModule.toast('当前物流信息不存在！');
                }
                if(orderDetailModel.warehouseOrderDTOList[0].expList.length === 1&&orderDetailModel.warehouseOrderDTOList[0].unSendProductInfoList.length === 0){
                    this.props.nav("order/logistics/LogisticsDetailsPage", {
                        expressNo: orderDetailModel.warehouseOrderDTOList[0].expList[0].expNO
                    });
                }else{
                    this.props.nav("order/logistics/CheckLogisticsPage", {
                        expressList: orderDetailModel.warehouseOrderDTOList[0].expList,
                        unSendProductInfoList: orderDetailModel.warehouseOrderDTOList[0].unSendProductInfoList
                    });
                }
                break;
            case 6:
                    Alert.alert('',`是否确认收货?`, [
                        {
                            text: `取消`, onPress: () => {
                            }
                        },
                        {
                            text: `确定`, onPress: () => {
                                Toast.showLoading();
                                OrderApi.confirmReceipt({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('确认收货成功');
                                    this.props.loadPageData();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    this.$toastShow(e.msg);
                                });
                            }}

                    ], { cancelable: true });
                break;
            case 7:
                // this.setState({ isShowDeleteOrderModal: true });
                // this.deleteModal && this.deleteModal.open();
                Alert.alert('',`确定删除此订单吗`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                                Toast.showLoading();
                                OrderApi.deleteOrder({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });

                        }}

                ], { cancelable: true });
                break;
            case 8:
                let cartData = [];
                orderDetailModel.warehouseOrderDTOList[0].products.map((item, index) => {
                    cartData.push({ productCode: item.prodCode, skuCode: item.skuCode, amount: item.quantity });
                });
                    shopCartCacheTool.addGoodItem(cartData);
                    this.props.nav('shopCart/ShopCart', { hiddeLeft: false });
                break;
            case 9:
                // this.setState({ isShowDeleteOrderModal: true });
                // this.deleteModal && this.deleteModal.open();
                Alert.alert('',`确定删除此订单吗`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                                Toast.showLoading();
                                OrderApi.deleteOrder({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });

                        }}

                ], { cancelable: true });
                break;
        }
    };
}
const styles = StyleSheet.create({
    containerStyle:{ height: px2dp(48), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',backgroundColor:'white',marginTop:1 },
    touchableStyle:{
        borderWidth: 1,
        height: px2dp(30),
        borderRadius: px2dp(15),
        marginRight: px2dp(15),
        justifyContent: 'center',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20)
    }
})
