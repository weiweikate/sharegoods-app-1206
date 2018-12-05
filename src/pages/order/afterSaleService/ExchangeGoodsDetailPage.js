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
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import { UIText, UIImage } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import GoodsItem from '../components/GoodsGrayItem';
// import DateUtils from '../../../utils/DateUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import OrderApi from '../api/orderApi';
import DesignRule from 'DesignRule';
import AfterSaleDetailModel from './AfterSaleDetailModel';
import {
    CustomerServiceView,
    AfterSaleInfoView,
    OperationApplyView,
    TipView,
    HeaderView,
    RefundDetailView,
    RefuseReasonView,
    BackAddressView,
    ShippingAddressView,
    LogisticsView
} from './components';
import { observer } from 'mobx-react';
import res from '../res';

const netError = res.placeholder.netError;

@observer
class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null
        };

        this._bindFunc();
        this.afterSaleDetailModel = new AfterSaleDetailModel();
        this.afterSaleDetailModel.serviceNo = this.params.serviceNo;
        this.afterSaleDetailModel.loadingShow = this.$loadingShow;
        this.afterSaleDetailModel.loadingDismiss = this.$loadingDismiss;
        this.afterSaleDetailModel.toastShow = this.$toastShow;
        this.afterSaleDetailModel.navigationBarResetTitle = this.$NavigationBarResetTitle;
    }

    $navigationBarOptions = {
       // title: ['退款详情', '退货详情', '换货详情'][this.params.pageType],
        show: true,// false则隐藏导航
        title: '售后详情',
    };

    $NavigationBarDefaultLeftPressed = () => {
        this.$navigateBack('order/order/MyOrdersDetailPage');
    };

    _bindFunc() {
    }

    componentDidMount() {
        this.afterSaleDetailModel.loadPageData();
    }

    componentWillUnmount(){
        this.afterSaleDetailModel.stopTimer();
    }


    //**********************************ViewPart******************************************
    _render() {
        if (EmptyUtils.isEmpty(this.afterSaleDetailModel.pageData)) {

            if (this.afterSaleDetailModel.isLoaded === true) {
                return this._renderEmptyView();
            }else {
                return null;
            }
        }

        let pageData = this.afterSaleDetailModel.pageData;
        let {
            status,
            refundAccountAmount,
            refundCashAmount,
            refundPrice,
            reject,
            type
        } = pageData;
        let pageType = type - 1;
        let isShow_operationApplyView = status === 1;
        /** 退款成功、退货成功、换货变退款成功*/
        let isShow_refundDetailView = (pageType === 0 && status === 5) || (pageType === 1 && status === 5);

        let isShow_refuseReasonView = false;
        let refuseReasonViewType = 0;
        if (pageType === 0 && (status === 1 || status === 5) ||
            pageType === 1 && (status === 1 || status === 5)
        ){
            isShow_refuseReasonView = true;
        }else if (status === 6){
            isShow_refuseReasonView = true;
            refuseReasonViewType = 1;
        }

        // let isShow_shippingAddressView = false;
        // let isShow_backAddressView = false;
        // if (pageData === 1 && (status === 2 || status === 3 || status === 4 || status === 5)){
        //
        // }
        let logistics = [{
            title: '平台物流',
            value: '(fsdfsdf)',
            placeholder: '',
            expressNo: '111111',
            onPress: this.shopLogists
        },
            { title: '寄回物流', value: '1111', placeholder: '请填写寄回物流信息', expressNo: '1111', onPress: this.returnLogists }];
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TipView pageType={pageType} status={status}/>
                    <HeaderView pageType={pageType}
                                status={status}
                                headerTitle={pageData.headerTitle}
                                timeStr={pageData.timeString}
                    />
                    {isShow_operationApplyView ?
                        <OperationApplyView pageType={pageType}
                                            cancelPress={this.cancelPress}
                                            changePress={this.changePress}/> : null}
                    {
                        isShow_refuseReasonView ?
                            <RefuseReasonView type={refuseReasonViewType}
                                              refundPrice={refundPrice}
                                              reject={reject}
                            /> : null
                    }
                    {
                        isShow_refundDetailView ?
                            <RefundDetailView refundAccountAmount={refundAccountAmount}
                                              refundCashAmount={refundCashAmount}
                            /> : null
                    }
                    <ShippingAddressView/>
                    <BackAddressView/>
                    {
                        logistics.length > 0 ?
                            <LogisticsView data={logistics}
                            /> : null
                    }
                    {this.renderOrder()}
                    <GoodsItem
                        uri={pageData.specImg}
                        goodsName={pageData.productName}
                        salePrice={StringUtils.formatMoneyString(pageData.unitPrice)}
                        category={'规格：' + pageData.specValues}
                        goodsNum={pageData.quantity}
                        style={{ backgroundColor: DesignRule.white }}
                    />
                    <AfterSaleInfoView pageData={pageData}
                                       pageType={pageType}
                    />
                </ScrollView>
                <CustomerServiceView/>
            </View>
        );
    }

    _renderEmptyView(){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={()=> {this.afterSaleDetailModel.loadPageData()}}
                                  style={{alignItems: 'center'}}
                >
                    <UIImage source={netError} style={{height: 80, width: 80}}/>
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
                    backgroundColor: DesignRule.bgColor,
                    height: 40,
                    justifyContent: 'center',
                    paddingLeft: 15,
                    marginTop: -5
                }}>
                <UIText value={['退款订单', '退货订单', '换货订单'][this.params.pageType]}
                        style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
            </View>
        );
    };

    returnLogists = (expressNo) => {
        if (EmptyUtils.isEmpty(expressNo)) {
            this.$navigate('order/afterSaleService/FillReturnLogisticsPage', {
                pageData: this.state.pageData,
                callBack: this.afterSaleDetailModel.loadPageData
            });
        } else {
            this.$navigate('order/logistics/LogisticsDetailsPage', {
                orderId: '1',
                expressNo: expressNo
            });
        }
    };

    shopLogists = (expressNo) => {
        if (EmptyUtils.isEmpty(expressNo)) {
            this.$toastShow('请填写完整的退货物流信息\n才可以查看商家的物流信息');
            return;
        }
        this.$navigate('order/logistics/LogisticsDetailsPage', {
            orderNum: this.state.pageData.orderNum,
            expressNo: expressNo
        });
    };


    /**
     * 撤销、修改
     * @param cancel true -》撤销 、false -》修改申请
     */
    onPressOperationApply(cancel) {
        let that = this;
        // pageType 0 退款详情  1 退货详情   2 换货详情
        if (cancel) {
            let tips = ['确认撤销本次退款申请？', '确认撤销本次退货退款申请？', '确认撤销本次换货申请？'];
            Alert.alert('',
                tips[this.params.pageType],
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
            let { orderProductId, returnReason, remark, imgList, exchangePriceId, exchangeSpec, exchangeSpecImg, productId } = this.state.pageData;
            imgList = imgList || [];
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].imageThumbUrl = imgList[i].smallImg;
                imgList[i].imageUrl = imgList[i].originalImg;
            }
            this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                pageType: this.params.pageType,
                returnProductId: this.state.pageData.id,
                isEdit: true,
                callBack: this.afterSaleDetailModel.loadPageData,
                orderProductId,
                returnReason,
                remark,
                imgList,
                exchangePriceId,
                exchangeSpec,
                exchangeSpecImg,
                productId
            });

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        justifyContent: 'flex-end'
    },
    addressStyle: {}
});

export default ExchangeGoodsDetailPage;
