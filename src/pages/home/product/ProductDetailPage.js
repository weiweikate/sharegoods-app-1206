import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    // Image,
    FlatList,
    Text,
    // TouchableWithoutFeedback,
    // ImageBackground,
    // AsyncStorage
} from 'react-native';

import BasePage from '../../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';
import DetailSegmentView from './components/DetailSegmentView';
import DetailBottomView from './components/DetailBottomView';
import PriceExplain from './components/PriceExplain';
import DetailNavView from './components/DetailNavView';
import SelectionPage from './SelectionPage';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import CommShareModal from '../../../comm/components/CommShareModal';
import HTML from 'react-native-render-html';
import DetailNavShowModal from './components/DetailNavShowModal';
import apiEnvironment from '../../../api/ApiEnvironment';
// import CommModal from '../../../comm/components/CommModal';
import DesignRule from 'DesignRule';

// const { px2dp } = ScreenUtils;
import user from '../../../model/user';
import EmptyUtils from '../../../utils/EmptyUtils';
// import StringUtils from '../../../utils/StringUtils';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar/NavigatorBar';
// import res from '../res';
import MessageApi from '../../message/api/MessageApi';
import QYChatUtil from '../../mine/page/helper/QYChatModel';

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
        const { status } = this.state.data;
        //产品规格状0 ：产品删除 1：产品上架 2：产品下架(包含未上架的所有状态，出去删除状态)
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                buttonText: status === 0 ? '去首页' : '重新加载',
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: status === 0 ? (() => this.$navigateBackToHome()) : (() => this._getProductDetail())
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
                if (state && state.routeName === 'home/product/ProductDetailPage') {
                    this._getProductDetail();
                    this._getMessageCount();
                }
            }
        );
    }

    componentWillUnmount() {
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
        if (this.params.productId) {
            HomeAPI.getProductDetail({
                id: this.params.productId
            }).then((data) => {
                this._savaData(data.data || {});
            }).catch((error) => {
                this._error(error);
            });
        } else {
            HomeAPI.getProductDetailByCode({
                code: this.params.productCode
            }).then((data) => {
                this._savaData(data.data || {});
            }).catch((error) => {
                this._error(error);
            });
        }
    };
    //活动数据
    _getQueryByProductId = () => {
        const { product = {} } = this.state.data;
        if (!product.id) {
            return;
        }
        HomeAPI.queryByProductId({
            productId: product.id
        }).then((data) => {
            this.$loadingDismiss();
            let dataTemp = data.data || {};
            this.state.activityType = dataTemp.activityType;
            if (dataTemp.activityType === 2 && dataTemp.depreciate) {
                this.setState({
                    activityData: dataTemp.depreciate
                }, () => {
                    this.DetailHeaderView.updateTime(this.state.activityData, this.state.activityType, this._getQueryByProductId);
                });
            } else if (dataTemp.activityType === 1 && dataTemp.seckill) {
                this.setState({
                    activityData: dataTemp.seckill
                }, () => {
                    this.DetailHeaderView.updateTime(this.state.activityData, this.state.activityType, this._getQueryByProductId);
                });
            }
        }).catch((error) => {
            this.$loadingDismiss();
        });
    };

    //消息数据
    _getMessageCount = () => {
        MessageApi.getNewNoticeMessageCount().then(result => {
            if (!EmptyUtils.isEmpty(result.data)) {
                const { shopMessageCount, noticeCount, messageCount } = result.data;
                this.setState({
                    messageCount: shopMessageCount + noticeCount + messageCount
                });
            }
        }).catch((error) => {
        });
    };

    _savaData = (data) => {
        let { status } = data;
        //产品规格状0 ：产品删除 1：产品上架 2：产品下架(包含未上架的所有状态，出去删除状态)
        if (status === 0) {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: { msg: `该商品走丢了\n去看看别的商品吧` }
            });
        } else {
            this.setState({
                loadingState: PageLoadingState.success,
                data: data
            }, () => {
                this._getQueryByProductId();
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
                    this.ConfirmAlert.show({
                        title: '登录后分享才能赚取赏金', rightText: '去登录', confirmCallBack: () => {
                            this.$navigate('login/login/LoginPage');
                        }, closeCallBack: () => {
                            this.shareModal.open();
                        }
                    });
                } else {
                    this.shareModal.open();
                }
                break;
            case 'buy': {
                if (!user.isLogin) {
                    this.$navigate('login/login/LoginPage');
                    return;
                }
            }
            case 'gwc':
                this.state.goType = type;
                this.SelectionPage.show(this.state.data, this._selectionViewConfirm);
                break;
        }
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId) => {
        let orderProducts = [];
        if (this.state.goType === 'gwc') {
            let temp = {
                'amount': amount,
                'priceId': priceId,
                'productId': this.state.data.product.id
            };
            shopCartCacheTool.addGoodItem(temp);
        } else if (this.state.goType === 'buy') {
            orderProducts.push({
                priceId: priceId,
                num: amount,
                productId: this.state.data.product.id
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts
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
        return <DetailHeaderView data={this.state.data}
                                 ref={(e) => {
                                     this.DetailHeaderView = e;
                                 }}
                                 activityType={this.state.activityType}
                                 activityData={this.state.activityData}
                                 productActivityViewAction={this._productActivityViewAction}
                                 navigation={this.props.navigation}/>;
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { product } = this.state.data;
        product = product || {};
        if (this.state.selectedIndex === 0) {
            if (product.content) {
                return <View>
                    <HTML html={product.content} imagesMaxWidth={ScreenUtils.width}
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
                }}>{item.paramName || ''}</Text>
            </View>
            <Text style={{
                flex: 1,
                alignSelf: 'center',
                marginLeft: 20,
                color: DesignRule.textColor_instruction,
                fontSize: 12
            }}>{item.paramValue || ' '}</Text>
        </View>;
    };

    _renderSeparatorComponent = () => {
        return <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>;
    };
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < 44) {
            this.st = 0;
        } else if (Y < ScreenUtils.autoSizeWidth(377)) {
            this.st = (Y - 44) / (ScreenUtils.autoSizeWidth(377) - 44);
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
        this._renderContent();
        const { status } = this.state.data;
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={status === 0 ? '暂无商品' : ''} leftPressed={() => {
                        this.$navigateBack();
                    }}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    _renderContent = () => {
        const { price = 0, product = {}, shareMoney, status } = this.state.data || {};
        let { name = '', imgUrl, buyLimit, leftBuyNum } = product;
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
            <DetailBottomView bottomViewAction={this._bottomViewAction} shareMoney={shareMoney} status={status}
                              buyLimit={buyLimit} leftBuyNum={leftBuyNum}/>
            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            type={'Image'}
                            imageJson={{
                                imageUrlStr: imgUrl,
                                titleStr: `${name}`,
                                priceStr: `￥${price}`,
                                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${product.id}?upuserid=${user.id || ''}`
                            }}
                            webJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${product.id}?upuserid=${user.id || ''}`,
                                thumImage: imgUrl
                            }}
                            miniProgramJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                thumImage: 'logo.png',
                                hdImageURL: imgUrl,
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${product.id}?upuserid=${user.id || ''}`,
                                miniProgramPath: `/pages/index/index?type=99&id=${product.id}&inviteId=${user.id || ''}`
                            }}/>
            <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
            <ConfirmAlert ref={(ref) => this.ConfirmAlert = ref}/>
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

