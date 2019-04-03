import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    // Image,
    FlatList,
    Alert
    // TouchableWithoutFeedback,
    // ImageBackground,
} from 'react-native';

import BasePage from '../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';
import DetailSegmentView from './components/DetailSegmentView';
import DetailBottomView from './components/DetailBottomView';
import PriceExplain from './components/PriceExplain';
import DetailNavView from './components/DetailNavView';
import SelectionPage from './SelectionPage';
import ScreenUtils from '../../utils/ScreenUtils';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import CommShareModal from '../../comm/components/CommShareModal';
import HTML from 'react-native-render-html';
import DetailNavShowModal from './components/DetailNavShowModal';
import apiEnvironment from '../../api/ApiEnvironment';
import { MRText as Text } from '../../components/ui/index';
// import CommModal from '../../../comm/components/CommModal';
import DesignRule from '../../constants/DesignRule';
import { track, trackEvent } from '../../utils/SensorsTrack';

// const { px2dp } = ScreenUtils;
import user from '../../model/user';
import EmptyUtils from '../../utils/EmptyUtils';
// import StringUtils from '../../../utils/StringUtils';
// import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
// import res from '../res';
import MessageApi from '../message/api/MessageApi';
import DetailHeaderServiceModal from './components/DetailHeaderServiceModal';
import DetailPromoteModal from './components/DetailPromoteModal';
import ProductApi from './api/ProductApi';
// import bridge from '../../../utils/bridge';

// const redEnvelopeBg = res.other.red_big_envelope;

/**
 * @author chenyangjun
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email chenyangjun@meeruu.com
 */

