import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    // Image,
    FlatList,
    // TouchableWithoutFeedback,
    TouchableOpacity
    // AsyncStorage,
    // ImageBackground
} from 'react-native';
import BasePage from '../../BasePage';
import TopicDetailHeaderView from './components/TopicDetailHeaderView';
import TopicDetailSegmentView from './components/TopicDetailSegmentView';
import PriceExplain from '../product/components/PriceExplain';
import ScreenUtils from '../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import TopicApi from './api/TopicApi';
import user from '../../model/user';
import TopicDetailSelectPage from './TopicDetailSelectPage';
import PackageDetailSelectPage from './PackageDetailSelectPage';
import CommShareModal from '../../comm/components/CommShareModal';
import TopicDetailShowModal from './components/TopicDetailShowModal';
import DetailNavShowModal from '../product/components/DetailNavShowModal';
import apiEnvironment from '../../api/ApiEnvironment';
import DesignRule from '../../constants/DesignRule';
import {
    MRText as Text
} from '../../components/ui';

// const { px2dp } = ScreenUtils;
import EmptyUtils from '../../utils/EmptyUtils';
// import StringUtils from '../../utils/StringUtils';
// import CommModal from 'CommModal';
import DetailNavView from '../product/components/DetailNavView';

// const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
// import res from './res';

// const redEnvelopeBg = res.other.red_big_envelope;
// const tongyong_btn_close_white = res.button.tongyong_btn_close_white;
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import MessageAPI from '../message/api/MessageApi';
// import QYChatUtil from '../mine/page/helper/QYChatModel';
import { track, trackEvent } from '../../utils/SensorsTrack';
import DetailHeaderServiceModal from '../product/components/DetailHeaderServiceModal';
import ProductApi from '../product/api/ProductApi';


