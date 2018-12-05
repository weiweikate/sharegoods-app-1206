import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    TouchableOpacity,
    Image, DeviceEventEmitter,
} from 'react-native';
import BasePage from '../../../BasePage';
import { RefreshList } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import GoodsDetailItem from '../components/GoodsDetailItem';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import Toast from '../../../utils/bridge';
import GoodsGrayItem from '../components/GoodsGrayItem';
import OrderApi from '../api/orderApi';
import user from '../../../model/user';
import { NavigationActions } from 'react-navigation';
import DesignRule from 'DesignRule';
import MineApi from '../../mine/api/MineApi';
import res from '../res';
import OrderDetailStatusView from '../components/orderDetail/OrderDetailStatusView';
import OrderDetailStateView from '../components/orderDetail/OrderDetailStateView';
import DetailAddressView from '../components/orderDetail/DetailAddressView';
import OrderDetailPriceView from '../components/orderDetail/OrderDetailPriceView';
import OrderDetailTimeView from '../components/orderDetail/OrderDetailTimeView';
import {orderDetailModel,orderDetailAfterServiceModel,assistDetailModel} from '../model/OrderDetailModel';
import { observer } from 'mobx-react/native';
import GiftHeaderView from '../components/orderDetail/GiftHeaderView';
const buyerHasPay = res.buyerHasPay;
const productDetailHome = res.productDetailHome;
const productDetailMessage =res.productDetailMessage;
const tobePayIcon = res.dingdanxiangqing_icon_fuk;
const finishPayIcon = res.dingdanxiangqing_icon_yiwangcheng;
const hasDeliverIcon = res.dingdanxiangqing_icon_yifehe;
const refuseIcon = res.dingdanxiangqing_icon_guangbi;
const productDetailImg = res.productDetailImg;
const moreIcon = res.more_icon;
const timeUtils= new TimeDownUtils();
const {px2dp} = ScreenUtils;


