import React from "react";
import {
    NativeModules,
    StyleSheet,
    View,
    TouchableOpacity,
    Image, DeviceEventEmitter
} from "react-native";
import BasePage from "../../../BasePage";
import { RefreshList } from "../../../components/ui";
import StringUtils from "../../../utils/StringUtils";
import ScreenUtils from "../../../utils/ScreenUtils";
import { TimeDownUtils } from "../../../utils/TimeDownUtils";
import GoodsDetailItem from "../components/GoodsDetailItem";
import SingleSelectionModal from "../components/BottomSingleSelectModal";
import ShowMessageModal from "../components/ShowMessageModal";
import Toast from "../../../utils/bridge";
import GoodsGrayItem from "../components/GoodsGrayItem";
import OrderApi from "../api/orderApi";
// import user from "../../../model/user";
import { NavigationActions } from "react-navigation";
import DesignRule from "DesignRule";
import MineApi from "../../mine/api/MineApi";
import res from "../res";
import OrderDetailStatusView from "../components/orderDetail/OrderDetailStatusView";
import OrderDetailStateView from "../components/orderDetail/OrderDetailStateView";
import DetailAddressView from "../components/orderDetail/DetailAddressView";
import OrderDetailPriceView from "../components/orderDetail/OrderDetailPriceView";
import OrderDetailTimeView from "../components/orderDetail/OrderDetailTimeView";
import OrderDetailBottomButtonView from "../components/orderDetail/OrderDetailBottomButtonView";
import { orderDetailModel, orderDetailAfterServiceModel, assistDetailModel } from "../model/OrderDetailModel";
import { observer } from "mobx-react/native";
import GiftHeaderView from "../components/orderDetail/GiftHeaderView";

const buyerHasPay = res.buyerHasPay;
const productDetailHome = res.productDetailHome;
const productDetailMessage = res.productDetailMessage;
const tobePayIcon = res.dingdanxiangqing_icon_fuk;
const finishPayIcon = res.dingdanxiangqing_icon_yiwangcheng;
const hasDeliverIcon = res.dingdanxiangqing_icon_yifehe;
const refuseIcon = res.dingdanxiangqing_icon_guangbi;
const moreIcon = res.message_three;
const timeUtils = new TimeDownUtils();
const { px2dp } = ScreenUtils;


