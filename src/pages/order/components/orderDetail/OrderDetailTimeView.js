import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert, NativeModules
} from 'react-native';
import {
    UIText
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DateUtils from '../../../../utils/DateUtils';
import DesignRule from 'DesignRule';
import { orderDetailAfterServiceModel, orderDetailModel ,assistDetailModel} from '../../model/OrderDetailModel';
import OrderApi from '../../api/orderApi';
import Toast from '../../../../utils/bridge';
import shopCartCacheTool from '../../../shopCart/model/ShopCartCacheTool';
import { observer } from 'mobx-react/native';
const {px2dp} = ScreenUtils;

@observer
export default class OrderDetailTimeView extends Component {

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: px2dp(10), backgroundColor: DesignRule.bgColor }}/>
        );
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
        // this.setState({ menu: menu });
        switch (menu.id) {
            case 1:
                if(assistDetailModel.cancelArr.length>0){
                    assistDetailModel.setIsShowSingleSelctionModal(true);
                    // this.setState({ isShowSingleSelctionModal: true });
                    // this.cancelModal && this.cancelModal.open();
                }else{
                    NativeModules.commModule.toast('无取消类型！');
                }

                break;
            case 2:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: orderDetailModel.orderNum,
                    amounts: orderDetailModel.needPrice
                    // orderType: this.state.viewData.pickedUp - 1
                });
                break;
            case 3:
                this.props.nav('payment/PaymentMethodPage', {
                    orderNum: orderDetailModel.orderNum,
                    amounts: orderDetailModel.needPrice,
                    outTradeNo: orderDetailModel.outTradeNo
                });
                break;
            case 4:
                break;
            case 5:
                this.props.nav('order/logistics/LogisticsDetailsPage', {
                    orderNum: orderDetailModel.orderNum,
                    orderId: assistDetailModel.orderId,
                    expressNo: orderDetailModel.expressNo
                });
                break;
            case 6:
                console.log(this.state.viewData.list);
                let j = 0;
                let returnTypeArr = ['', '退款', '退货', '换货'];
                for (let i = 0; i < orderDetailModel.orderProductList.length; i++) {
                    let returnProductStatus = orderDetailModel.orderProductList[i].returnProductStatus || 99999;
                    if (returnProductStatus === 1) {
                        let content = '确认收货将关闭' + returnTypeArr[orderDetailModel.orderProductList[i].returnType] + '申请，确认收货吗？';
                        Alert.alert('提示', `${ content }`, [
                            {
                                text: '取消', onPress: () => {
                                }
                            },
                            {
                                text: '确定', onPress: () => {
                                    Toast.showLoading();
                                    OrderApi.confirmReceipt({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast('确认收货成功');
                                        this.props.loadPageData();
                                    }).catch(e => {
                                        Toast.hiddenLoading();
                                        NativeModules.commModule.toast(e.msg);
                                    });
                                }
                            }
                        ], { cancelable: true });
                        j++;
                        break;
                    }
                }
                if (j == 0) {
                    // this.setState({ isShowReceiveGoodsModal: true });
                    // this.receiveModal && this.receiveModal.open();
                    Alert.alert('',`是否确认收货?`, [
                        {
                            text: `取消`, onPress: () => {
                            }
                        },
                        {
                            text: `确定`, onPress: () => {
                                Toast.showLoading();
                                OrderApi.confirmReceipt({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('确认收货成功');
                                    this.props.loadPageData();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    this.$toastShow(e.msg);
                                });
                            }}

                    ], { cancelable: true });
                }
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
                            if (orderDetailModel.status === 4||orderDetailModel.status === 5) {
                                Toast.showLoading();
                                OrderApi.deleteCompletedOrder({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });

                            } else if (orderDetailModel.status === 6||orderDetailModel.status === 7||orderDetailModel.status === 8) {
                                Toast.showLoading();
                                OrderApi.deleteClosedOrder({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                    // this.params.callBack && this.params.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });
                            } else {
                                NativeModules.commModule.toast('状态值异常，暂停操作');
                            }
                        }}

                ], { cancelable: true });
                break;
            case 8:
                Toast.showLoading();
                OrderApi.againOrder({
                    orderNum: orderDetailModel.orderNum,
                    id: assistDetailModel.orderId
                }).then((response) => {
                    let cartData = [];
                    Toast.hiddenLoading();
                    response.data.orderProducts.map((item, index) => {
                        cartData.push({ productId: item.productId, priceId: item.priceId, amount: item.num });
                    });
                    shopCartCacheTool.addGoodItem(cartData);
                    this.props.nav('shopCart/ShopCart', { hiddeLeft: false });
                }).catch(e => {
                    Toast.hiddenLoading();
                    NativeModules.commModule.toast(e.msg);
                });
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
                            if (orderDetailModel.status === 4||orderDetailModel.status === 5) {
                                Toast.showLoading();
                                OrderApi.deleteCompletedOrder({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });

                            } else if (orderDetailModel.status === 6||orderDetailModel.status === 7||orderDetailModel.status === 8) {
                                Toast.showLoading();
                                OrderApi.deleteClosedOrder({ orderNum: orderDetailModel.orderNum }).then((response) => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast('订单已删除');
                                    this.props.goBack();
                                    this.props.callBack();
                                }).catch(e => {
                                    Toast.hiddenLoading();
                                    NativeModules.commModule.toast(e.msg);
                                });
                            } else {
                                NativeModules.commModule.toast('状态值异常，暂停操作');
                            }
                        }}

                ], { cancelable: true });
                break;
        }
    };
    copyOrderNumToClipboard = () => {
        StringUtils.clipboardSetString(orderDetailModel.orderNum);
        NativeModules.commModule.toast('订单号已经复制到剪切板');
    };
    renderMenu = () => {
        let nameArr = orderDetailAfterServiceModel.totalAsList.menu;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i} style={{
                    borderWidth: px2dp(1),
                    borderColor: nameArr[i].isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                    height: px2dp(30),
                    borderRadius: px2dp(15),
                    marginRight: px2dp(15),
                    justifyContent: 'center',
                    paddingLeft: px2dp(20),
                    paddingRight: px2dp(20)
                }} onPress={() => {
                    this.operationMenuClick(nameArr[i]);
                }}>
                    <Text style={{ color: nameArr[i].isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}>{nameArr[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    renderGiftAfterSales = () => {
        return (
            <View>
                {orderDetailAfterServiceModel.currentAsList.length === 0 ? null :
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            height: px2dp(48),
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'white'
                        }}>
                            {this.renderMenus()}
                        </View>
                        {this.renderLine()}
                    </View>
                }
            </View>
        );
    };
    render() {
        return (
            <View style={{ backgroundColor: 'white',paddingTop:px2dp(10) }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <UIText value={'订单编号：' + this.props.orderNum}
                            style={[styles.textGoodsDownStyle,{marginTop:px2dp(10)}]}/>
                    <TouchableOpacity style={styles.clipStyle} onPress={() => this.copyOrderNumToClipboard()}>
                        <Text style={{ paddingLeft: px2dp(10), paddingRight: px2dp(10) }}>复制</Text>
                    </TouchableOpacity>
                </View>
                <UIText value={'创建时间：' + DateUtils.getFormatDate(this.props.createTime / 1000)}
                        style={styles.textGoodsDownStyle}/>
                {StringUtils.isNoEmpty(this.props.platformPayTime) && this.props.status > 1 ?
                    <UIText value={'平台付款时间：' + DateUtils.getFormatDate(this.props.platformPayTime / 1000)}
                            style={styles.textGoodsDownStyle}/> : null}
                {StringUtils.isNoEmpty(this.props.shutOffTime) && this.props.status > 5 ?
                    <UIText value={'关闭时间：' + DateUtils.getFormatDate(this.props.shutOffTime / 1000)}
                            style={styles.textGoodsDownStyle}/> : null}
                {StringUtils.isEmpty(this.props.cancelTime) ? null :
                    <UIText value={'取消时间：' + DateUtils.getFormatDate(this.props.cancelTime / 1000)}
                            style={styles.textGoodsDownStyle}/>}
                {StringUtils.isNoEmpty(this.props.payTime) && (this.props.payType % 2 === 0) && this.props.status > 1 ?
                    <UIText value={'三方付款时间：' + DateUtils.getFormatDate(this.props.payTime / 1000)}
                            style={styles.textGoodsDownStyle}/> : null}
                {StringUtils.isNoEmpty(this.props.outTradeNo) && (this.props.payType % 2 === 0) ?
                    <UIText value={'交易订单号：' + this.props.outTradeNo}
                            style={styles.textOrderDownStyle}/> : null}
                {StringUtils.isEmpty(this.props.sendTime) ? null :
                    <UIText value={'发货时间：' + DateUtils.getFormatDate(this.props.sendTime / 1000)}
                            style={styles.textOrderDownStyle}/>}
                {StringUtils.isEmpty(this.props.finishTime) ? null :
                    <UIText
                        value={'完成时间：' + DateUtils.getFormatDate(this.props.deliverTime ? this.props.deliverTime / 1000 : this.props.finishTime / 1000)}
                        style={styles.textOrderDownStyle}/>}
                {this.renderWideLine()}
                <View style={{ height: px2dp(48), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {this.renderMenu()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textOrderDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: px2dp(10)
    },
    textGoodsDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: px2dp(10)
    },
    clipStyle: {
        borderWidth: 1,
        borderColor: DesignRule.color_ddd,
        marginRight: px2dp(10),
        justifyContent: 'center',
        alignItems:'center',
        height: px2dp(22),
        width: px2dp(55),
        marginTop: px2dp(10),
        borderRadius:px2dp(2)
    },
    couponsIconStyle: {
        width: px2dp(15),
        height: px2dp(12),
        position: 'absolute',
        left: px2dp(15),
        top: px2dp(12)
    },
    couponsOuterStyle: {
        height: px2dp(34),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: px2dp(36)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        alignSelf: 'center'
    },
    couponsLineStyle: {
        marginLeft: px2dp(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: '100%'
    }
});
