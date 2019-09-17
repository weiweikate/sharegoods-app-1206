/**
 * pageType 0 退款详情  1 退货详情   2 换货详情
 * returnProductId
 */
import React from 'react';
import {
    Alert,
    DeviceEventEmitter,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import { MRText, UIImage, UIText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import GoodsItem from '../components/GoodsGrayItem';
// import DateUtils from '../../../utils/DateUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import OrderApi from '../api/orderApi';
import DesignRule from '../../../constants/DesignRule';
import AfterSaleDetailModel from './AfterSaleDetailModel';
import {
    AfterSaleInfoView,
    BackAddressView,
    FillAddressView,
    HeaderView,
    OperationApplyView,
    RefundDetailView,
    StatusInfoView
} from './components';
import { observer } from 'mobx-react';
import res from '../res';
import RouterMap from '../../../navigation/RouterMap';
import { AfterStatus, isRefundFail, PageType, SubStatus } from './AfterType';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar/NavigatorBar';
import ScreenUtils from '../../../utils/ScreenUtils';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { beginChatType, QYChatTool } from '../../../utils/QYModule/QYChatTool';
import LinearGradient from 'react-native-linear-gradient';

const {
    PAGE_AREFUND,
    PAGE_SALES_RETURN,
    PAGE_EXCHANGE
} = PageType;

const {
    STATUS_WAREHOUSE_CONFIRMED,  //待仓库确认
    STATUS_PLATFORM_PROCESSING, //待平台处理
    STATUS_SUCCESS,              //售后完成
    STATUS_FAIL
} = AfterStatus;

const {
    REFUSE_AFTER      //拒绝售后
} = SubStatus;


const netError = res.placeholder.netError;
const arrow_right_black = res.button.arrow_right_black;
const back_white = res.button.back_white;
const tongyong_icon_kefu_white = res.afterSaleService.tongyong_icon_kefu_white;

@observer
class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};

        this._bindFunc();
        this.afterSaleDetailModel = new AfterSaleDetailModel();
        this.afterSaleDetailModel.serviceNo = this.params.serviceNo;
        this.afterSaleDetailModel.loadingShow = this.$loadingShow;
        this.afterSaleDetailModel.loadingDismiss = this.$loadingDismiss;
        this.afterSaleDetailModel.toastShow = this.$toastShow;
    }

    $navigationBarOptions = {
        show: false,// false则隐藏导航
        title: '售后进度'
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
            exchangeExpress = {},
            service: {
                status,
                subStatus,
                type,
                remarks,
                reason,
                applyRefundAmount,
                description,
                imgList,
                serviceNo,
                createTime
            },
            refundInfo,
            product: {
                specImg,
                productName,
                unitPrice,
                spec,
                quantity,
                merchantOrderNo
            },
            refundAddress
        } = pageData;

        let pageType = type;
        let isShow_operationApplyView = status === 1;

        let isShow_refundDetailView = false;
        /** 退款成功、退货成功、换货变退款成功,退款没有失败*/
        if ((pageType === PAGE_AREFUND || pageType === PAGE_SALES_RETURN) && status === STATUS_SUCCESS && !isRefundFail(refundInfo.status)) {
            isShow_refundDetailView = true;
        }


        //平台物流有、且为换货，就展示
        let isShow_shippingAddressView = !EmptyUtils.isEmpty(exchangeExpress) && pageType === PAGE_EXCHANGE;
        let isShow_backAddressView = false;
        if (pageType === PAGE_SALES_RETURN || pageType === PAGE_EXCHANGE) {
            if ([STATUS_WAREHOUSE_CONFIRMED, STATUS_PLATFORM_PROCESSING, STATUS_SUCCESS].indexOf(status) !== -1) {
                isShow_backAddressView = true;
            }
            if (status === STATUS_FAIL && subStatus === REFUSE_AFTER) {
                isShow_backAddressView = true;
            }

        }

        let isShow_afterInfo = !isShow_backAddressView;
        return (
            <View style={styles.container}>
                <LinearGradient start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FF0050', '#FC5D39']}
                >
                    <NavigatorBar headerStyle={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderBottomWidth: 0
                    }}
                                  leftNavImage={back_white}
                                  leftPressed={() => {
                                      this.$navigateBack();
                                  }}
                                  title={'售后进度'}
                                  titleStyle={{ color: 'white' }}
                                  renderRight={() => {
                                      return (
                                          <View style={{
                                              width: 30,
                                              height: 30,
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}>
                                              <Image source={tongyong_icon_kefu_white}
                                                     resizeMode={'stretch'}
                                                     style={{ width: 20, height: 20 }}/>
                                          </View>
                                      );
                                  }}
                                  rightPressed={() => {
                                      this.connetKefu();
                                  }}
                    />
                </LinearGradient>
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
                    <HeaderView pageType={pageType}
                                status={status}
                                subStatus={subStatus}
                                refundStatus={refundInfo.status}
                    />
                    {isShow_operationApplyView ?
                        <OperationApplyView pageType={pageType}
                                            cancelPress={this.cancelPress}
                                            changePress={this.changePress}/> : null}
                    <StatusInfoView pageType={pageType}
                                    status={status}
                                    subStatus={subStatus}
                                    remarks={remarks}
                                    refundStatus={refundInfo.status}
                    />
                    <FillAddressView
                        afterSaleDetailModel={this.afterSaleDetailModel}
                        status={status}
                    />
                    {isShow_shippingAddressView ? <BackAddressView
                        title={'平台寄回物流信息'}
                        data={exchangeExpress}
                        onPress={this.shopLogists}
                    /> : null}
                    {isShow_backAddressView ? <BackAddressView
                        title={'用户寄回物流信息'}
                        data={refundAddress}
                        onPress={this.returnLogists}
                    /> : null}
                    {
                        isShow_refundDetailView ?
                            <RefundDetailView refundInfo={refundInfo}
                            /> : null
                    }
                    {
                        isShow_afterInfo ? this.renderOrder() : null
                    }
                    {
                        isShow_afterInfo ?
                            <GoodsItem
                                uri={specImg}
                                goodsName={productName}
                                salePrice={StringUtils.formatMoneyString(unitPrice)}
                                category={spec}
                                goodsNum={quantity}
                                style={{ backgroundColor: DesignRule.white }}
                                renderExtraView={() => {
                                    if (pageType === PAGE_AREFUND || pageType === PAGE_SALES_RETURN) {
                                        return (
                                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                                <MRText style={{
                                                    fontSize: 12,
                                                    color: DesignRule.textColor_instruction
                                                }}>退款金额：</MRText>
                                                <MRText style={{
                                                    fontSize: 12,
                                                    color: DesignRule.textColor_mainTitle,
                                                    fontWeight: '600'
                                                }}>{'¥' + applyRefundAmount}</MRText>
                                            </View>
                                        );
                                    }

                                    return null;
                                }}
                            /> : null
                    }

                    {
                        isShow_afterInfo ? <AfterSaleInfoView pageData={pageData}
                                                              pageType={pageType}
                                                              afterSaleInfo={{
                                                                  reason,
                                                                  description,
                                                                  imgList,
                                                                  refundPrice: applyRefundAmount,
                                                                  quantity,
                                                                  serviceNo,
                                                                  merchantOrderNo,
                                                                  createTime

                                                              }}
                        /> : null
                    }
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.item_style}
                        onPress={() => {
                            this.gotoNegotiateHistory();
                        }}
                    >
                        <MRText style={styles.item_text}>协商记录</MRText>
                        <UIImage style={styles.item_arrow} source={arrow_right_black} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    <View style={{ height: ScreenUtils.safeBottom }}/>
                </ScrollView>
            </View>
        );
    }

    connetKefu = () => {
        track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 4 });
        let pageData = this.afterSaleDetailModel.pageData;
        if (EmptyUtils.isEmpty(pageData)) {
            return;
        }
        let supplierCode = pageData.service.merchantCode;
        if (!supplierCode) {
            this.kefuData = {};
        }
        let pictureUrlString = pageData.product.specImg || '';
        let desc = pageData.product.productName || '';
        let merchantOrderNo = pageData.product.merchantOrderNo || '';
        if (this.kefuData) {
            QYChatTool.beginQYChat({
                    routePath: '',
                    urlString: '',
                    title: this.kefuData.title || '平台客服',
                    shopId: this.kefuData.shopId || '',
                    chatType: beginChatType.BEGIN_FROM_ORDER,
                    data: {
                        title: merchantOrderNo,
                        desc,
                        pictureUrlString,
                        urlString: '',
                        note: ''
                    }
                }
            );
        } else {
            OrderApi.getProductShopInfoBySupplierCode({ supplierCode }).then((data) => {
                    this.kefuData = data.data;
                    QYChatTool.beginQYChat({
                            routePath: '',
                            urlString: '',
                            title: this.kefuData.title || '平台客服',
                            shopId: this.kefuData.shopId || '',
                            chatType: beginChatType.BEGIN_FROM_ORDER,
                            data: {
                                title: merchantOrderNo,
                                desc,
                                pictureUrlString,
                                urlString: '/' + merchantOrderNo,
                                note: ''
                            }
                        }
                    );
                }
            ).catch((e) => {
                QYChatTool.beginQYChat({
                        routePath: '',
                        urlString: '',
                        title: '平台客服',
                        shopId: '',
                        chatType: beginChatType.BEGIN_FROM_ORDER,
                        data: {
                            title: merchantOrderNo,
                            desc,
                            pictureUrlString,
                            urlString: '/' + merchantOrderNo,
                            note: ''
                        }
                    }
                );
            });
        }
    };


    _renderEmptyView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
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
                <NavigatorBar headerStyle={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    borderBottomWidth: 0
                }}
                              leftPressed={() => {
                                  this.$navigateBack();
                              }}
                              title={'售后进度'}

                />
            </View>
        );
    }

    gotoNegotiateHistory() {
        this.$navigate(RouterMap.NegotiationHistoryPage, { serviceNo: this.params.serviceNo });

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
                    marginTop: 10
                }}>
                <UIText value={'售后信息'}
                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
            </View>
        );
    };

    returnLogists = (expressNo, expressCode, manyLogistics, expressName) => {
        if (EmptyUtils.isEmpty(expressNo)) {
            this.$navigate('order/afterSaleService/FillReturnLogisticsPage', {
                pageData: { productOrderNo: this.afterSaleDetailModel.pageData.product.productOrderNo },
                callBack: () => {
                    this.afterSaleDetailModel.loadPageData();
                }
            });
        } else {
            this.$navigate('order/logistics/LogisticsDetailsPage', {
                expressNo: expressNo,
                expressCode: expressCode,
                expressName: expressName
            });
        }
    };

    shopLogists = (expressNo, expressCode, manyLogistics, expressName) => {
        // if (EmptyUtils.isEmpty(expressNo)) {
        //     this.$toastShow('请填写完整的退货物流信息\n才可以查看商家的物流信息');
        //     return;
        // }
        if (manyLogistics) {
            this.$navigate(RouterMap.AfterLogisticsListView, {
                serviceNo: this.params.serviceNo
            });
        } else {
            this.$navigate('order/logistics/LogisticsDetailsPage', {
                expressNo: expressNo,
                expressCode: expressCode,
                expressName: expressName
            });
        }
    };

    /**
     * 撤销、修改
     * @param cancel true -》撤销 、false -》修改申请
     */
    onPressOperationApply(cancel) {
        let that = this;
        // pageType 0 退款详情  1 退货详情   2 换货详情
        let pageType = this.afterSaleDetailModel.pageData.service.type - 1;
        let num = this.afterSaleDetailModel.pageData.service.maxRevokeTimes - this.afterSaleDetailModel.pageData.service.hadRevokeTimes || 0;
        if (cancel) {
            let tips = ['确认撤销本次退款申请？您最多只能发起' + num + '次',
                '确认撤销本次退货退款申请？您最多只能发起' + num + '次',
                '确认撤销本次换货申请？您最多只能发起' + num + '次'];
            if (num <= 0) {
                this.$toastShow('平台售后操作已到上限');
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
                                DeviceEventEmitter.emit('REFRESH_ORDER');
                                that.afterSaleDetailModel.userCancel();
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
            } else {
                imgList = imgList.split(',');
            }

            this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                pageType: type - 1,
                isEdit: true,
                callBack: () => {
                    this.afterSaleDetailModel.loadPageData();
                },
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
        flex: 1,
        backgroundColor: DesignRule.bgColor

    },
    addressStyle: {},
    item_style: {
        height: 50,
        marginTop: 10,
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
        height: 12
    }
});

export default ExchangeGoodsDetailPage;
