import React, { Component } from 'react';
import {
    View, Alert, Keyboard, TouchableWithoutFeedback,
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import GoodsListItem from './GoodsListItem';
import SingleSelectionModal from './BottomSingleSelectModal';
import Toast from '../../../utils/bridge';
import OrderApi from '../api/orderApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';
import RouterMap from '../../../navigation/RouterMap';
import { payStatus, payment, payStatusMsg } from '../../payment/Payment';
import { NavigationActions } from 'react-navigation';
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';
import RefreshFlatList from '../../../comm/components/RefreshFlatList';
import { clickOrderAgain, clickOrderConfirmReceipt, clickOrderLogistics } from '../order/CommonOrderHandle';
import CancelProdectsModal from './orderDetail/CancelProdectsModal';
import { orderDetailModel } from '../model/OrderDetailModel';
import ScreenUtils from '../../../utils/ScreenUtils';
import { OrderType } from '../order/OrderType';
const emptyIcon = res.kongbeuye_dingdan;

@SmoothPushPreLoadHighComponent
export default class MyOrdersListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeOff: [],//待付款时间
            pageStatus: this.props.pageStatus,
        };
        this.item = {};

    }

    onRefresh = () => {
        this.list && this.list.onRefresh();
    }

    render() {
        let { pageStatus } = this.state;
        let params ={
            status: pageStatus > 0? pageStatus: '',
            commentStatus:  pageStatus > 3 ? true : '',
            keywords: this.props.keywords || '',
            orderNo: ''
        };
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                <RefreshFlatList
                    ref={ref=> {this.list = ref}}
                    url={OrderApi.queryPage}
                    paramsFunc={()=> {return params}}
                    renderItem={this.renderItem}
                    renderError={(error) => this.renderError(error)}
                    defaultEmptyImage={emptyIcon}
                    defaultEmptyText={'暂无订单'}
                    renderHeader={()=>{return <View style={{ height: 10 }}/>}}
                    handleRequestResult={(data)=>{return this.handleRequestResult(data)}}
                    totalPageNum={(result) => {
                        return result.data.isMore ? 10 : 0;
                    }}
                    onStartRefresh={()=> {Toast.showLoading()}}
                    onEndRefresh={() => {Toast.hiddenLoading()}}
                    emptyHeight={ScreenUtils.height - ScreenUtils.headerHeight - 200}
                />
                {this.renderModal()}
                <CancelProdectsModal ref={(ref) => {
                    this.cancelProdectsModal = ref;
                }}
                />
            </View>
        );
    }
    //对数据进行排空处理
    handleRequestResult = (result) => {
        let data = result.data.data || [];
        return data.map(item => {
            item.baseInfo = item.baseInfo || {};
            item.merchantOrder = item.merchantOrder || {};
            item.merchantOrder.productOrderList = item.merchantOrder.productOrderList||[];
            item.payInfo = item.payInfo || {};
            item.receiveInfo = item.receiveInfo || {};
            return item;
        })
    }

    renderItem = ({ item, index }) => {
        return (
            <GoodsListItem
                {...item}
                clickItem={() => {
                    this.clickItem(item, index);
                }}
                goodsItemClick={() => this.clickItem(item, index)}
                operationMenuClick={(menu) => this.operationMenuClick(menu, index, item)}
                callBack={() => {
                    // this.onRefresh();
                }}
            />
        );
    };

    renderError(error) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <Image source={res.placeholder.netError}
                           style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                           resizeMode={'contain'}/>
                    <Text style={styles.titleStyle} allowFontScaling={false}>
                        {error.msg}
                    </Text>
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnStyle}
                                      onPress={() => this.onRefresh()}>
                        <Text style={{
                            color: DesignRule.bgColor_btn,
                            fontSize: DesignRule.fontSize_mediumBtnText
                        }} allowFontScaling={false}>
                            重新加载
                        </Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderModal = () => {
        return (
            <SingleSelectionModal
                ref={(ref) => {
                    this.cancelModal = ref;
                }}
                detail={this.props.cancelReasons}
                commit={(index) => {
                    this.cancelOrder(index)
                }}
            />

        );
    };

    cancelOrder = (index) => {
        Toast.showLoading();
        OrderApi.cancelOrder({
            cancelReason: this.props.cancelReasons[index],
            platformOrderNo: this.item.merchantOrder.platformOrderNo,
        }).then((response) => {
            Toast.hiddenLoading();
            if (response.code === 10000) {
                Toast.$toast('订单已取消');
                this.onRefresh();
            } else {
                Toast.$toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
            Toast.$toast(e.msg);
        });

    }


    clickItem = (data,index) => {
            orderDetailModel.handleData(data);
            this.props.nav('order/order/MyOrdersDetailPage', {
                merchantOrderNo: data.merchantOrder.merchantOrderNo,
                dataHandleConfirmOrder: ()=>this.dataHandleConfirmOrder(data, index),
                dataHandleDeleteOrder: ()=>this.dataHandleDeleteOrder(data,index)
            });
    };
    operationMenuClick = (menu, index, data) => {
        /*
         * operation checklist
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
        this.item = data;
        let orderProduct = data.merchantOrder.productOrderList || [];
        let merchantOrderNo = data.merchantOrder.merchantOrderNo;
        let platformOrderNo = data.merchantOrder.platformOrderNo;
        let subStatus = data.merchantOrder.subStatus
        switch (menu.id) {
            case 1:
                if (this.props.cancelReasons.length > 0) {
                    this.cancelProdectsModal && this.cancelProdectsModal.open(platformOrderNo,()=>{this.cancelModal &&this.cancelModal.open()});
                } else {
                    Toast.$toast('无取消理由');
                }

                break;
            case 2:
                this.cancelProdectsModal && this.cancelProdectsModal.open(platformOrderNo,()=>{ this._goToPay(data)}, true);
                break;
            case 3:
                this.cancelProdectsModal && this.cancelProdectsModal.open(platformOrderNo,()=>{ this._goToPay(data)}, true);
                break;
            case 4:
                this.cancelProdectsModal && this.cancelProdectsModal.open(platformOrderNo,()=>{ this._goToPay(data), true});
                break;
            case 5:
                clickOrderLogistics(merchantOrderNo)
                break;
            case 6:
                clickOrderConfirmReceipt(merchantOrderNo,subStatus, this.dataHandleConfirmOrder(data, index))
                break;
            case 7:
            case 9:
                Alert.alert('', `确定删除此订单？`, [
                    {
                        text: `取消`, onPress: () => {
                        }
                    },
                    {
                        text: `确定`, onPress: () => {
                            Toast.showLoading();
                            OrderApi.deleteOrder({ merchantOrderNo: merchantOrderNo}).then((response) => {
                                Toast.hiddenLoading();
                                Toast.$toast('订单已删除！');
                                this.dataHandleDeleteOrder(data, index);
                            }).catch(e => {
                                Toast.hiddenLoading();
                                Toast.$toast(e.msg);
                            });
                        }
                    }

                ], { cancelable: true });
                break;
            case 8:
                clickOrderAgain(merchantOrderNo, orderProduct)
                break;
            case 10:
                OrderApi.checkInfo({ warehouseOrderNo: merchantOrderNo}).then(res => {
                    if (res.data) {
                        this.props.nav(RouterMap.P_ScorePublishPage, {
                            orderNo: merchantOrderNo
                        });
                    } else {
                        Toast.$toast('该商品已晒过单！');
                        this.onRefresh();
                    }

                }).catch(e => {
                    Toast.$toast(e.msg);
                });
                break;
            case 99:
                this.clickItem(data, index)
                break
        }

    };

    async _goToPay(data) {
        let orderProduct = data.merchantOrder.productOrderList || [];
        let merchantOrderNo = data.merchantOrder.merchantOrderNo;
        let platformOrderNo = data.merchantOrder.platformOrderNo;
        //从订单发起的都是普通支付
        let result = await payment.checkOrderStatus(platformOrderNo,0,0,0,'');
        // return;
        if (result.code === payStatus.payNo) {
            this.props.nav('payment/PaymentPage', {
                orderNum: merchantOrderNo,
                amounts: result.unpaidAmount,
                platformOrderNo: platformOrderNo,
                orderProductList: orderProduct
            });
        } else if (result.code === payStatus.payNeedThrid) {
            this.props.nav('payment/ChannelPage', {
                remainMoney: Math.floor(result.unpaidAmount * 100) / 100,
                orderNum: merchantOrderNo,
                platformOrderNo: platformOrderNo,
                orderProductList: orderProduct
            });
        } else if (result.code === payStatus.payOut) {
            Toast.$toast(payStatusMsg[result.code]);
            let replace = NavigationActions.replace({
                key: this.props.navigation.state.key,
                routeName: 'order/order/MyOrdersListPage',
                params: { index: 2 }
            });
            this.props.navigation.dispatch(replace);
        } else {
            Toast.$toast(payStatusMsg[result.code] || '系统处理失败');
        }
    }

    /** 本地数据处理*/
    dataHandleDeleteOrder =  (item, index) => {
     if(this.list){
        let data = this.list.getSourceData();
        data.splice(index, 1);
        this.list.changeData([...data])
     }
    }
    //确认收货
    dataHandleConfirmOrder =  (item, index) => {
        if (this.props.pageStatus !== 0){//如果不是在全部里面确认收货，就走删除逻辑
            this.dataHandleDeleteOrder(item, index);
            return;
        }
        if(this.list){
            let data = this.list.getSourceData();
            if (data[index].merchantOrder){
                data[index].merchantOrder.status = OrderType.COMPLETED;
                this.list.changeData([...data])
            }
        }
    }
}

const styles = StyleSheet.create({
    errContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 10,
        textAlign: 'center'
    },
    btnText: {
        fontSize: 15,
        color: DesignRule.mainColor,
        textAlign: 'center'
    },
    btnStyle: {
        height: 36,
        width: 115,
        borderRadius: 18,
        borderColor: DesignRule.bgColor_btn,
        borderWidth: DesignRule.lineHeight * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    }
});