export default class TopicDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);

        console.log(this.params);
        this.state = {
            //类型: 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品
            activityType: parseInt(this.params.activityType),
            //参数还是详情
            selectedIndex: 0,
            //正常数据 礼包
            data: {},
            //活动数据  降价拍和秒杀活动数据
            activityData: {},
            canGetCoupon: false,
            couponData: null,
            hasGetCoupon: false,
            messageCount: 0,//消息数量

            loadingState: PageLoadingState.loading,
            netFailedInfo: {}
        };
    }

    _getPageStateOptions = () => {
        let superStatus = this._getSuperStatus();
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                buttonText: superStatus === 0 ? '去首页' : '重新加载',
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: superStatus === 0 ? (() => this.$navigateBackToHome()) : (() => this._getActivityData())
            }
        };
    };


    componentDidMount() {
        // this.getPromotion();
    }

    // getPromotion = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem(LASTSHOWPROMOTIONTIME);
    //         var currStr = new Date().getTime() + '';
    //         if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
    //             if (user.isLogin && EmptyUtils.isEmpty(user.upUserid)) {
    //                 HomeAPI.getReceivePackage({ type: 2 }).then((data) => {
    //                     if (!EmptyUtils.isEmpty(data.data)) {
    //                         this.setState({
    //                             canGetCoupon: true,
    //                             couponData: data.data
    //                         });
    //                         this.couponId = data.data.id;
    //                         AsyncStorage.setItem(LASTSHOWPROMOTIONTIME, currStr);
    //                     }
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //     }
    // };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'topic/TopicDetailPage') {
                    this._getActivityData();
                    this._getMessageCount();
                }
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.__timer__ && clearInterval(this.__timer__);
    }

    // getCoupon = () => {
    //     if (EmptyUtils.isEmpty(this.couponId)) {
    //         this.setState({
    //             canGetCoupon: false
    //         });
    //         this.$toastShow('领取失败！');
    //     } else {
    //         HomeAPI.givingPackageToUser({ id: this.couponId }).then((data) => {
    //             this.setState({
    //                 hasGetCoupon: true
    //             });
    //         }).catch((error) => {
    //             this.setState({
    //                 canGetCoupon: false
    //             });
    //             this.$toastShow(error.msg);
    //         });
    //
    //     }
    // };


    //数据
    _getActivityData = () => {
        if (this.state.activityType === 1) {
            TopicApi.seckill_findByCode({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.prodCode);
            }).catch((error) => {
                this._error(error);
            });
        } else if (this.state.activityType === 2) {
            TopicApi.activityDepreciate_findByCode({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.prodCode);
            }).catch((error) => {
                this._error(error);
            });
        } else if (this.state.activityType === 3) {
            TopicApi.findActivityPackageDetail({
                code: this.params.activityCode
            }).then((data) => {
                this.state.data = data.data || {};
                let superStatus = this._getSuperStatus();
                if (superStatus === 0) {
                    this.setState({
                        loadingState: PageLoadingState.fail,
                        netFailedInfo: { msg: `该商品走丢了\n去看看别的商品吧` }
                    });
                } else {
                    this.setState({
                        loadingState: PageLoadingState.success
                    }, () => {
                        /*商品详情埋点*/
                        const { packageCode, name, levelPrice, groupPrice, priceType } = this.state.data;
                        track(trackEvent.ProductDetail, {
                            spuCode: packageCode,
                            spuName: name,
                            priceShareStore: groupPrice,
                            pricePerCommodity: levelPrice,
                            priceType: priceType === 2 ? 100 : user.levelRemark
                        });

                        //礼包弹框去掉
                        // if (this.state.data.type === 2 && !this.isNoFirstShow) {//1普通礼包  2升级礼包  展示一次
                        //     this.isNoFirstShow = true;
                        //     this.TopicDetailShowModal.show('温馨提醒', `${data.data.name}`, null, `秀购升级礼包为定制特殊商品，购买后即可立即享受晋升权限，该礼包产品不可退款，如有产品质量问题，可联系客服进行申诉`);
                        // }
                    });
                }
            }).catch((error) => {
                this._error(error);
            });
        }
    };

    //消息数据
    _getMessageCount = () => {
        if (user.token) {
            MessageAPI.getNewNoticeMessageCount().then(result => {
                if (!EmptyUtils.isEmpty(result.data)) {
                    const { shopMessageCount, noticeCount, messageCount } = result.data;
                    this.setState({
                        messageCount: shopMessageCount + noticeCount + messageCount
                    });
                }
            }).catch((error) => {
            });
        }
    };


    //倒计时到0的情况刷新页面
    updateActivityStatus = () => {
        this._getActivityData();
    };

    _needPushToNormal = () => {
        if (this.havePushDone) {//现在视图出现会刷新数据,,跳过一次就不跳了
            return;
        }
        const { status, type } = this.state.activityData;
        //如果降价拍,秒杀&&结束&&需要   5秒跳转普通详情
        if (this.state.activityType !== 3 && (status === 4 || status === 5) && type === 1) {
            this.__timer__ = setTimeout(() => {
                this.havePushDone = true;
                this.$navigate('product/ProductDetailPage', {
                    productCode: this.state.activityData.prodCode
                });
            }, 5000);
        }
    };

    _error = (error) => {
        this.setState({
            loadingState: PageLoadingState.fail,
            netFailedInfo: error
        });
    };

    _getSuperStatus = () => {
        const { status } = this.state.data;
        const { productStatus } = this.state.activityData;
        let superStatus = this.state.activityType === 3 ? status : productStatus;
        //产品规格状0 ：产品删除 1：产品上架 2：产品下架(包含未上架的所有状态，出去删除状态)
        return superStatus;
    };

    _getProductDetail = (prodCode) => {
        let superStatus = this._getSuperStatus();
        if (superStatus === 0) {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: { msg: `该商品走丢了\n去看看别的商品吧` }
            });
        } else {
            this.setState({
                loadingState: PageLoadingState.success
            }, () => {
                ProductApi.getProductDetailByCode({
                    code: prodCode
                }).then((data) => {
                    this.setState({
                        data: data.data || {}
                    }, () => {
                        /*商品详情埋点*/
                        const { prodCode, name, priceType, minPrice, maxPrice, groupPrice } = data.data || {};
                        track(trackEvent.ProductDetail, {
                            spuCode: prodCode,
                            spuName: name,
                            priceShareStore: groupPrice,
                            pricePerCommodity: minPrice !== maxPrice ? `${minPrice}-${maxPrice}` : `${minPrice}`,
                            priceType: priceType === 2 ? 100 : user.levelRemark
                        });

                        this._needPushToNormal();
                        this.TopicDetailHeaderView.updateTime(this.state.activityData, this.state.activityType, this.updateActivityStatus);
                    });
                }).catch((error) => {
                    this.$toastShow(error.msg);
                });
            });
        }
    };

    //订阅
    _followAction = () => {
        const itemData = this.state.activityData;
        let param = {
            'activityId': itemData.id,
            'activityType': this.state.activityType,
            'type': itemData.notifyFlag ? 0 : 1,
            'userCode': user.code
        };
        TopicApi.followAction(
            param
        ).then(result => {
            this._getActivityData();
            this.$toastShow(`已关注本商品,\n活动开始前3分钟会有消息通知您`);
        }).catch(error => {
            this.$toastShow(error.msg);
        });

    };

    //选择规格确认 秒杀 降价拍
    _selectionViewConfirm = (amount, skuCode) => {
        let orderProducts = [];
        orderProducts.push({
            skuCode: skuCode,
            num: amount,
            code: this.state.activityData.activityCode,
            productCode: this.state.activityData.prodCode,
            spuName: this.state.data.name
        });
        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                orderType: this.state.activityType,
                orderProducts: orderProducts,
                activityCode: this.state.activityData.activityCode
            }
        });
    };

    //选择规格确认 礼包
    _selectionViewPakageConfirm = (amount, selectData) => {
        let priceList = [];
        selectData.forEach((item) => {
            priceList.push({
                // num: 1,
                skuCode: item.skuCode,
                prodCode: item.prodCode
                // productName: item.productName,
                // sourceId: item.id,
                // spec: item.specValues,
                // specImg: item.specImg
            });
        });
        //
        // let orderProducts = [{
        //     num: 1,
        //     priceId: this.state.data.packageCode,
        //     productId: this.state.data.packageCode,
        //     priceList: priceList
        // }];

        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                activityCode: this.params.activityCode,
                orderType: 3,
                orderSubType: this.state.data.type === 2 ? 3 : 4,
                orderProducts: priceList,
                channel: 2,
                source: 2,
                quantity: 1
            }
        });
    };

    //segment 详情0 参数1 选项
    _segmentViewOnPressAtIndex = (index) => {
        this.setState({
            selectedIndex: index
        });
    };

    //立即购买
    _bottomAction = (type) => {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        if (type === 1) {//设置提醒
            this._followAction();
        } else if (type === 2) {//立即拍
            this.state.activityType === 3 ? this.PackageDetailSelectPage.show(
                this.state.data,
                this._selectionViewPakageConfirm
            ) : this.TopicDetailSelectPage.show(
                this.state.activityData,
                this.state.activityType,
                this._selectionViewConfirm
            );
        }
    };

    _renderListHeader = () => {
        return <TopicDetailHeaderView data={this.state.data}
                                      ref={(e) => {
                                          this.TopicDetailHeaderView = e;
                                      }}
                                      activityType={this.state.activityType}
                                      activityData={this.state.activityData}
                                      navigation={this.props.navigation}
                                      serviceAction={() => {
                                          this.DetailHeaderServiceModal.show(this.state.data);
                                      }}
                                      showDetailModal={() => {
                                          this.TopicDetailShowModal.show('降价拍玩法规则', null, null, `1、参与降价拍的商品，活动开始之后，商品价格由高到低依次递减，直到竞买人应价，商品库存有限，活动时间有限，先拍先得。\n2、一个降价拍商品，每人只能抢购一件，下单之后不可立马取消订单，直到该商品结束降价拍活动，才开放退货退款入口。\n3、降价拍商品不与其它优惠同享。`);
                                      }}/>;
    };

    _renderSectionHeader = () => {
        return <TopicDetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { content } = this.state.data;
        if (this.state.selectedIndex === 0) {
            content = content || '';
            content = content.split(',') || [];
            let html = '';
            content.forEach((item) => {
                html = `${html}<p><img src=${item}></p>`;
            });
            return <View>
                <HTML html={html}
                      imagesMaxWidth={ScreenUtils.width}
                      imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                      containerStyle={{ backgroundColor: '#fff' }}/>
                <PriceExplain/>
            </View>;
        } else {
            return <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{
                        marginHorizontal: 16,
                        marginVertical: 16,
                        borderWidth: 0.5,
                        borderColor: DesignRule.lineColor_inColorBg
                    }}
                    renderItem={this._renderSmallItem}
                    ItemSeparatorComponent={this._renderSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.activityType === 3 ? this.state.data.paramValueList || [] : this.state.data.paramList || []}/>
                <PriceExplain/>
            </View>;
        }
    };

    _renderSmallItem = ({ item }) => {
        return <View style={{ flexDirection: 'row', height: 35 }}>
            <View style={{ backgroundColor: DesignRule.lineColor_inGrayBg, width: 70, justifyContent: 'center' }}>
                <Text style={{
                    marginLeft: 10,
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12
                }} allowFontScaling={false}>{item.paramName || ''}</Text>
            </View>
            <Text style={{
                flex: 1,
                alignSelf: 'center',
                marginLeft: 20,
                color: DesignRule.textColor_instruction,
                fontSize: 12
            }} allowFontScaling={false}>{item.paramValue || ''}</Text>
        </View>;
    };

    _renderSeparatorComponent = () => {
        return <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>;
    };
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < 44) {
            this.st = 0;
        } else if (Y < ScreenUtils.autoSizeWidth(375)) {
            this.st = (Y - 44) / (ScreenUtils.autoSizeWidth(375) - 44);
        } else {
            this.st = 1;
        }
        this.DetailNavView.updateWithScale(this.st);
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    };

    // _renderCouponModal = () => {
    //
    //     let view = (
    //         <TouchableWithoutFeedback onPress={() => {
    //             this.setState({
    //                 canGetCoupon: false
    //             });
    //             this.$navigate('mine/userInformation/MyCashAccountPage', { availableBalance: user.availableBalance });
    //         }}>
    //             <View style={{ position: 'absolute', bottom: 18, left: 0, right: 0, alignItems: 'center' }}>
    //                 <Text style={{ color: 'white', fontSize: px2dp(24) }}>
    //                     领取成功
    //                 </Text>
    //                 <Text style={{ color: 'white', fontSize: px2dp(11), marginTop: px2dp(5) }}>
    //                     可前往我的-
    //                     <Text style={{ textDecorationLine: 'underline' }}>现金账户</Text>
    //                     查看
    //                 </Text>
    //             </View>
    //         </TouchableWithoutFeedback>
    //     );
    //
    //     let button = (
    //         <TouchableWithoutFeedback onPress={this.getCoupon}>
    //             <Text
    //                 style={{ position: 'absolute', top: px2dp(220), left: px2dp(115), color: '#80522A', fontSize: 14 }}>
    //                 {`立即\n领取`}
    //             </Text>
    //         </TouchableWithoutFeedback>
    //     );
    //
    //     return (
    //         <CommModal visible={this.state.canGetCoupon}>
    //             <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center', justifyContent: 'center' }}>
    //                 <ImageBackground source={redEnvelopeBg} style={{
    //                     height: px2dp(362), width: px2dp(257),
    //                     alignItems: 'center'
    //                 }}>
    //                     <Text style={{ color: 'white', includeFontPadding: false, fontSize: px2dp(14), marginTop: 26 }}>
    //                         {EmptyUtils.isEmpty(this.state.couponData) ? null : StringUtils.encryptPhone(this.state.couponData.phone)}
    //                     </Text>
    //                     <Text style={{ color: 'white', includeFontPadding: false, fontSize: px2dp(14) }}>
    //                         赠送了你一个红包
    //                     </Text>
    //
    //                     <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(60), marginTop: 20 }}>
    //                         {EmptyUtils.isEmpty(this.state.couponData) ? null : StringUtils.formatMoneyString(this.state.couponData.price, false)}
    //                         <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(15) }}>
    //                             元
    //                         </Text>
    //                     </Text>
    //                     <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(14), marginTop: 12 }}>
    //                         红包抵扣金
    //                     </Text>
    //                     {this.state.hasGetCoupon ? null : button}
    //
    //                     {this.state.hasGetCoupon ? view : null}
    //                 </ImageBackground>
    //                 <TouchableWithoutFeedback onPress={() => {
    //                     this.setState({
    //                         canGetCoupon: false
    //                     });
    //                 }}>
    //                     <Image source={tongyong_btn_close_white} style={{
    //                         position: 'absolute',
    //                         top: 107,
    //                         right: 35,
    //                         width: 24,
    //                         height: 24
    //                     }}/>
    //                 </TouchableWithoutFeedback>
    //             </View>
    //         </CommModal>
    //     );
    // };

    _render() {
        let superStatus = this._getSuperStatus();
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={superStatus === 0 ? '暂无商品' : '商品详情'} leftPressed={() => {
                        this.$navigateBack();
                    }}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContainer)}
            </View>
        );
    }

    _renderContainer = () => {
        let bottomTittle, colorType;
        const { activityType } = this.state;
        if (this.state.activityType === 3) {
            //buyTime当前时间是否可购买 userBuy是否有权限
            //leftBuyNum剩余购买数量 buyLimit限购数量(-1: 不限购)
            const { buyTime, userBuy, leftBuyNum, buyLimit } = this.state.data;
            bottomTittle = '立即购买';
            if (buyTime && userBuy && buyLimit !== -1 && leftBuyNum === 0) {//可以买&&限购&&0
                bottomTittle = `每人限购${buyLimit}次（您已购买过本商品）`;
            } else if (buyTime && userBuy) {
                colorType = 2;
            }
            //未登录先让看
            if (!user.isLogin) {
                colorType = 2;
            }
        } else {
            //状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
            const { notifyFlag, surplusNumber, limitNumber, limitFlag, status, beginTime } = this.state.activityData;
            if (status === 1) {
                if (beginTime - new Date().getTime() > 3 * 60 * 1000) {
                    if (notifyFlag === 1) {
                        bottomTittle = '开始前3分钟提醒';
                    } else {
                        bottomTittle = '设置提醒';
                        colorType = 1;
                    }
                } else {
                    bottomTittle = '即将开始';
                }
            } else if (status === 4 || status === 5) {
                bottomTittle = '已结束';
            } else {
                if (surplusNumber === 0) {
                    bottomTittle = activityType === 1 ? '已抢完' : '已拍完';
                } else if (limitNumber !== -1 && limitFlag === 1) {
                    bottomTittle = `每人限购${limitNumber}次\n(您已购买过本商品）`;
                } else {
                    bottomTittle = activityType === 1 ? '立即抢' : '立即拍';
                    colorType = 2;
                }
            }
        }
        //已下架 不能点击
        let superStatus = this._getSuperStatus();
        let disable = superStatus === 2;
        if (disable) {
            colorType = 0;
        }

        let productName, productImgUrl, originalPrice, groupPrice,
            v0Price;
        if (this.state.activityType === 3) {
            const { name, imgUrl } = this.state.data || {};
            productName = name || '';
            productImgUrl = imgUrl;
            v0Price = (this.state.data || {}).v1 || '';
        } else {
            const { name, imgUrl } = this.state.data || {};
            productName = name || '';
            productImgUrl = imgUrl;
            v0Price = (this.state.data || {}).v0Price || '';
        }
        originalPrice = (this.state.data || {}).originalPrice || '';
        groupPrice = (this.state.data || {}).groupPrice || '';

        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                {/*导航栏事件和动画*/}
                <DetailNavView ref={(e) => this.DetailNavView = e}
                               source={productImgUrl}
                               messageCount={this.state.messageCount}
                               navBack={() => {
                                   this.$navigateBack();
                               }}
                               navRLeft={() => {
                                   this.$navigate('shopCart/ShopCart', {
                                       hiddeLeft: false
                                   });
                               }}
                               navRRight={() => {
                                   this.DetailNavShowModal.show(this.state.messageCount, (item) => {
                                       switch (item.type) {
                                           case 0:
                                               if (!user.isLogin) {
                                                   this.$navigate('login/login/LoginPage');
                                                   return;
                                               }
                                               this.$navigate('message/MessageCenterPage');
                                               break;
                                           case 1:
                                               this.$navigate('home/search/SearchPage');
                                               break;
                                           case 2:
                                               this.shareModal.open();
                                               break;
                                           case 3:
                                               setTimeout(() => {
                                                   track(trackEvent.ClickOnlineCustomerService, {customerServiceModuleSource: 2});
                                                   // QYChatUtil.qiYUChat();
                                               }, 100);
                                               break;
                                       }
                                   });
                               }}/>

                <SectionList onScroll={this._onScroll}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: [{}] }]}
                             scrollEventThrottle={10}/>
                {/*下架提示disable*/}
                <View style={{
                    height: 49 + ScreenUtils.safeBottom + (disable ? 20 : 0),
                    backgroundColor: 'white'
                }}>
                    {disable ? <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 20,
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <Text style={{ color: DesignRule.white, fontSize: 13 }} allowFontScaling={false}>商品已经下架啦~</Text>
                    </View> : null}
                    {/*正常购买按钮 colorType === 2红  1蓝  0灰*/}
                    <TouchableOpacity style={{
                        height: 49,
                        backgroundColor: colorType === 1 ? '#33B4FF' : (colorType === 2 ? DesignRule.mainColor : '#CCCCCC'),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => this._bottomAction(colorType)} disabled={!(colorType === 1 || colorType === 2)}>
                        <Text style={{
                            color: 'white',
                            fontSize: 14, textAlign: 'center'
                        }} allowFontScaling={false}>{bottomTittle}</Text>
                    </TouchableOpacity>
                </View>

                {/*规格选择*/}
                {this.state.activityType === 3 ?
                    <PackageDetailSelectPage ref={(ref) => this.PackageDetailSelectPage = ref}/> :
                    <TopicDetailSelectPage ref={(ref) => this.TopicDetailSelectPage = ref}/>}

                {/*分享*/}
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                trackParmas={{
                                    spuCode: this.params.activityCode,
                                    spuName: productName
                                }}
                                trackEvent={trackEvent.Share}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: productImgUrl,
                                    titleStr: productName,
                                    priceStr: `￥${originalPrice}`,
                                    retailPrice: `￥${v0Price}`,
                                    spellPrice: `￥${groupPrice}`,
                                    QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.code || ''}`
                                }}
                                webJson={{
                                    title: activityType === 1 ? '超值秒杀!' : activityType === 2 ? '秀一秀,赚到够!' : productName,
                                    dec: activityType === 3 ? '商品详情' : '[秀购]发现一个很给力的活动,快去看看!',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.code || ''}`,
                                    thumImage: productImgUrl
                                }}
                                miniProgramJson={{
                                    title: activityType === 1 ? '超值秒杀!' : activityType === 2 ? '秀一秀,赚到够!' : productName,
                                    dec: activityType === 3 ? '商品详情' : '[秀购]发现一个很给力的活动,快去看看!',
                                    thumImage: 'logo.png',
                                    hdImageURL: productImgUrl,
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/index/index?type=${this.params.activityType}&id=${this.params.activityCode}&inviteId=${user.code || ''}`
                                }}/>
                {/*弹框提示介绍*/}
                <TopicDetailShowModal ref={(ref) => {
                    this.TopicDetailShowModal = ref;
                }}/>
                {/*点击nav更多*/}
                <DetailNavShowModal ref={(ref) => {
                    this.DetailNavShowModal = ref;
                }}/>
                <DetailHeaderServiceModal ref={(ref) => this.DetailHeaderServiceModal = ref}/>
                {/*{this._renderCouponModal()}*/}
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    opacityView: {
        height: ScreenUtils.headerHeight,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        opacity: 0
    }
});