@observer
export default class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            orderId: this.params.orderId,
            expressNo: '',
            viewData: {},
            menu: {},
            giftBagCoupons: [],
            cancelArr:[]
        };
        assistDetailModel.setOrderId(this.params.orderId);
    }

    $navigationBarOptions = {
        title: '订单详情',
        show: true// false则隐藏导航
    };
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore} style={{width:px2dp(20),height:px2dp(44),alignItems:'center',justifyContent:'center'}}>
                <Image source={moreIcon} style={{ width: px2dp(20), marginRight: px2dp(15) }} resizeMode='contain'/>
            </TouchableOpacity>
        );
    };
    showMore = () => {
        this.setState({ isShowShowMessageModal: true });
        this.messageModal && this.messageModal.open();
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        let leftIconArr=[buyerHasPay,tobePayIcon,buyerHasPay,hasDeliverIcon,finishPayIcon,finishPayIcon,refuseIcon,refuseIcon,refuseIcon,refuseIcon];
        return (
            <View style={{ marginBottom: px2dp(10) }}>
                <OrderDetailStatusView
                    productDetailImg={productDetailImg}
                    leftTopIcon={leftIconArr[orderDetailModel.status]}
                />
                <OrderDetailStateView
                    orderNum={orderDetailModel.orderNum}
                    orderId={assistDetailModel.orderId}
                    expressNo={orderDetailModel.expressNo}
                    sellerState={orderDetailAfterServiceModel.totalAsList.sellerState}
                    logisticsTime={orderDetailAfterServiceModel.totalAsList.logisticsTime}
                    sellerTime={orderDetailAfterServiceModel.totalAsList.sellerTime}
                    nav={this.$navigate}
                />
            </View>

        );
    };

    componentDidMount() {
        DeviceEventEmitter.addListener('OrderNeedRefresh', () => this.loadPageData());
        this.loadPageData();
        this.getCancelOrder();

    }
    getCancelOrder(){
        let arrs=[];
        MineApi.queryDictionaryTypeList({ code: 'QXDD' }).then(res => {
            if (StringUtils.isNoEmpty(res.data)) {
                res.data.map((item, i) => {
                    arrs.push(item.value)
                });
                assistDetailModel.getCancelArr(arrs)
            }}).catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('OrderNeedRefresh');
        timeUtils.stop();
    }

    _render = () => {
        return (
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={orderDetailModel.orderType === 5 ||orderDetailModel.orderType === 98 ? this.state.viewData.list : this.state.viewData.list}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
                {this.renderModal()}
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        if (orderDetailModel.orderType === 5 || orderDetailModel.orderType === 98) {
            return (
                <GoodsGrayItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    category={item.category}
                    salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                    goodsNum={item.goodsNum}
                    onPress={() => this.clickItem(item)}
                    style={{backgroundColor:'white'}}
                />
            );
        } else {
            return (
                <GoodsDetailItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                    category={item.category}
                    goodsNum={item.goodsNum}
                    clickItem={() => {
                        this.clickItem(index, item);
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
                {this.state.pageStateString.disNextView ?  <DetailAddressView
                    receiver={orderDetailModel.receiver}
                    recevicePhone={orderDetailModel.recevicePhone}
                    province={orderDetailModel.province}
                    city={orderDetailModel.city}
                    area={orderDetailModel.area}
                    address={orderDetailModel.address}
                /> : null}
                <GiftHeaderView
                    giftPackageName={this.state.giftPackageName}/>
            </View>
        );
    };
    renderFootder = () => {
        return(
            <View>
                <OrderDetailPriceView
                    giftBagCoupons={this.state.giftBagCoupons}/>
                <OrderDetailTimeView
                orderNum={orderDetailModel.orderNum}
                createTime={orderDetailModel.createTime}
                platformPayTime={orderDetailModel.platformPayTime}
                shutOffTime={orderDetailModel.shutOffTime}
                cancelTime={orderDetailModel.cancelTime}
                payTime={orderDetailModel.payTime }
                sendTime={orderDetailModel.sendTime}
                deliverTime={orderDetailModel.deliverTime}
                finishTime={orderDetailModel.finishTime}
                payType={this.state.payType}
                outTradeNo={orderDetailModel.outTradeNo}
                goBack={()=>this.$navigateBack()}
                nav={this.$navigate}
                callBack={this.params.callBack &&this.params.callBack()}
                loadPageData={()=>this.loadPageData()}
            />
            </View>
        )

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
                    ref={(ref)=>this.messageModal = ref}
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
                    ref={(ref)=>{this.cancelModal = ref}}
                    detail={assistDetailModel.cancelArr}
                    closeWindow={() => {
                        assistDetailModel.setIsShowSingleSelctionModal(false)
                    }}
                    commit={(index) => {
                        assistDetailModel.setIsShowSingleSelctionModal(false)
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            buyerRemark: assistDetailModel.cancelArr[index],
                            orderNum: orderDetailModel.orderNum
                        }).then((response) => {
                            Toast.hiddenLoading();
                            NativeModules.commModule.toast('订单已取消');
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
        let autoConfirmTime = Math.round((overtimeClosedTime - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        timeUtils.settimer((time) => {
            orderDetailAfterServiceModel.moreDetail  = time.hours + ':' + time.min + ':' + time.sec + '后自动取消订单';
            console.log(orderDetailAfterServiceModel.totalAsList);
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                orderDetailAfterServiceModel.moreDetail='';
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //06天18:24:45后自动确认收货
    startCutDownTime2 = (autoReceiveTime2) => {
        let autoConfirmTime = Math.round((autoReceiveTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        timeUtils.settimer(time => {
            orderDetailAfterServiceModel.moreDetail = time.days + '天' + time.hours + ':' + time.min + ':' + time.sec + '后自动确认收货';
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                orderDetailAfterServiceModel.totalAsList= orderDetailAfterServiceModel.AfterServiceList[5];
                orderDetailAfterServiceModel.moreDetail='';
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //**********************************BusinessPart******************************************
    getAfterSaleService = (data, index) => {
        //售后状态
        let afterSaleService = [];
        let statusArr = [4, 16, 8];
        let isAfterSale = (data[index].restrictions & statusArr[0]) == statusArr[0] && (data[index].restrictions & statusArr[1]) == statusArr[1] &&
            (data[index].restrictions & statusArr[2]) == statusArr[2];
        switch (data[index].status) {
            case 2:
                if ((data[index].restrictions & statusArr[0]) == statusArr[0]) {
                    afterSaleService.push();
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
                if (isAfterSale) {
                    afterSaleService.push();
                } else {
                    switch (data[index].returnType) {
                        case 1://申请退款
                            afterSaleService.push({
                                id: 2,
                                operation: '退款中',
                                isRed: false
                            });
                            break;
                        case 2://申请退货
                            afterSaleService.push({
                                id: 3,
                                operation: '退货中',
                                isRed: false
                            });
                            break;
                        case 3://申请换货
                            afterSaleService.push({
                                id: 6,
                                operation: '换货中',
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
                }
                break;
            case 5:
                if (isAfterSale) {
                    afterSaleService.push();
                } else if ((data[index].finishTime || 0) - (new Date().valueOf()) < 0) {
                    afterSaleService.push();
                }
                else {
                    switch (data[index].returnType) {
                        case 1://申请退款
                            afterSaleService.push({
                                id: 2,
                                operation: '退款中',
                                isRed: false
                            });
                            break;
                        case 2://申请退货
                            afterSaleService.push({
                                id: 3,
                                operation: '退货中',
                                isRed: false
                            });
                            break;
                        case 3://申请换货
                            afterSaleService.push({
                                id: 6,
                                operation: '换货中',
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
                }
                break;
            case 6:
                switch (data[index].returnType) {
                    case 1://申请退款
                        afterSaleService.push({
                            id: 2,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    case 2://申请退货
                        afterSaleService.push({
                            id: 3,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    case 3://申请换货
                        afterSaleService.push({
                            id: 6,
                            operation: '售后完成',
                            isRed: false
                        });
                        break;
                    default:
                        afterSaleService.push();
                }
                break;
            case 7:
            case 8:
                afterSaleService.push();
                break;
        }
        // return afterSaleService;
        return orderDetailAfterServiceModel.currentAsList=afterSaleService;
    };
    loadPageData() {
        Toast.showLoading();

        orderDetailModel.loadDetailInfo(this.state.orderId, user.id, this.params.status, this.params.orderNum)

        OrderApi.lookDetail({
            id: this.state.orderId,
            userId: user.id,
            status: this.params.status,
            orderNum: this.params.orderNum
        }).then((response) => {
            Toast.hiddenLoading();
            let data = response.data;
            orderDetailModel.saveOrderDetailInfo(data);
            console.log(orderDetailModel);
            let arr = [];
            if (data.orderType === 5 || data.orderType === 98) {//礼包。。。
                data.orderProductList[0].orderProductPriceList.map((item, index) => {
                    arr.push({
                        id: data.orderProductList[0].id,
                        orderId: item.orderProductId,
                        productId: item.productId,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.originalPrice) ? item.originalPrice : 0,
                        category: item.spec,
                        goodsNum: item.productNum,
                        returnProductId: data.orderProductList[0].returnProductId,
                        returnType: data.orderProductList[0].returnType,
                        returnProductStatus: data.orderProductList[0].returnProductStatus,
                        status: data.orderProductList[0].status
                    });
                });
            } else {
                data.orderProductList.map((item, index) => {
                    arr.push({
                        id: item.id,
                        orderId: item.orderId,
                        productId: item.productId,
                        uri: item.specImg,
                        goodsName: item.productName,
                        salePrice: StringUtils.isNoEmpty(item.price) ? item.price : 0,
                        category: item.spec,
                        goodsNum: item.num,
                        returnProductId: item.returnProductId,
                        afterSaleService: this.getAfterSaleService(data.orderProductList, index),
                        returnProductStatus: item.returnProductStatus,
                        returnType: item.returnType,
                        status: item.status,
                        activityCode: item.activityCode
                    });
                });
            }

            // let pageStateString = constants.pageStateString[parseInt(data.status)];
            let pageStateString =orderDetailAfterServiceModel.AfterServiceList[parseInt(data.status)];

            /*
             * operationMenuCheckList
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
            switch (parseInt(orderDetailModel.status)) {
                // case 0:
                //     break
                //等待买家付款
                case 1:
                    this.startCutDownTime(data.shutOffTime);
                    pageStateString.sellerState = ['收货人:' + data.receiver,'' + data.recevicePhone];
                    pageStateString.sellerTime = '收货地址:' + data.province + data.city + data.area + data.address;
                    if (StringUtils.isEmpty(data.outTradeNo)) {
                        pageStateString.menu = [
                            {
                                id: 1,
                                operation: '取消订单',
                                isRed: false
                            }, {
                                id: 2,
                                operation: '去支付',
                                isRed: true
                            }
                        ];
                    } else {
                        pageStateString.menu = [
                            {
                                id: 1,
                                operation: '取消订单',
                                isRed: false
                            }, {
                                id: 3,
                                operation: '继续支付',
                                isRed: true
                            }
                        ];
                    }
                    break;
                //买家已付款 待发货
                case 2:
                    pageStateString.menu = [];
                    break;
                //卖家已发货 待收货
                case 3:
                    this.startCutDownTime2(data.autoReceiveTime);
                    pageStateString.sellerTime = '';
                    break;
                //   确认收货
                case 4:
                    if (data.orderType == 5 || data.orderType == 98) {
                        pageStateString.menu = [
                            {
                                id: 7,
                                operation: '删除订单',
                                isRed: false
                            }
                        ];
                    }
                    pageStateString.sellerState = '已签收';
                    pageStateString.moreDetail='';
                    timeUtils.stop();
                    pageStateString.logisticsTime=data.deliverTime?data.deliverTime:data.finishTime
                    break;
                //订单已完成
                case 5:
                    if (data.orderType == 5 || data.orderType == 98) {
                        pageStateString.menu = [
                            {
                                id: 7,
                                operation: '删除订单',
                                isRed: false
                            }
                        ];
                    }
                    // pageStateString.sellerTime = '收货地址：' + data.province + data.city + data.area + data.address;
                    pageStateString.moreDetail='';
                    timeUtils.stop();
                    pageStateString.logisticsTime=data.deliverTime?data.deliverTime:data.finishTime
                    break;
                case 6://退货关闭
                case 7://用户关闭
                case 8://超时关闭
                    if (data.orderType == 5 || data.orderType == 98) {
                        pageStateString.menu = [
                            {
                                id: 7,
                                operation: '删除订单',
                                isRed: false
                            }
                        ];
                    }
                    pageStateString.sellerState = '订单已关闭';
                    pageStateString.moreDetail = data.buyerRemark;
                    pageStateString.logisticsTime=data.shutOffTime?data.shutOffTime:null
                    break;

            }
            orderDetailAfterServiceModel.totalAsList=pageStateString;
            this.setState({
                viewData: {
                    expressNo: data.expressNo,
                    orderId: this.params.orderId,
                    list: arr,
                    receiver: data.receiver,
                    recevicePhone: data.recevicePhone,
                    address: data.address,
                    province: data.province,
                    city: data.city,
                    area: data.area,
                    goodsPrice: data.totalProductPrice,//商品价格(detail.totalPrice-detail.freightPrice)
                    freightPrice: data.freightPrice,//运费（快递）
                    tokenCoin: data.tokenCoin || 0,//一元券抵扣
                    couponPrice: data.couponPrice || 0,//优惠券抵扣
                    totalPrice: data.totalOrderPrice,//订单总价
                    needPrice: data.needPrice,//需付款
                    orderNum: data.orderNum,//订单编号
                    createTime: data.createTime,//创建时间
                    platformPayTime: data.platformPayTime,//平台付款时间
                    payTime: data.payTime,//三方付款时间
                    outTradeNo: data.outTradeNo,//三方交易号
                    sendTime: data.sendTime,//发货时间
                    finishTime: data.finishTime,//成交时间
                    autoReceiveTime: data.autoReceiveTime,//自动确认时间
                    deliverTime: data.deliverTime,
                    pickedUp: data.pickedUp,//
                    cancelTime: data.cancelTime ? data.cancelTime : null,//取消时间,
                    shutOffTime:data.shutOffTime,//超时关闭时间
                },
                afterSaleService: this.getAfterSaleService(data.orderProductList, 0),
                returnProductStatus: data.orderProductList[0].returnProductStatus,
                pageStateString: pageStateString,
                expressNo: data.expressNo,
                pageState: data.pageState,
                activityId: data.activityId,
                orderType: data.orderType,
                allData: data,
                payType: (data.orderPayRecord ? data.orderPayRecord.type : null),
                orderProductPrices: data.orderProductList[0].price,//礼包，套餐啥的,
                giftPackageName: data.orderType == 5 || data.orderType == 98 ? data.orderProductList[0].productName : '礼包',
                status: data.status,//订单状态
                activityCode: data.orderProductList[0] && data.orderProductList[0].activityCode ? data.orderProductList[0].activityCode : null,//礼包的code
                giftBagCoupons: data.orderProductList[0] && data.orderProductList[0].giftBagCoupons ? data.orderProductList[0].giftBagCoupons : []

            });
            console.log('setView', orderDetailModel);
        }).catch(e => {
            Toast.hiddenLoading();
            Toast.$toast(e.msg);
            if (e.code === 10009) {
                this.$navigate('login/login/LoginPage', {
                    callback: () => {
                        this.loadPageData();
                    }
                });
            }
        });
    }

    clickItem = (index, item) => {
        console.log('clickItem', index, item);
        switch (this.state.orderType) {
            case 1://秒杀
            case 2://降价拍
                this.$navigate('home/product/ProductDetailPage', {
                    activityType: this.state.orderType,
                    // activityCode: this.state.viewData.list[index].activityCode//
                    productId: this.state.viewData.list[index].productId
                });
                break;
            case 3://不是礼包，5才是
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.viewData.list[index].activityCode
                });
                break;
            case 5://普通礼包
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.activityCode
                });
                break;

            case 98://升级礼包
                this.$navigate('topic/TopicDetailPage', {
                    activityType: 3,
                    activityCode: this.state.activityCode
                });
                break;

            case 99://普通商品
                this.$navigate('home/product/ProductDetailPage', { productId: this.state.viewData.list[index].productId });
                break;
        }
    };
    afterSaleServiceClick = (menu, index) => {
        console.log(menu);
        switch (menu.id) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    orderProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].id : this.state.viewData.list[index].id
                });
                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServiceHomePage', {
                    pageData: this.state.allData,
                    index: index
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 0,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
                });
                break;
            case 3:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 1,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
                });
                break;
            case 6:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 2,
                    returnProductId: this.state.orderType == 5 || this.state.orderType == 98 ? this.state.viewData.list[0].returnProductId : this.state.viewData.list[index].returnProductId
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
        borderStyle: 'solid',
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
    topOrderDetail:{
        minHeight:px2dp(81),
        marginTop: px2dp(69),
        backgroundColor: 'white',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingTop:px2dp(5),
        paddingBottom:px2dp(5),
        borderRadius: px2dp(10),
        justifyContent:'center'
    }
});
