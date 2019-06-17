import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView, Text, Alert
} from 'react-native';
import BasePage from '../../../BasePage';
import { NoMoreClick, UIText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import GoodsDetailItem from '../components/GoodsDetailItem';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import Toast from '../../../utils/bridge';
// import GoodsGrayItem from "../components/GoodsGrayItem";
import OrderApi from '../api/orderApi';
import { renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { NavigationActions } from 'react-navigation';
import DesignRule from '../../../constants/DesignRule';
import MineApi from '../../mine/api/MineApi';
// import { getDateData, leadingZeros } from '../components/orderDetail/OrderCutDown';
import res from '../res';
import OrderDetailStatusView from '../components/orderDetail/OrderDetailStatusView';
// import OrderDetailStateView from "../components/orderDetail/OrderDetailStateView";
import DetailAddressView from '../components/orderDetail/DetailAddressView';
import OrderDetailPriceView from '../components/orderDetail/OrderDetailPriceView';
import OrderDetailTimeView from '../components/orderDetail/OrderDetailTimeView';
import OrderDetailBottomButtonView from '../components/orderDetail/OrderDetailBottomButtonView';
import { orderDetailModel, assistDetailModel } from '../model/OrderDetailModel';
import { observer } from 'mobx-react';
import GiftHeaderView from '../components/orderDetail/GiftHeaderView';
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';
import { GetAfterBtns, checkOrderAfterSaleService, judgeProduceIsContainActivityTypes } from './OrderType';
import CancelProdectsModal from '../components/orderDetail/CancelProdectsModal';

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
        };
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
        // orderDetailModel.netFailedInfo = null;
        // orderDetailModel.netFailedInfo = PageLoadingState.loading;
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
        orderDetailModel.stopTimer();
        // DeviceEventEmitter.removeAllListeners("OrderNeedRefresh");
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
                    leftTopIcon={leftIconArr[orderDetailModel.merchantOrder.status]}
                />
                <DetailAddressView/>
            </View>

        );
    };

    componentDidMount() {
        this.loadPageData();
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
        Alert.alert('', `确定删除此订单吗?`, [
            {
                text: `取消`, onPress: () => {
                }
            },
            {
                text: `确定`, onPress: () => {
                    Toast.showLoading();
                    OrderApi.deleteOrder({ merchantOrderNo: orderDetailModel.merchantOrderNo}).then((response) => {
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
                        {this.renderHeader()}
                        {orderDetailModel.productsList().map((item, index ) => {return this.renderItem(item, index )})}
                        {this.renderFooter()}
                    </ScrollView>
                    <OrderDetailBottomButtonView
                        openCancelModal = {()=>{this.cancelProdectsModal&&this.cancelProdectsModal.open(orderDetailModel.platformOrderNo)}}
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
    renderItem = (item, index ) => {
        return (
            <GoodsDetailItem
                uri={item.specImg}
                goodsName={item.productName}
                salePrice={'￥' + StringUtils.formatMoneyString(item.unitPrice, false)}
                category={item.spec}
                goodsNum={item.quantity}
                activityCodes={item.activityList || []}
                style={{ backgroundColor: 'white' }}
                clickItem={() => {
                    this.clickItem(item);
                }}
                afterSaleService={GetAfterBtns(item)}
                afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, item)}
            />
        );

    };
    renderHeader = () => {
        return (
            <View>
                {this.renderState()}
                <GiftHeaderView/>
            </View>
        );
    };
    renderFooter = () => {
        return (
            <View>
                <OrderDetailPriceView/>
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
                    ref={(ref) => {
                        this.cancelModal = ref;
                    }}
                    detail={assistDetailModel.cancelArr}
                    commit={(index) => {
                        //取消订单
                        Toast.showLoading();
                        OrderApi.cancelOrder({
                            cancelReason: assistDetailModel.cancelArr[index],
                            platformOrderNo: orderDetailModel.platformOrderNo,
                        }).then((response) => {
                            Toast.hiddenLoading();
                            this.goTobackNav();
                        }).catch(e => {
                            Toast.hiddenLoading();
                            Toast.$toast(e.msg);
                        });
                    }}
                />
                <CancelProdectsModal ref={(ref) => {
                    this.cancelProdectsModal = ref;
                }}
                                     clickSure={()=>{ this.cancelModal&&this.cancelModal.open()}}
                />
            </View>

        );
    };
    goTobackNav = () => {
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


     loadPageData() {
       orderDetailModel.loadDetailInfo(this.params.merchantOrderNo);
    }
    //去商品详情
    clickItem = (item) => {
        // 2://降价拍
        // 3://礼包
        let activityData = judgeProduceIsContainActivityTypes(item, [2, 3])
         if (activityData) {
             this.$navigate('topic/TopicDetailPage', {
                 activityType: activityData.activityType,
                 activityCode: activityData.activityCode
             });
         }else {
             this.$navigate('product/ProductDetailPage', { productCode: item.prodCode });
         }
    };
    //点击售后按钮的处理
    afterSaleServiceClick = (menu, item) => {
        if (!checkOrderAfterSaleService([item],item.status,orderDetailModel.baseInfo.nowTime,true)){
            return;
        }
        switch (menu.id) {
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    orderProductNo: item.productOrderNo
                });

                break;
            case 2:
                this.$navigate('order/afterSaleService/AfterSaleServiceHomePage', {
                    pageData: item
                    //-1代表普通商品
                });
                break;
            case 3:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    serviceNo: item.afterSale.serviceNo
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
