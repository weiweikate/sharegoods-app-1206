import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView, Text, Alert
} from 'react-native';
import BasePage from '../../../BasePage';
import { RefreshList, NoMoreClick, UIText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import GoodsDetailItem from '../components/GoodsDetailItem';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import Toast from '../../../utils/bridge';
// import GoodsGrayItem from "../components/GoodsGrayItem";
import OrderApi from '../api/orderApi';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { NavigationActions } from 'react-navigation';
import DesignRule from '../../../constants/DesignRule';
import MineApi from '../../mine/api/MineApi';
import { getDateData, leadingZeros } from '../components/orderDetail/OrderCutDown';
import res from '../res';
import OrderDetailStatusView from '../components/orderDetail/OrderDetailStatusView';
// import OrderDetailStateView from "../components/orderDetail/OrderDetailStateView";
import DetailAddressView from '../components/orderDetail/DetailAddressView';
import OrderDetailPriceView from '../components/orderDetail/OrderDetailPriceView';
import OrderDetailTimeView from '../components/orderDetail/OrderDetailTimeView';
import OrderDetailBottomButtonView from '../components/orderDetail/OrderDetailBottomButtonView';
import { orderDetailModel, orderDetailAfterServiceModel, assistDetailModel } from '../model/OrderDetailModel';
import { observer } from 'mobx-react';
import GiftHeaderView from '../components/orderDetail/GiftHeaderView';
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';

const buyerHasPay = res.buyerHasPay;
const productDetailHome = res.productDetailHome;
const productDetailMessage = res.productDetailMessage;
const tobePayIcon = res.dingdanxiangqing_icon_fuk;
const finishPayIcon = res.dingdanxiangqing_icon_yiwangcheng;
const hasDeliverIcon = res.dingdanxiangqing_icon_yifehe;
const refuseIcon = res.dingdanxiangqing_icon_guangbi;
const moreIcon = res.message_three;
const deleteIcon = res.delete_icon;

const { px2dp } = ScreenUtils;

@SmoothPushPreLoadHighComponent
@observer
export default class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            expressNo: '',
            viewData: {},
            menu: {},
            giftBagCoupons: []
        };
        orderDetailAfterServiceModel.menu = [];
    }

    $navigationBarOptions = {
        title: '订单详情',
        show: true// false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: orderDetailModel.loadingState,
            netFailedProps: {
                netFailedInfo: orderDetailModel.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    _reload = () => {
        orderDetailModel.netFailedInfo = null;
        orderDetailModel.netFailedInfo = PageLoadingState.loading;
        this.loadPageData();
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore} style={{
                width: px2dp(40),
                height: px2dp(44),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image source={moreIcon}/>
            </TouchableOpacity>
        );
    };


    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
        // DeviceEventEmitter.removeAllListeners("OrderNeedRefresh");
        this.stop();
    }

    showMore = () => {
        this.setState({ isShowShowMessageModal: true });
        this.messageModal && this.messageModal.open();
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        let leftIconArr = [buyerHasPay, tobePayIcon, buyerHasPay, hasDeliverIcon, finishPayIcon, refuseIcon, refuseIcon, refuseIcon, refuseIcon, refuseIcon];
        return (
            <View style={{ marginBottom: px2dp(10) }}>
                <OrderDetailStatusView
                    leftTopIcon={leftIconArr[orderDetailModel.status]}
                />
                <DetailAddressView/>
                {/*<OrderDetailStateView*/}
                {/*nav={this.$navigate}*/}
                {/*/>*/}
            </View>

        );
    };

    componentDidMount() {
        // DeviceEventEmitter.addListener("OrderNeedRefresh", () => this.loadPageData());
        this.didFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocusSubscriptionMyOrdersDetailPage', payload);
                if (state && state.routeName === 'order/order/MyOrdersDetailPage') {
                    this.loadPageData();

                }
            });
        this.getCancelOrder();

    }


    getCancelOrder() {
        let arrs = [];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
            if (StringUtils.isNoEmpty(res.data)) {
                res.data.map((item, i) => {
                    arrs.push(item.value);
                });
                assistDetailModel.getCancelArr(arrs);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    onRefresh = () => {
        this.loadPageData();
    };

    operationDelete() {
        Alert.alert('', '确定删除此订单吗?', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    Toast.showLoading();
                    OrderApi.deleteOrder({ orderNo: orderDetailModel.getOrderNo() }).then((response) => {
                        Toast.hiddenLoading();
                        Toast.$toast('订单已删除');
                        this.$navigateBack();
                    }).catch(e => {
                        Toast.hiddenLoading();
                        Toast.$toast(e.msg);
                    });

                }
            }

        ], { cancelable: true });
    }

    _renderContent = () => {
        if (orderDetailModel.deleteInfo) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={deleteIcon} style={{ width: px2dp(82), height: px2dp(82) }}/>
                        <Text style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: px2dp(13),
                            marginTop: 5
                        }}>该订单已删除！</Text>
                    </View>

                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <RefreshList
                            ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={this.renderFooter}
                            data={this.state.viewData}
                            renderItem={this.renderItem}
                            onRefresh={this.onRefresh}
                            onLoadMore={this.onLoadMore}
                            extraData={this.state}
                            isEmpty={this.state.isEmpty}

                            emptyTip={'暂无数据！'}
                        />
                    </ScrollView>
                    <OrderDetailBottomButtonView
                        goBack={() => this.$navigateBack()}
                        nav={this.$navigate}
                        switchButton={() => {
                            this.setState({ showDele: !this.state.showDele });
                        }}
                        navigation={this.props.navigation}
                        callBack={this.params.callBack && (() => this.params.callBack())}
                        loadPageData={() => this.loadPageData()}/>
                    {!this.state.showDele ? null : <NoMoreClick style={{
                        width: 68,
                        height: 32,
                        position: 'absolute',
                        bottom: 45,
                        left: 29,
                        backgroundColor: DesignRule.textColor_instruction,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5
                    }} onPress={() => {
                        this.operationDelete(), this.setState({ showDele: false });
                    }}>
                        <UIText value={'删除订单'} style={{ color: 'white', fontSize: 13 }}/>
                    </NoMoreClick>}
                </View>
            );
        }

    };

    _render = () => {
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
                {this.renderModal()}
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        return (
            <GoodsDetailItem
                uri={item.uri}
                goodsName={item.goodsName}
                salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                category={item.category}
                goodsNum={item.goodsNum}
                activityCodes={item.activityCodes}
                style={{ backgroundColor: 'white' }}
                clickItem={() => {
                    this.clickItem(index, item);
                }}
                afterSaleService={item.afterSaleService}
                afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, index)}
            />
        );

    };
    renderHeader = () => {
        return (
            <View>
                {this.renderState()}
                {/*{orderDetailModel.status > 1 &&orderDetailModel.status<5? <DetailAddressView/> : null}*/}
                <GiftHeaderView/>
            </View>
        );
    };
    renderFooter = () => {
        return (
            <View>
                <OrderDetailPriceView
                    giftBagCoupons={this.state.giftBagCoupons}/>
                <OrderDetailTimeView/>
            </View>
        );

    };
    renderModal = () => {
        return (
            <View>
                <ShowMessageModal
                    isShow={this.state.isShowShowMessageModal}
                    detail={[
                        { icon: productDetailMessage, title: '消息' },
                        { icon: productDetailHome, title: '首页' }
                    ]}
                    ref={(ref) => this.messageModal = ref}
                    clickSelect={(index) => {
                        switch (index) {
                            case 0:
                                this.$navigate('message/MessageCenterPage');
                                break;
                            case 1:
                                let resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                                    ]
                                });
                                this.props.navigation.dispatch(resetAction);
                                break;
                        }
                        this.setState({ isShowShowMessageModal: false });
                    }}
                    closeWindow={() => this.setState({ isShowShowMessageModal: false })}
                />
                <SingleSelectionModal
                    isShow={assistDetailModel.isShowSingleSelctionModal}
                    ref={(ref) => {
                        this.cancelModal = ref;
                    }}
                    detail={assistDetailModel.cancelArr}
                    closeWindow={() => {
                        assistDetailModel.setIsShowSingleSelctionModal(false);
                    }}
                    commit={(index) => {
                        assistDetailModel.setIsShowSingleSelctionModal(false);
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            cancelReason: assistDetailModel.cancelArr[index],
                            orderNo: orderDetailModel.getOrderNo(),
                            cancelType: 2,
                            platformRemarks: null
                        }).then((response) => {
                            this.goTobackNav();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            Toast.$toast(e.msg);
                        });
                    }}
                />
            </View>

        );
    };
    goTobackNav = () => {
        Toast.hiddenLoading();
        this.params.callBack && this.params.callBack();
        this.$navigateBack();
    };

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };


    settimer(overtimeClosedTime) {
        let autoConfirmTime = Math.round((overtimeClosedTime - orderDetailModel.warehouseOrderDTOList[0].nowTime) / 1000);
        if (autoConfirmTime < 0) {
            orderDetailAfterServiceModel.moreDetail = '';
            return;
        }
        let closeTime = autoConfirmTime + Date.parse(new Date()) / 1000;
        this.interval = setInterval(() => {
            let time = getDateData(closeTime);
            if (time.sec >= 0) {
                if (orderDetailModel.status === 1) {
                    orderDetailAfterServiceModel.moreDetail = leadingZeros(time.hours) + ':' + leadingZeros(time.min) + ':' + leadingZeros(time.sec) + '后自动取消订单';
                } else if (orderDetailModel.status === 3) {
                    orderDetailAfterServiceModel.moreDetail = time.days + '天' + leadingZeros(time.hours) + ':' + leadingZeros(time.min) + ':' + leadingZeros(time.sec) + '后自动确认收货';
                }
            } else {
                orderDetailAfterServiceModel.moreDetail = '';
                this.loadPageData();
            }
        }, 1000);
    }

    stop() {
        orderDetailAfterServiceModel.moreDetail = '';
        this.interval && clearInterval(this.interval);
    }

    //**********************************BusinessPart******************************************
    getAfterSaleService = (data, index) => {
        //售后状态
        let afterSaleService = [];
        let outStatus = orderDetailModel.status;
        let condition = (data.orderCustomerServiceInfoDTO && data.orderCustomerServiceInfoDTO.type) || null;
        let innerStatus = (data.orderCustomerServiceInfoDTO && data.orderCustomerServiceInfoDTO.status) || null;
        switch (outStatus) {
            case 2:
                if (innerStatus === 5 && condition) {
                    afterSaleService.push({
                        id: 2,
                        operation: '退款成功',
                        isRed: false
                    });
                } else if (innerStatus >= 1 && innerStatus <= 4) {
                    afterSaleService.push({
                        id: 2,
                        operation: '退款中',
                        isRed: false
                    });
                } else {
                    afterSaleService.push({
                        id: 0,
                        operation: '退款',
                        isRed: false
                    });
                }

                break;

            case 3:
            case 4:
                console.log('data.orderCustomerServiceInfoVO', data.orderCustomerServiceInfoDTO);
                if (innerStatus === 6) {
                    afterSaleService.push({
                        id: 1,
                        operation: '退换',
                        isRed: false
                    });
                    return orderDetailAfterServiceModel.currentAsList = afterSaleService;
                }
                switch (condition) {
                    case 1://申请退款
                        afterSaleService.push({
                            id: 2,
                            operation: innerStatus === 5 ? '退款成功' : '退款中',
                            isRed: false
                        });
                        break;
                    case 2://申请退货
                        afterSaleService.push({
                            id: 3,
                            operation: innerStatus === 5 ? '售后完成' : '退货中',
                            isRed: false
                        });
                        break;
                    case 3://申请换货
                        afterSaleService.push({
                            id: 6,
                            operation: innerStatus === 5 ? '售后完成' : '换货中',
                            isRed: false
                        });
                        break;
                    default:
                        afterSaleService.push({
                            id: 1,
                            operation: '退换',
                            isRed: false
                        });
                }
                break;
            case 5:
                if (condition > 0) {
                    afterSaleService.push({
                        id: 6,
                        operation: innerStatus > 5 ? '售后关闭' : '售后完成',
                        isRed: false
                    });
                } else {
                    afterSaleService.push();
                }
                break;
        }
        return orderDetailAfterServiceModel.currentAsList = afterSaleService;
    };

    async loadPageData() {
        this.stop();
        Toast.showLoading();
        let result = await orderDetailModel.loadDetailInfo(this.params.orderNo) || {};
        console.log('loadPageData', result);
        Toast.hiddenLoading();
        let dataArr = [];
        let pageStateString = orderDetailAfterServiceModel.AfterServiceList[parseInt(orderDetailModel.warehouseOrderDTOList[0].status)];
        orderDetailModel.warehouseOrderDTOList.map((resp, index1) => {
            resp.products.map((item, index) => {
                dataArr.push({
                    productId: item.id,
                    uri: item.specImg,
                    goodsName: item.productName,
                    salePrice: StringUtils.isNoEmpty(item.unitPrice) ? item.unitPrice : 0,
                    category: item.spec,
                    goodsNum: item.quantity,
                    afterSaleService: this.getAfterSaleService(item, index),
                    status: item.status,
                    activityCode: orderDetailModel.warehouseOrderDTOList[0].status === 1 ? item.activityCode : item.skuCode,
                    activityCodes: item.activityCodes
                });
            });
        });
        this.setState({ viewData: dataArr });
        /*
         * operationMenuCheckList
         * 去支付                 ->  1
         * 待发货                   ->  2
         * 已发货                 ->  3
         * 交易完成                 ->  4
         * 交易关闭                 ->  5
         * */
        switch (parseInt(orderDetailModel.warehouseOrderDTOList[0].status)) {
            case 1:
                this.stop();
                this.settimer(orderDetailModel.warehouseOrderDTOList[0].cancelTime);
                orderDetailAfterServiceModel.menu = [{
                    id: 1,
                    operation: '取消订单',
                    isRed: false
                }, {
                    id: 2,
                    operation: '去支付',
                    isRed: true
                }];
                break;
            case 2:
                orderDetailAfterServiceModel.moreDetail = '';
                orderDetailAfterServiceModel.menu = [];
                break;
            case 3:
                this.stop();
                this.settimer(orderDetailModel.warehouseOrderDTOList[0].autoReceiveTime);
                orderDetailAfterServiceModel.menu = [
                    {
                        id: 5,
                        operation: '查看物流',
                        isRed: false
                    }, {
                        id: 6,
                        operation: '确认收货',
                        isRed: true
                    }
                ];
                if (orderDetailModel.expList.length === 0) {
                    pageStateString.sellerState = '等待平台发货';
                } else if (orderDetailModel.expList.length === 1 && orderDetailModel.unSendProductInfoList.length === 0) {
                    OrderApi.findLogisticsDetail({ expressNo: orderDetailModel.expList[0].expNO, expressCode:orderDetailModel.expList[0].expressCode}).then((response) => {
                        console.log(response);
                        pageStateString.sellerState = response.data.list[0].status || '等待平台发货';
                    }).catch(e => {
                        pageStateString.sellerState = '等待平台发货';
                    });
                } else {
                    pageStateString.sellerState = `该订单已拆成${orderDetailModel.expList.length + (orderDetailModel.unSendProductInfoList.length >= 1 ? 1 : 0)}个包裹发出，点击"查看物流"可查看详情`;
                }

                break;
            case 4:
                this.stop();
                pageStateString.sellerState = '已签收';
                orderDetailAfterServiceModel.moreDetail = '';
                orderDetailAfterServiceModel.menu = [
                    {
                        id: 5,
                        operation: '查看物流',
                        isRed: false
                    }, {
                        id: 8,
                        operation: '再次购买',
                        isRed: true
                    }
                ];
                if (orderDetailModel.warehouseOrderDTOList[0].commentStatus) {
                    orderDetailAfterServiceModel.menu.push({
                        id: 10,
                        operation: '晒单',
                        isRed: true
                    });
                }
                pageStateString.logisticsTime = orderDetailModel.warehouseOrderDTOList[0].deliverTime ? orderDetailModel.warehouseOrderDTOList[0].deliverTime : orderDetailModel.warehouseOrderDTOList[0].autoReceiveTime;
                break;
            case 5:
                this.stop();
                orderDetailAfterServiceModel.menu = [
                    {
                        id: 7,
                        operation: '删除订单',
                        isRed: false
                    }, {
                        id: 8,
                        operation: '再次购买',
                        isRed: true
                    }],
                    orderDetailAfterServiceModel.moreDetail = orderDetailModel.warehouseOrderDTOList[0].cancelReason;
                pageStateString.logisticsTime = orderDetailModel.warehouseOrderDTOList[0].cancelTime;
                break;

        }
        orderDetailAfterServiceModel.totalAsList = pageStateString;
    }

    clickItem = (index, item) => {
        console.log('clickItem', index, item);
        switch (orderDetailModel.productsList()[index].orderSubType) {
            case 1://秒杀
            case 2://降价拍
                this.$navigate('product/ProductDetailPage', {
                    activityType: orderDetailModel.productsList()[index].orderSubType,
                    activityCode: orderDetailModel.productsList()[index].activityCode//
                });
                break;
            case 3://
            case 4:
                this.$navigate('topic/TopicDetailPage', {
                    activityType: orderDetailModel.productsList()[index].orderSubType,
                    activityCode: orderDetailModel.productsList()[index].activityCode
                });
                break;
            default://普通商品
                this.$navigate('product/ProductDetailPage', { productCode: orderDetailModel.productsList()[index].prodCode });
                break;
        }
    };
    afterSaleServiceClick = (menu, index) => {
        console.log(menu, index);
        let products = orderDetailModel.warehouseOrderDTOList[0].products[index];
        let innerStatus = (products.orderCustomerServiceInfoDTO && products.orderCustomerServiceInfoDTO.status) || null;
        if (!StringUtils.isEmpty(products.activityCodes) && products.activityCodes[0].orderType === 3 && orderDetailModel.status === 2) {
            Toast.$toast('该商品属于升级礼包产品，不能退款');
            return;
        } else if (!StringUtils.isEmpty(products.activityCodes) && products.activityCodes[0].orderType === 5 && orderDetailModel.status === 2) {//products.activityCodes[0].orderType=== 5
            Toast.$toast('该商品属于经验值专区商品，不能退款');
            return;
        } else if (orderDetailModel.status > 3 && products.afterSaleTime < orderDetailModel.warehouseOrderDTOList[0].nowTime && orderDetailModel.warehouseOrderDTOList[0].nowTime
            && !(innerStatus < 6 && innerStatus >= 1)) {
            Toast.$toast('该商品售后已过期');
            return;
        }


        switch (menu.id) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    orderProductNo: products.orderProductNo
                });

                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServiceHomePage', {
                    pageData: {
                        ...products,
                        orderSubType: StringUtils.isEmpty(products.activityCodes) ? -1 : products.activityCodes[0].orderType
                    }
                    //-1代表普通商品
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    serviceNo: products.orderCustomerServiceInfoDTO.serviceNo
                });
                break;
            case 3:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    serviceNo: products.orderCustomerServiceInfoDTO.serviceNo
                });
                break;
            case 6:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    serviceNo: products.orderCustomerServiceInfoDTO.serviceNo
                });
                break;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    grayView: {
        width: px2dp(90),
        height: px2dp(30),
        borderRadius: px2dp(15),
        backgroundColor: 'white',
        // borderStyle: "solid",
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg,
        marginRight: px2dp(15),
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    }, grayText: {
        fontSize: px2dp(13),
        lineHeight: px2dp(18),
        color: DesignRule.textColor_secondTitle
    },
    topOrderDetail: {
        minHeight: px2dp(81),
        marginTop: px2dp(69),
        backgroundColor: 'white',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        borderRadius: px2dp(10),
        justifyContent: 'center'
    }
});
