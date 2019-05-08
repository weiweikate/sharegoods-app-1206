/**
 * pageType 0 退款详情  1 退货详情   2 换货详情
 * returnProductId
 */
import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    DeviceEventEmitter,
    Alert,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import BasePage from '../../../BasePage';
import { UIText, UIImage, MRText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import GoodsItem from '../components/GoodsGrayItem';
// import DateUtils from '../../../utils/DateUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import OrderApi from '../api/orderApi';
import DesignRule from '../../../constants/DesignRule';
import AfterSaleDetailModel from './AfterSaleDetailModel';
import {
    CustomerServiceView,
    AfterSaleInfoView,
    OperationApplyView,
    TipView,
    HeaderView,
    RefundDetailView,
    StatusInfoView,
    BackAddressView,
    ShippingAddressView,
    LogisticsView
} from './components';
import { observer } from 'mobx-react';
import res from '../res';
import RouterMap from '../../../navigation/RouterMap';
import {PageType}from './AfterType'

const netError = res.placeholder.netError;
const arrow_right_black = res.button.arrow_right_black;

@observer
class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};

        this._bindFunc();
        this.afterSaleDetailModel = new AfterSaleDetailModel();
        this.afterSaleDetailModel.serviceNo = this.params.serviceNo;
        // this.afterSaleDetailModel.serviceNo = '2018170912071644346885712';
        this.afterSaleDetailModel.loadingShow = this.$loadingShow;
        this.afterSaleDetailModel.loadingDismiss = this.$loadingDismiss;
        this.afterSaleDetailModel.toastShow = this.$toastShow;
        this.afterSaleDetailModel.navigationBarResetTitle = this.$NavigationBarResetTitle;
    }

    $navigationBarOptions = {
        // title: ['退款详情', '退货详情', '换货详情'][this.params.pageType],
        show: true,// false则隐藏导航
        title: '售后详情'
    };

    $NavigationBarDefaultLeftPressed = () => {
        this.$navigateBack('order/order/MyOrdersDetailPage');
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    _bindFunc() {
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        this.afterSaleDetailModel.loadPageData();
    }

    _onRefresh() {
        this.afterSaleDetailModel.loadPageData();
    }

    componentWillUnmount() {
        this.afterSaleDetailModel.stopTimer();
    }


    //**********************************ViewPart******************************************
    _render() {
        if (EmptyUtils.isEmpty(this.afterSaleDetailModel.pageData)) {

            if (this.afterSaleDetailModel.isLoaded === true) {
                return this._renderEmptyView();
            } else {
                return null;
            }
        }

        let pageData = this.afterSaleDetailModel.pageData;
        let {
            type,
            status,// 1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
            subStatus,  // REVOKED(1, "手动撤销"),OVERTIME(2, "超时关闭"),(3, "拒绝关闭");
            refundStatus,//退款状态: 1.待退款 2.退款成功 3.三方退款失败 4.平台退款失败 5.取消退款(关闭)
            // orderProductNo,
            refundPrice,
            refundAccountAmount,
            refundCashAmount,
            payAmount,
            //平台物流
            sendExpressName,
            sendExpressNo,
            //退款信息
            reason,
            description,
            imgList,
            //用户地址
            receiver,
            receiverPhone,
            province,
            city,
            area,
            street,
            address,
            //寄回地址
            refundAddress,
            //商品info
            specImg,
            productName,
            unitPrice,
            spec,
            quantity,
            remarks,
            //寄回物流
            orderRefundExpress = {}
        } = pageData;

        let pageType = type - 1;
        let reject = this.afterSaleDetailModel.reject;
        let isShow_operationApplyView = status === 1;
        /** 退款成功、退货成功、换货变退款成功, (!refundStatus|| refundStatus === 3|| refundStatus === 4)退款没有失败*/
        let isShow_refundDetailView = ((pageType === 0 && status === 5) || (pageType === 1 && status === 5)) &&((!refundStatus|| (refundStatus !== 3 && refundStatus !== 4)));

        let isShow_refuseReasonView = false;
        let refuseReasonViewType = 0;
        // /** 退款、退货、在提交申请中和完成时候显示金额*/
        // if (pageType === 0 && (status === 1 || status === 5) ||
        //     pageType === 1 && (status === 1 || status === 5)
        // ) {
        //     isShow_refuseReasonView = true;
        //
        //     /** 只要是被拒绝就显示拒绝理由*/
        // } else if (status === 6) {
        //     if(reject && reject.length > 0){
        //         isShow_refuseReasonView = true;
        //         refuseReasonViewType = 1;
        //     }
        // }

        let isShow_shippingAddressView = false;
        let isShow_backAddressView = false;
        /** 退货 寄回地址在申请中，和关闭的情况不显示，收货人地址始终不显示*/
        if (pageType === 1 && (status === 2 || status === 3 || status === 4 || status === 5)) {
            isShow_backAddressView = true;
            /** 退货 寄回地址、收货人地址在申请中，和关闭的情况不显示*/
        } else if (pageType === 2 && (status === 2 || status === 3 || status === 4 || status === 5)) {
            // isShow_shippingAddressView = true;
            isShow_backAddressView = true;
        }
        let logistics = [];
        /** 平台物流只有在换货， 4.待平台处理 5.售后完成才显示*/
        if (pageType === 2 && (status === 4 || status === 5)) {
            if (sendExpressNo) {
                logistics.push({
                    title: '平台换货物流',
                    value: sendExpressName,
                    placeholder: '',
                    expressNo: sendExpressNo,
                    onPress: this.shopLogists
                });
            }
        }
        /** 寄回物流在换货、退货，  2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成才显示*/
        if ((pageType === 1 || pageType === 2) &&
            (status === 2 || status === 3 || status === 4 || status === 5)) {
            orderRefundExpress = orderRefundExpress || {};
            logistics.push({
                title: '用户寄回物流',
                value: orderRefundExpress.expressName,
                placeholder: '请填写寄回物流信息',
                expressNo: orderRefundExpress.expressNo,
                onPress: this.returnLogists
            });
        }
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.afterSaleDetailModel.refreshing}
                                    onRefresh={this._onRefresh}
                                    colors={[DesignRule.mainColor]}
                                    tintColor={DesignRule.mainColor}
                                />
                            }
                >
                    <TipView pageType={pageType} status={status}/>
                    <HeaderView pageType={pageType}
                                status={status}
                                subStatus={subStatus}
                    />
                    {isShow_operationApplyView ?
                        <OperationApplyView pageType={pageType}
                                            cancelPress={this.cancelPress}
                                            changePress={this.changePress}/> : null}
                    {
                        isShow_refuseReasonView ?
                            <StatusInfoView pageType={pageType}
                                              status={status}
                                              subStatus={subStatus}
                                              remarks={remarks}
                            /> : null
                    }
                    {
                        isShow_refundDetailView ?
                            <RefundDetailView refundAccountAmount={refundAccountAmount}
                                              refundCashAmount={refundCashAmount}
                            /> : null
                    }
                    {
                        isShow_shippingAddressView ?
                            <ShippingAddressView
                                receiver={receiver}
                                receiverPhone={receiverPhone}
                                province={province}
                                city={city}
                                area={area}
                                street={street}
                                address={address}
                            /> : null
                    }
                    {
                        isShow_backAddressView ?
                            <BackAddressView refundAddress={refundAddress}/> : null
                    }
                    {
                        logistics.length > 0 ?
                            <LogisticsView data={logistics}
                            /> : null
                    }
                    {this.renderOrder()}
                    <GoodsItem
                        uri={specImg}
                        goodsName={productName}
                        salePrice={StringUtils.formatMoneyString(unitPrice)}
                        category={spec}
                        goodsNum={quantity}
                        style={{ backgroundColor: DesignRule.white }}
                        renderExtraView={()=> {
                            if (pageType === PageType.AREFUND || pageType === PageType.SALES_RETURN){
                                return(
                                    <View style={{marginTop: 10, flexDirection: 'row'}}>
                                        <MRText style={{fontSize: 12,
                                            color: DesignRule.textColor_instruction,}}>退款金额：</MRText>
                                        <MRText style={{fontSize: 12,
                                            color: DesignRule.textColor_mainTitle,
                                            fontWeight: '600'
                                        }}>{'¥'+payAmount}</MRText>
                                    </View>
                                )
                            }

                            return null;
                        }}
                    />
                    <AfterSaleInfoView pageData={pageData}
                                       pageType={pageType}
                                       afterSaleInfo={{
                                           reason,
                                           description,
                                           imgList,
                                           refundPrice,
                                           quantity
                                       }}
                    />
                    <TouchableOpacity style={styles.item_style}
                                      onPress={()=>{this.gotoNegotiateHistory()}}
                    >
                        <MRText style={styles.item_text}>协商记录</MRText>
                        <UIImage style={styles.item_arrow} source={arrow_right_black}/>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    _renderEmptyView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => {
                    this.afterSaleDetailModel.loadPageData();
                }}
                                  style={{ alignItems: 'center' }}
                >
                    <UIImage source={netError} style={{ height: 80, width: 80 }}/>
                    <UIText value={'数据获取失败，点击刷新重试~'}
                            style={{
                                marginTop: 15,
                                color: DesignRule.textColor_secondTitle,
                                fontSize: DesignRule.fontSize_threeTitle_28
                            }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    gotoNegotiateHistory(){

    }
    //取消申请
    cancelPress = () => {
        this.afterSaleDetailModel.loadPageData(() => this.onPressOperationApply(true));
    };
    //修改申请
    changePress = () => {
        this.afterSaleDetailModel.loadPageData(() => this.onPressOperationApply(false));
    };


    renderOrder = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    height: 40,
                    justifyContent: 'center',
                    paddingLeft: 15,
                    marginTop: -5
                }}>
                <UIText value={'售后信息'}
                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
            </View>
        );
    };

    returnLogists = (expressNo) => {
        if (EmptyUtils.isEmpty(expressNo)) {
            this.$navigate('order/afterSaleService/FillReturnLogisticsPage', {
                pageData: this.afterSaleDetailModel.pageData,
                callBack: () => {
                    this.afterSaleDetailModel.loadPageData();
                }
            });
        } else {
            this.$navigate('order/logistics/LogisticsDetailsPage', {
                expressNo: expressNo
            });
        }
    };

    shopLogists = (expressNo) => {
        if (EmptyUtils.isEmpty(expressNo)) {
            this.$toastShow('请填写完整的退货物流信息\n才可以查看商家的物流信息');
            return;
        }
        this.logisticsDetailsPage(expressNo)
    };

    logisticsDetailsPage = (expressNo) => {
        OrderApi.return_express({serviceNo: this.params.serviceNo}).then((data)=>{
            if (data.data&&data.data.length>1){//有多个物流
                this.$navigate(RouterMap.AfterLogisticsListView, {
                    serviceNo: this.params.serviceNo
                });
            }else {
                this.$navigate('order/logistics/LogisticsDetailsPage', {
                    expressNo: expressNo
                });
            }
        }).catch(err=>{
            this.$toastShow(err.msg);
        });
    }

    /**
     * 撤销、修改
     * @param cancel true -》撤销 、false -》修改申请
     */
    onPressOperationApply(cancel) {
        let that = this;
        // pageType 0 退款详情  1 退货详情   2 换货详情
        let pageType = this.afterSaleDetailModel.pageData.type - 1;
        let num = this.afterSaleDetailModel.pageData.maxRevokeTimes - this.afterSaleDetailModel.pageData.hadRevokeTimes || 0;
        if (cancel) {
            let tips = ['确认撤销本次退款申请？您最多只能发起' + num + '次',
                '确认撤销本次退货退款申请？您最多只能发起' + num + '次',
                '确认撤销本次换货申请？您最多只能发起' + num + '次'];
            if (num <= 0){
                this.$toastShow('平台售后操作已到上线');
                return;
            }

            Alert.alert('',
                tips[pageType],
                [
                    {
                        text: '取消',
                        style: 'cancel'
                    },
                    {
                        text: '确认',
                        onPress: () => {
                            that.$loadingShow();
                            OrderApi.afterSaleCancel({ serviceNo: this.params.serviceNo }).then(result => {
                                that.$loadingDismiss();
                                DeviceEventEmitter.emit('OrderNeedRefresh');
                                that.$navigateBack('order/order/MyOrdersDetailPage');
                            }).catch(error => {
                                that.$loadingDismiss();
                                that.$toastShow(error.msg || '操作失败，请重试');
                            });
                        }
                    }
                ]);
        } else {
            let {
                serviceNo,
                orderProductNo,
                type,
                refundPrice,
                imgList,
                description,
                reason
            } = this.afterSaleDetailModel.pageData;
            imgList = imgList || '';
            if (EmptyUtils.isEmpty(imgList)) {
                imgList = [];
            }else {
                imgList = imgList.split(',');
            }

            this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                pageType: type - 1,
                isEdit: true,
                callBack: ()=> {this.afterSaleDetailModel.loadPageData()},
                serviceNo,
                orderProductNo,
                reason,
                description,
                imgList,
                refundPrice
            });

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        justifyContent: 'flex-end'
    },
    addressStyle: {},
    item_style: {
        height: 50,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    item_text: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    item_arrow: {
        height: 10,
        width: 6,
    }
});

export default ExchangeGoodsDetailPage;
