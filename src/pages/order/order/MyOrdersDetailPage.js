import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView, Text, Alert, DeviceEventEmitter
} from 'react-native';
import BasePage from '../../../BasePage';
import { MRText, NoMoreClick, UIText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import GoodsDetailItem from '../components/GoodsDetailItem';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import Toast from '../../../utils/bridge';
// import GoodsGrayItem from "../components/GoodsGrayItem";
import OrderApi from '../api/orderApi';
import { renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
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
import { SmoothPushPreLoadHighComponent } from '../../../comm/components/SmoothPushHighComponent';
import { GetAfterBtns, checkOrderAfterSaleService, judgeProduceIsContainActivityTypes } from './OrderType';
import CancelProdectsModal from '../components/orderDetail/CancelProdectsModal';
import { backToHome, routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar/NavigatorBar';
import LinearGradient from 'react-native-linear-gradient';

const buyerHasPay = res.buyerHasPay;
const productDetailHome = res.productDetailHome;
const productDetailMessage = res.productDetailMessage;
const tobePayIcon = res.dingdanxiangqing_icon_fuk;
const finishPayIcon = res.dingdanxiangqing_icon_yiwangcheng;
const hasDeliverIcon = res.dingdanxiangqing_icon_yifehe;
const refuseIcon = res.dingdanxiangqing_icon_guangbi;
const moreIcon = res.message_three;
const deleteIcon = res.delete_icon;
const back_white = res.button.back_white;

const { px2dp } = ScreenUtils;

@SmoothPushPreLoadHighComponent
@observer
export default class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            moreData: []
        };
    }

    $navigationBarOptions = {
        title: '订单详情',
        show: false// false则隐藏导航
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


    componentDidMount() {
        this.loadPageData();
        this.getCancelOrder();
        //接收刷新的通知
        this.listener = DeviceEventEmitter.addListener('REFRESH_ORDER', ()=> {
            this.loadPageData();
        })
    }

    componentWillUnmount() {
        orderDetailModel.stopTimer();
        this.listener && this.listener.remove();
    }

    showMore = () => {
        this.setState({ isShowShowMessageModal: true });
        this.messageModal && this.messageModal.open();
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        let leftIconArr = [buyerHasPay, tobePayIcon, buyerHasPay, hasDeliverIcon, finishPayIcon, refuseIcon, refuseIcon, refuseIcon, refuseIcon, refuseIcon];
        return (
            <View>
                <OrderDetailStatusView
                    leftTopIcon={leftIconArr[orderDetailModel.merchantOrder.status]}
                />
                {orderDetailModel.isAllVirtual ? null :
                    <DetailAddressView/>
                }
            </View>

        );
    };


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
                        ref={(ref)=>{ this.btnView = ref}}
                        openCancelModal = {(callBack)=>{
                            let isPay = true;
                            if (!callBack) {
                                isPay = false;
                                callBack = ()=>{this.cancelModal && this.cancelModal.open()}
                            }
                            this.cancelProdectsModal && this.cancelProdectsModal.open(orderDetailModel.platformOrderNo,callBack,isPay)
                        }}
                        switchButton={(moreData) => {
                            this.setState({ showDele: !this.state.showDele, moreData});
                        }}
                        dataHandleDeleteOrder={this.params.dataHandleDeleteOrder}
                        dataHandleConfirmOrder={this.params.dataHandleConfirmOrder}
                        loadPageData={() => this.loadPageData()}/>
                    { //这个代码应该与底部按钮（OrderDetailBottomButtonView）封装在一起
                        !this.state.showDele ? null :
                        <View style={{
                        position: 'absolute',
                        bottom: 45,
                        right: ScreenUtils.autoSizeWidth(180) - 50,
                        backgroundColor: 'white',
                        borderRadius: 5,
                            borderWidth: 1,
                            borderColor: DesignRule.bgColor
                    }}>
                            {this.state.moreData.map((item) => {
                               return ( <NoMoreClick style={{
                                   width: 100,
                                   height: 40,
                                   justifyContent: 'center',
                                   marginLeft: 10
                               }} onPress={() => {
                                 this.setState({ showDele: false });
                                 //与底部button点击用一套逻辑
                                 this.btnView && this.btnView.operationMenuClick(item);
                               }}>
                                   <UIText value={item.operation} style={{ color: '#666666', fontSize: 13 }}/>
                               </NoMoreClick>)
                            })}
                        </View>
                      }
                </View>
            );
        }

    };

    _render = () => {
        return (
            <View style={styles.container}>
                <LinearGradient start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                                colors={['#FF0050','#F94B35', '#FF2035','#F80759']}
                                locations={[0,0.3,0.7,1]}
                >
                    <NavigatorBar headerStyle={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderBottomWidth: 0
                    }}
                                  leftNavImage={back_white}
                                  leftPressed={() => {
                                      this.$navigateBack();
                                  }}
                                  title={'订单详情'}
                                  titleStyle={{color: 'white'}}
                                  renderRight={() => {
                                      return (
                                          <View style={{
                                              width: 30,
                                              height: 30,
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}>
                                              <Image source={moreIcon}
                                                     resizeMode={'stretch'}
                                                     style={{width: 20, height: 5, tintColor: 'white'}}/>
                                          </View>
                                      )
                                  }}
                                  rightPressed={() => {
                                      this.showMore();
                                  }}
                    />
                </LinearGradient>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
                {this.renderModal()}
            </View>
        );
    };
    renderItem = (item, index ) => {
        let resource = item.resource || {}
        let resourceType = resource.resourceType;
        let isPhoneGood = false
        let category = item.spec
        if (resourceType === 'TELEPHONE_CHARGE'){
            category = '充值号码：' + orderDetailModel.receiveInfo.receiverPhone
            isPhoneGood = true;
        }
        return (
            <GoodsDetailItem
                uri={item.specImg}
                goodsName={item.productName}
                salePrice={StringUtils.formatMoneyString(item.unitPrice, false)}
                category={category}
                goodsNum={item.quantity}
                activityCodes={item.activityList || []}
                style={{ backgroundColor: 'white' }}
                clickItem={() => {
                    this.clickItem(item, isPhoneGood);
                }}
                afterSaleService={GetAfterBtns(item)}
                afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, item)}
            />
        );

    };
    renderHeader = () => {
        return (
            <View style={{marginBottom: 10}}>
                {this.renderState()}
                {orderDetailModel.isPhoneOrder ?
                    <View style={{backgroundColor: 'white', height: ScreenUtils.autoSizeWidth(40), justifyContent: 'center'}}>
                        <MRText style={{color: DesignRule.textColor_mainTitle,
                            fontSize: DesignRule.fontSize_threeTitle_28,
                            marginLeft: ScreenUtils.autoSizeWidth(15)
                        }}>{'充值号码:' + orderDetailModel.receiveInfo.receiverPhone}</MRText>
                    </View> : null
                }
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
                                backToHome();
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
                            this.params.dataHandlecancel && this.params.dataHandlecancel();
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
        orderDetailModel.loadDetailInfo(this.params.merchantOrderNo || this.params.orderNo || '');
    }
    //去商品详情
    clickItem = (item,isPhoneGood) => {
        if(isPhoneGood){
            routePush('HtmlPage',{uri: '/pay/virtual-product'})
            return;
        }
        // 2://降价拍
        // 3://礼包
        let activityData = judgeProduceIsContainActivityTypes(item, [2, 3])
        if (activityData) {
            if (activityData.activityType === 3){
                this.$navigate(RouterMap.ProductDeletePage)
                return
            }
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
        //在按钮就查看售后详情的时候，是不用判断是否支持售后的
        if (menu.id !== 3 && !checkOrderAfterSaleService([item],item.status,orderDetailModel.baseInfo.nowTime,true)){
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
                    pageData: item,
                    merchantOrderNo: orderDetailModel.merchantOrderNo
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