// const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
export default class ProductDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            goType: '',
            selectedIndex: 0,
            //活动数据
            activityData: {},
            activityType: 0,//请求到数据才能知道活动类型
            canGetCoupon: false,
            couponData: null,
            hasGetCoupon: false,
            messageCount: 0,//消息数量

            loadingState: PageLoadingState.loading,
            netFailedInfo: {}
        };
        this.couponId = null;
    }

    _getPageStateOptions = () => {
        const { productStatus } = this.state.data;
        //产品规格状0 ：产品删除 1：产品上架 2：产品下架(包含未上架的所有状态，出去删除状态) 3未开售
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                buttonText: productStatus === 0 ? '去首页' : '重新加载',
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: productStatus === 0 ? (() => this.$navigateBackToHome()) : (() => this._getProductDetail())
            }
        };
    };

    componentDidMount() {
        // this.getPromotion();
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'product/ProductDetailPage') {
                    this._getProductDetail();
                    this._getMessageCount();
                }
            }
        );
    }

    componentWillUnmount() {
        this.needUpdateDate && clearTimeout(this.needUpdateDate);
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    // getPromotion = async () => {
    //     try {
    //         if (user.isLogin) {
    //             const value = await AsyncStorage.getItem(LASTSHOWPROMOTIONTIME + user.id);
    //             var currStr = new Date().getTime() + '';
    //             if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
    //                 if (user.isLogin && EmptyUtils.isEmpty(user.upUserid)) {
    //                     HomeAPI.getReceivePackage({ type: 2 }).then((data) => {
    //                         if (!EmptyUtils.isEmpty(data.data)) {
    //                             this.couponModal && this.couponModal.open();
    //                             this.setState({
    //                                 canGetCoupon: true,
    //                                 couponData: data.data
    //                             });
    //                             this.couponId = data.data.id;
    //                             AsyncStorage.setItem(LASTSHOWPROMOTIONTIME + user.id, currStr);
    //                         }
    //                     });
    //                 }
    //             }
    //         }
    //
    //     } catch (error) {
    //     }
    // };

    //
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
    //     }
    // };

    //数据
    _getProductDetail = () => {
        ProductApi.getProductDetailByCode({
            // code: 'SPU00000088'
            code: this.params.productCode
        }).then((data) => {
            this._savaData(data.data || {});
        }).catch((error) => {
            this._error(error);
        });
    };
    //活动数据
    _getQueryByProductId = () => {
        const { prodCode } = this.state.data;
        if (!prodCode) {
            return;
        }
        ProductApi.queryByProductCode({
            productCode: prodCode
        }).then((data) => {
            this.$loadingDismiss();
            let dataTemp = data.data || {};
            this.state.activityType = dataTemp.activityType;
            if (dataTemp.activityType === 2 && dataTemp.depreciate) {
                this.setState({
                    activityData: dataTemp.depreciate
                }, () => {
                    this.DetailHeaderView && this.DetailHeaderView.updateTime(this.state.activityData, this.state.activityType, this._getQueryByProductId);
                });
            } else if (dataTemp.activityType === 1 && dataTemp.seckill) {
                this.setState({
                    activityData: dataTemp.seckill
                }, () => {
                    this.DetailHeaderView && this.DetailHeaderView.updateTime(this.state.activityData, this.state.activityType, this._getQueryByProductId);
                });
            }
        }).catch((error) => {
            this.$loadingDismiss();
        });
    };


    //消息数据
    _getMessageCount = () => {
        if (user.token) {
            MessageApi.getNewNoticeMessageCount().then(result => {
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

    _savaData = (data) => {
        let { productStatus, upTime, now } = data;
        //产品规格状0 ：产品删除 1：产品上架 2：产品下架(包含未上架的所有状态，出去删除状态) 3未开售
        if (productStatus === 0) {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: { msg: `该商品走丢了\n去看看别的商品吧` }
            });
        } else {
            this.setState({
                loadingState: PageLoadingState.success,
                data: data
            }, () => {
                /*商品详情埋点*/
                const { prodCode, name, priceType, minPrice, maxPrice, groupPrice } = data || {};
                track(trackEvent.ProductDetail, {
                    spuCode: prodCode,
                    spuName: name,
                    priceShareStore: groupPrice,
                    pricePerCommodity: minPrice !== maxPrice ? `${minPrice}-${maxPrice}` : `${minPrice}`,
                    priceType: priceType === 2 ? 100 : user.levelRemark
                });
                this._getQueryByProductId();
                /*productStatus===3的时候需要刷新*/
                if (productStatus === 3 && upTime && now) {
                    this.needUpdateDate && clearTimeout(this.needUpdateDate);
                    this.needUpdateDate = setTimeout(() => {
                        this._getProductDetail();
                    }, upTime - now + 500);
                }
            });
        }
    };

    _error = (error) => {
        this.setState({
            loadingState: PageLoadingState.fail,
            netFailedInfo: error
        });
    };

    _productActivityViewAction = () => {
        if (this.state.activityType === 1 || this.state.activityType === 2) {
            this.$navigate('topic/TopicDetailPage', {
                activityCode: this.state.activityData.activityCode,
                activityType: this.state.activityType
            });
        }
    };

    //去购物车
    _bottomViewAction = (type) => {
        switch (type) {
            case 'jlj':
                if (!user.isLogin) {
                    Alert.alert('提示', '登录后分享才能获取奖励',
                        [
                            {
                                text: '取消', onPress: () => {
                                    this.shareModal.open();
                                }
                            },
                            {
                                text: '去登录', onPress: () => {
                                    this.gotoLoginPage();
                                }
                            }
                        ]
                    );
                } else {
                    this.shareModal.open();
                }
                break;
            case 'buy':
                if (!user.isLogin) {
                    this.$navigate('login/login/LoginPage');
                    return;
                }
                this.state.goType = type;
                this.SelectionPage.show(this.state.data, this._selectionViewConfirm);
                break;
            case 'gwc':
                this.state.goType = type;
                this.SelectionPage.show(this.state.data, this._selectionViewConfirm);
                break;
        }
    };

    //选择规格确认
    _selectionViewConfirm = (amount, skuCode) => {
        let orderProducts = [];
        if (this.state.goType === 'gwc') {
            //hyf更改
            let temp = {
                'amount': amount,
                'skuCode': skuCode,
                'productCode': this.state.data.prodCode
            };
            /*加入购物车埋点*/
            const { prodCode, name, originalPrice } = this.state.data || {};
            track(trackEvent.AddToShoppingcart, {
                spuCode: prodCode,
                skuCode: skuCode,
                spuName: name,
                pricePerCommodity: originalPrice,
                spuAmount: amount,
                shoppingcartEntrance: 1
            });
            shopCartCacheTool.addGoodItem(temp);
        } else if (this.state.goType === 'buy') {
            orderProducts.push({
                skuCode: skuCode,
                quantity: amount,
                productCode: this.state.data.prodCode,
                spuName: this.state.data.name
            });
            console.log('ConfirOrderPage', this.params);
            this.$navigate('order/order/ConfirOrderPage', {
                // fromType: this.params.type === 9 ? 4 : undefined,
                // couponsId:this.params.couponId,
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts,
                    source: parseInt(this.params.type) === 9 ? 4 : 2,
                    couponsId: parseInt(this.params.couponId)
                }
            });
        }
    };
    //segment 详情0 参数1 选项
    _segmentViewOnPressAtIndex = (index) => {
        this.setState({
            selectedIndex: index
        });
    };

    _renderListHeader = () => {
        const { data, activityType, activityData, messageCount } = this.state;
        return <DetailHeaderView data={data}
                                 ref={(e) => {
                                     this.DetailHeaderView = e;
                                 }}
                                 activityType={activityType}
                                 activityData={activityData}
                                 productActivityViewAction={this._productActivityViewAction}
                                 goShopAction={() => {
                                     this.$navigateBackToStore();
                                 }}
                                 promotionViewAction={() => {
                                     this.DetailPromoteModal.show(data);
                                 }}
                                 serviceAction={() => {
                                     this.DetailHeaderServiceModal.show(data);
                                 }}
                                 messageCount={messageCount}
                                 navigation={this.props.navigation}/>;
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        const { content } = this.state.data;
        if (this.state.selectedIndex === 0) {
            if (content) {
                let contentS = content.split(',') || [];
                let html = '';
                contentS.forEach((item) => {
                    html = `${html}<p><img src=${item}></p>`;
                });
                return <View>
                    <HTML html={html} imagesMaxWidth={ScreenUtils.width}
                          imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                          containerStyle={{ backgroundColor: '#fff' }}/>
                    <PriceExplain/>
                </View>;
            } else {
                return <PriceExplain/>;
            }

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
                    data={this.state.data.paramList || []}/>
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
            }} allowFontScaling={false}>{item.paramValue || ' '}</Text>
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
    //         <CommModal ref={(ref) => {
    //             this.couponModal = ref;
    //         }} visible={this.state.canGetCoupon}>
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
    //                     <Image source={res.button.tongyong_btn_close_white} style={{
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
        const { productStatus } = this.state.data;
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={productStatus === 0 ? '暂无商品' : '商品详情'} leftPressed={() => {
                        this.$navigateBack();
                    }}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    _renderContent = () => {

        const { name, imgUrl, prodCode, originalPrice, groupPrice, v0Price, shareMoney } = this.state.data || {};
        return <View style={styles.container}>
            <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
            <DetailNavView ref={(e) => this.DetailNavView = e}
                           messageCount={this.state.messageCount}
                           source={imgUrl}
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
                                   switch (item.index) {
                                       case 0:
                                           if (!user.isLogin) {
                                               this.gotoLoginPage();
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
                                               QYChatUtil.qiYUChat();
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
                         sections={[{ data: [{}] }]}
                         scrollEventThrottle={10}
                         showsVerticalScrollIndicator={false}/>
            <DetailBottomView bottomViewAction={this._bottomViewAction}
                              pData={this.state.data}/>
            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            trackParmas={{
                                spuCode: prodCode,
                                spuName: name
                            }}
                            trackEvent={trackEvent.Share}
                            type={'Image'}
                            imageJson={{
                                imageUrlStr: imgUrl,
                                titleStr: `${name}`,
                                priceStr: `￥${originalPrice}`,
                                retailPrice: `￥${v0Price}`,
                                shareMoney: shareMoney,
                                spellPrice: `￥${groupPrice}`,
                                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`
                            }}
                            webJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                thumImage: imgUrl
                            }}
                            miniProgramJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                thumImage: 'logo.png',
                                hdImageURL: imgUrl,
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                miniProgramPath: `/pages/index/index?type=99&id=${prodCode}&inviteId=${user.code || ''}`
                            }}/>
            <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
            <DetailHeaderServiceModal ref={(ref) => this.DetailHeaderServiceModal = ref}/>
            <DetailPromoteModal ref={(ref) => this.DetailPromoteModal = ref}/>
            {/*<ConfirmAlert ref={(ref) => this.ConfirmAlert = ref}/>*/}
            {/*{this._renderCouponModal()}*/}
        </View>;
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