@observer
export default class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            orderId: this.params.orderId,
            expressNo: "",
            viewData: {},
            menu: {},
            giftBagCoupons: [],
            cancelArr: []
        };
        assistDetailModel.setOrderId(this.params.orderId);
    }

    $navigationBarOptions = {
        title: "订单详情",
        show: true// false则隐藏导航
    };
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore} style={{
                width: px2dp(40),
                height: px2dp(44),
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Image source={moreIcon} />
            </TouchableOpacity>
        );
    };
    showMore = () => {
        this.setState({ isShowShowMessageModal: true });
        this.messageModal && this.messageModal.open();
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        let leftIconArr = [buyerHasPay, tobePayIcon, buyerHasPay, hasDeliverIcon, finishPayIcon, finishPayIcon, refuseIcon, refuseIcon, refuseIcon, refuseIcon];
        return (
            <View style={{ marginBottom: px2dp(10) }}>
                <OrderDetailStatusView
                    leftTopIcon={leftIconArr[orderDetailModel.status]}
                />
                <OrderDetailStateView
                    nav={this.$navigate}
                />
            </View>

        );
    };

    componentDidMount() {
        DeviceEventEmitter.addListener("OrderNeedRefresh", () => this.loadPageData());
        this.loadPageData();
        this.getCancelOrder();

    }

    getCancelOrder() {
        let arrs = [];
        MineApi.queryDictionaryTypeList({ code: "QXDD" }).then(res => {
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

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners("OrderNeedRefresh");
        timeUtils.stop();
    }

    _render = () => {
        return (
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={orderDetailModel.orderType === 5 || orderDetailModel.orderType === 98 ? this.state.viewData : this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={"暂无数据！"}
                />
                {this.renderModal()}
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        if (orderDetailModel.orderSubType === 3) {
            return (
                <GoodsGrayItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    category={item.category}
                    salePrice={"￥" + StringUtils.formatMoneyString(item.salePrice, false)}
                    goodsNum={item.goodsNum}
                    onPress={() => this.clickItem(index,item)}
                    style={{ backgroundColor: "white" }}
                />
            );
        } else {
            return (
                <GoodsDetailItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    salePrice={"￥" + StringUtils.formatMoneyString(item.salePrice, false)}
                    category={item.category.replace(/@/g, '')}
                    goodsNum={item.goodsNum}
                    style={{backgroundColor:'white'}}
                    clickItem={() => {
                        this.clickItem( index,item);
                    }}
                    afterSaleService={item.afterSaleService}
                    afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, index)}
                />
            );
        }

    };
    renderHeader = () => {
        return (
            <View>
                {this.renderState()}
                {orderDetailModel.status > 1 ? <DetailAddressView/> : null}
                <GiftHeaderView
                    giftPackageName={this.state.giftPackageName}/>
            </View>
        );
    };
    renderFootder = () => {
        return (
            <View>
                <OrderDetailPriceView
                    giftBagCoupons={this.state.giftBagCoupons}/>
                <OrderDetailTimeView/>
                <OrderDetailBottomButtonView
                    goBack={() => this.$navigateBack()}
                    nav={this.$navigate}
                    callBack={this.params.callBack && this.params.callBack()}
                    loadPageData={() => this.loadPageData()}/>
            </View>
        )

    };
    renderModal = () => {
        return (
            <View>
                <ShowMessageModal
                    isShow={this.state.isShowShowMessageModal}
                    detail={[
                        { icon: productDetailMessage, title: "消息" },
                        { icon: productDetailHome, title: "首页" }
                    ]}
                    ref={(ref) => this.messageModal = ref}
                    clickSelect={(index) => {
                        switch (index) {
                            case 0:
                                this.$navigate("message/MessageCenterPage");
                                break;
                            case 1:
                                let resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: "Tab" })//要跳转到的页面名字
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
                            cancelType:2,
                            platformRemarks:null
                        }).then((response) => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast("订单已取消");
                            this.$navigateBack();
                            this.params.callBack && this.params.callBack();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast(e.msg);
                        });
                    }}
                />
            </View>

        );
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
    //28:45:45后自动取消订单
    startCutDownTime = (overtimeClosedTime) => {
        let autoConfirmTime = Math.round((overtimeClosedTime - orderDetailModel.warehouseOrderDTOList[0].nowTime) / 1000);
        if (autoConfirmTime < 0) {
            orderDetailAfterServiceModel.moreDetail = "";
            return;
        }
        timeUtils.settimer((time) => {
            orderDetailAfterServiceModel.moreDetail = time.hours + ":" + time.min + ":" + time.sec + "后自动取消订单";
            console.log(orderDetailAfterServiceModel.totalAsList);
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                orderDetailAfterServiceModel.moreDetail = "";
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //06天18:24:45后自动确认收货
    startCutDownTime2 = (autoReceiveTime2) => {
        let autoConfirmTime = Math.round((autoReceiveTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            orderDetailAfterServiceModel.moreDetail = "";
            return;
        }
        timeUtils.settimer(time => {
            orderDetailAfterServiceModel.moreDetail = time.days + "天" + time.hours + ":" + time.min + ":" + time.sec + "后自动确认收货";
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                orderDetailAfterServiceModel.totalAsList = orderDetailAfterServiceModel.AfterServiceList[5];
                orderDetailAfterServiceModel.moreDetail = "";
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //**********************************BusinessPart******************************************
    getAfterSaleService = (data, index) => {
        //售后状态
        let afterSaleService = [];
        let outStatus = orderDetailModel.status
        switch(outStatus) {
            case 2:
                afterSaleService.push({
                    id: 0,
                    operation: "退款",
                    isRed: false
                });
                break;

            case 3:
            case 4:
                let condition = (data.orderCustomerServiceInfoVO && data.orderCustomerServiceInfoVO.type) || null;
                switch (condition) {
                    case 1://申请退款
                        afterSaleService.push({
                            id: 2,
                            operation: data.status === 5 ? "退款成功" : "退款中",
                            isRed: false
                        });
                        break;
                    case 2://申请退货
                        afterSaleService.push({
                            id: 3,
                            operation: data.status === 5 ? "售后完成" : "退货中",
                            isRed: false
                        });
                        break;
                    case 3://申请换货
                        afterSaleService.push({
                            id: 6,
                            operation:  data.status === 5 ? "售后完成" : "换货中",
                            isRed: false
                        });
                        break;
                    default:
                        afterSaleService.push({
                            id: 1,
                            operation: "退换",
                            isRed: false
                        });
                }
                break;
            case 5:
                afterSaleService.push();
                break;



            // let statusArr = [4, 16, 8];
            // let isAfterSale = (data[index].restrictions & statusArr[0]) == statusArr[0] && (data[index].restrictions & statusArr[1]) == statusArr[1] &&
            //     (data[index].restrictions & statusArr[2]) == statusArr[2];
            // switch (data[index].status) {
            //     case 2:
            //         if ((data[index].restrictions & statusArr[0]) == statusArr[0]) {
            //             afterSaleService.push();
            //         } else {
            //             afterSaleService.push({
            //                 id: 0,
            //                 operation: "退款",
            //                 isRed: false
            //             });
            //         }
            //
            //         break;
            //     case 3:
            //     case 4:
            //         if (isAfterSale) {
            //             afterSaleService.push();
            //         } else {
            //             switch (data[index].returnType) {
            //                 case 1://申请退款
            //                     afterSaleService.push({
            //                         id: 2,
            //                         operation: "退款中",
            //                         isRed: false
            //                     });
            //                     break;
            //                 case 2://申请退货
            //                     afterSaleService.push({
            //                         id: 3,
            //                         operation: "退货中",
            //                         isRed: false
            //                     });
            //                     break;
            //                 case 3://申请换货
            //                     afterSaleService.push({
            //                         id: 6,
            //                         operation: "换货中",
            //                         isRed: false
            //                     });
            //                     break;
            //                 default:
            //                     afterSaleService.push({
            //                         id: 1,
            //                         operation: "退换",
            //                         isRed: false
            //                     });
            //             }
            //         }
            //         break;
            //     case 5:
            // if (isAfterSale) {
            //     afterSaleService.push();
            // } else if ((data[index].finishTime || 0) - (new Date().valueOf()) < 0) {
            //     afterSaleService.push();
            // }
            // else {
            //     switch (data[index].returnType) {
            //         case 1://申请退款
            //             afterSaleService.push({
            //                 id: 2,
            //                 operation: "退款中",
            //                 isRed: false
            //             });
            //             break;
            //         case 2://申请退货
            //             afterSaleService.push({
            //                 id: 3,
            //                 operation: "退货中",
            //                 isRed: false
            //             });
            //             break;
            //         case 3://申请换货
            //             afterSaleService.push({
            //                 id: 6,
            //                 operation: "换货中",
            //                 isRed: false
            //             });
            //             break;
            //         default:
            //             afterSaleService.push({
            //                 id: 1,
            //                 operation: "退换",
            //                 isRed: false
            //             });
            //     // }
            // }
            // break;
            // case 6:
            //     switch (data[index].returnType) {
            //         case 1://申请退款
            //             afterSaleService.push({
            //                 id: 2,
            //                 operation: "售后完成",
            //                 isRed: false
            //             });
            //             break;
            //         case 2://申请退货
            //             afterSaleService.push({
            //                 id: 3,
            //                 operation: "售后完成",
            //                 isRed: false
            //             });
            //             break;
            //         case 3://申请换货
            //             afterSaleService.push({
            //                 id: 6,
            //                 operation: "售后完成",
            //                 isRed: false
            //             });
            //             break;
            //         default:
            //             afterSaleService.push();
            //     }
            //     break;
            // case 7:
            // case 8:
            //     afterSaleService.push();
            //     break;
            // }
            // return afterSaleService;
        }
        return orderDetailAfterServiceModel.currentAsList = afterSaleService;
    };

    async loadPageData() {
        Toast.showLoading();
        let result = await orderDetailModel.loadDetailInfo(this.params.orderNo);
        // orderDetailModel.loadDetailInfo(this.params.orderNo);
        console.log('loadPageData',result);
        Toast.hiddenLoading();
        let dataArr = [];
        let pageStateString = orderDetailAfterServiceModel.AfterServiceList[parseInt(orderDetailModel.warehouseOrderDTOList[0].status)];
        if (orderDetailModel.warehouseOrderDTOList[0].status === 1) {
            this.startCutDownTime(orderDetailModel.warehouseOrderDTOList[0].cancelTime);
            pageStateString.sellerTime = "收货地址:" + orderDetailModel.province + orderDetailModel.city + orderDetailModel.area + orderDetailModel.address;
            orderDetailAfterServiceModel.menu = [{
                id:1,
                operation:'取消订单',
                isRed:false,
            },{
                id:2,
                operation:'去支付',
                isRed:true,
            }],
            orderDetailModel.warehouseOrderDTOList.map((item,index) =>{
                item.products.map((item,index)=>{
                    dataArr.push({
                        productId: item.id,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.payAmount) ? item.payAmount : 0,
                        category: item.specValues,
                        goodsNum: item.quantity,
                        afterSaleService: this.getAfterSaleService(item, index),
                        status: item.status,
                        activityCode: item.activityCode
                    })
                })
            })

        }else{
            orderDetailModel.warehouseOrderDTOList.map((resp,index1)=>{
                resp.products.map((item,index)=>{
                    dataArr.push({
                        productId: item.id,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.payAmount) ? item.payAmount : 0,
                        category: item.specValues,
                        goodsNum: item.quantity,
                        afterSaleService: this.getAfterSaleService(item, index),
                        status: item.status,
                        activityCode: item.skuCode
                    })
                })
            })
        }
        this.setState({viewData:dataArr})
        console.log('viewdata',dataArr);

        /*
         * operationMenuCheckList
         * 去支付                 ->  1
         * 待发货                   ->  2
         * 已发货                 ->  3
         * 交易完成                 ->  4
         * 交易关闭                 ->  5
         * */
        switch (parseInt(orderDetailModel.warehouseOrderDTOList[0].status)) {
            case 2:
                orderDetailAfterServiceModel.moreDetail = "";
                orderDetailAfterServiceModel.menu = [];
                break;
            case 3:
                this.startCutDownTime2(orderDetailModel.warehouseOrderDTOList[0].autoReceiveTime);
                orderDetailAfterServiceModel.menu = [
                {
                    id:5,
                    operation:'查看物流',
                    isRed:false,
                },{
                    id:6,
                    operation:'确认收货',
                    isRed:true,
                },
            ],
                pageStateString.sellerTime = "";
                break;
            case 4:
                timeUtils.stop();
                pageStateString.sellerState = "已签收";
                orderDetailAfterServiceModel.moreDetail = "";
                orderDetailAfterServiceModel.menu = [
                    {
                        id:7,
                        operation:'删除订单',
                        isRed:false,
                    },{
                        id:8,
                        operation:'再次购买',
                        isRed:true,
                    },
                ],
                pageStateString.logisticsTime = orderDetailModel.warehouseOrderDTOList[0].deliverTime ? orderDetailModel.warehouseOrderDTOList[0].deliverTime : orderDetailModel.warehouseOrderDTOList[0].finishTime;
                break;
            case 5:
                pageStateString.menu = [
                    {
                        id:7,
                        operation:'删除订单',
                        isRed:false,
                    },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
                ],
                    orderDetailAfterServiceModel.moreDetail = orderDetailModel.warehouseOrderDTOList[0].cancelReason;
                timeUtils.stop();
                pageStateString.logisticsTime = orderDetailModel.warehouseOrderDTOList[0].cancelTime;
                break;

        }
        orderDetailAfterServiceModel.totalAsList = pageStateString;
    }

    clickItem = (index, item) => {
        console.log("clickItem", index, item);
        switch (orderDetailModel.productsList()[index].orderSubType) {
            case 1://秒杀
            case 2://降价拍
                this.$navigate("home/product/ProductDetailPage", {
                    activityType: orderDetailModel.productsList()[index].orderSubType,
                    activityCode: orderDetailModel.productsList()[index].activityCode//
                });
                break;
            case 3://
            case 4:
                this.$navigate("topic/TopicDetailPage", {
                    activityType: orderDetailModel.productsList()[index].orderSubType,
                    activityCode: orderDetailModel.productsList()[index].activityCode
                });
                break;
            default://普通商品
                this.$navigate("home/product/ProductDetailPage", { productCode: orderDetailModel.productsList()[index].prodCode });
                break;
        }
    };
    afterSaleServiceClick = (menu, index) => {
        console.log(menu);
        let products = orderDetailModel.warehouseOrderDTOList[0].products[index];
         if(products.afterSaleTime < orderDetailModel.warehouseOrderDTOList[0].nowTime){
             NativeModules.commModule.toast("该商品售后已过期");
             return;
         }else if(products.orderSubType === 3){
             NativeModules.commModule.toast("该商品属于升级礼包产品，不存在售后功能");
             return;
         }

        switch (menu.id) {
            case 0:
                    this.$navigate("order/afterSaleService/AfterSaleServicePage", {
                        pageType: 0,
                        orderProductNo: products.orderProductNo
                    });

                break;
            case 1:
                this.$navigate("order/afterSaleService/AfterSaleServiceHomePage", {
                    pageData: products,
                });
                break;
            case 2:
                this.$navigate("order/afterSaleService/ExchangeGoodsDetailPage", {
                    serviceNo:  products.serviceNo
                });
                break;
            case 3:
                this.$navigate("order/afterSaleService/ExchangeGoodsDetailPage", {
                    serviceNo:  products.serviceNo
                });
                break;
            case 6:
                this.$navigate("order/afterSaleService/ExchangeGoodsDetailPage", {
                    serviceNo:  products.serviceNo
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
        backgroundColor: "white",
        // borderStyle: "solid",
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg,
        marginRight: px2dp(15),
        justifyContent: "center",
        alignItems: "center",
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
        backgroundColor: "white",
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        borderRadius: px2dp(10),
        justifyContent: "center"
    }
});
