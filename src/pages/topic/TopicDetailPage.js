import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Image,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity, AsyncStorage,
    ImageBackground
} from 'react-native';

import BasePage from '../../BasePage';
import TopicDetailHeaderView from './components/TopicDetailHeaderView';
import TopicDetailSegmentView from './components/TopicDetailSegmentView';
import ScreenUtils from '../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import HomeAPI from '../home/api/HomeAPI';
import TopicApi from './api/TopicApi';
import user from '../../model/user';
import TopicDetailSelectPage from './TopicDetailSelectPage';
import PackageDetailSelectPage from './PackageDetailSelectPage';
import CommShareModal from '../../comm/components/CommShareModal';
import TopicDetailShowModal from './components/TopicDetailShowModal';
import DetailNavShowModal from '../home/product/components/DetailNavShowModal';
import apiEnvironment from '../../api/ApiEnvironment';
import DesignRule from 'DesignRule';

const { px2dp } = ScreenUtils;
import EmptyUtils from '../../utils/EmptyUtils';
import StringUtils from '../../utils/StringUtils';
import DateUtils from '../../utils/DateUtils';
import CommModal from 'CommModal';
import DetailNavView from '../home/product/components/DetailNavView';

const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
import res from './res';

const redEnvelopeBg = res.other.red_big_envelope;
const tongyong_btn_close_white = res.button.tongyong_btn_close_white;
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';


export default class TopicDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            //类型: 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品
            activityType: this.params.activityType,
            //参数还是详情
            selectedIndex: 0,
            //正常数据 礼包
            data: {},
            //活动数据  降价拍和秒杀活动数据
            activityData: {},
            canGetCoupon: false,
            couponData: null,
            hasGetCoupon: false,

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
                reloadBtnClick: superStatus === 0 ? (() => this.$navigateReset()) : (() => this._getActivityData())
            }
        };
    };


    componentDidMount() {
        this.getPromotion();
    }

    getPromotion = async () => {
        try {
            const value = await AsyncStorage.getItem(LASTSHOWPROMOTIONTIME);
            if (value == null || !DateUtils.isToday(new Date(parseInt(value)))) {
                if (user.isLogin && EmptyUtils.isEmpty(user.upUserid)) {
                    HomeAPI.getReceivePackage({ type: 2 }).then((data) => {
                        if (!EmptyUtils.isEmpty(data.data)) {
                            this.setState({
                                canGetCoupon: true,
                                couponData: data.data
                            });
                            this.couponId = data.data.id;
                            AsyncStorage.setItem(LASTSHOWPROMOTIONTIME, Date.parse(new Date()).toString());
                        }
                    });
                }
            }
        } catch (error) {
        }
    };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'topic/TopicDetailPage') {
                    this._getActivityData();
                }
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.__timer__ && clearInterval(this.__timer__);
    }

    getCoupon = () => {
        if (EmptyUtils.isEmpty(this.couponId)) {
            this.setState({
                canGetCoupon: false
            });
            this.$toastShow('领取失败！');
        } else {
            HomeAPI.givingPackageToUser({ id: this.couponId }).then((data) => {
                this.setState({
                    hasGetCoupon: true
                });
            }).catch((error) => {
                this.setState({
                    canGetCoupon: false
                });
                this.$toastShow(error.msg);
            });

        }
    };


    //数据
    _getActivityData = () => {
        if (this.state.activityType === 1) {
            TopicApi.seckill_findByCode({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.productId);
            }).catch((error) => {
                this._error(error);
            });
        } else if (this.state.activityType === 2) {
            TopicApi.activityDepreciate_findById({
                code: this.params.activityCode
            }).then((data) => {
                this.state.activityData = data.data || {};
                this._getProductDetail(this.state.activityData.productId);
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
                        if (this.state.data.type === 2) {//1普通礼包  2升级礼包
                            this.TopicDetailShowModal.show('温馨提醒', `${data.data.name}`, null, `秀购升级礼包为定制特殊商品，购买后即可立即享受晋升权限，该礼包产品不可退换货，如有产品质量问题，可联系客服进行申诉`);
                        }
                    });
                }
            }).catch((error) => {
                this._error(error);
            });
        }
    };

    //倒计时到0的情况刷新页面
    updateActivityStatus = () => {
        this._getActivityData();
    };

    _needPushToNormal = () => {
        const { status, type } = this.state.activityData;
        //如果降价拍,秒杀&&结束&&需要   5秒跳转普通详情
        if (this.state.activityType !== 3 && (status === 4 || status === 5) && type === 1) {
            this.__timer__ = setTimeout(() => {
                this.$navigate('home/product/ProductDetailPage', { productId: this.state.activityData.productId });
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

    _getProductDetail = (productId) => {
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
                    HomeAPI.getProductDetail({
                    id: productId
                }).then((data) => {
                    this.setState({
                        data: data.data || {}
                    },()=>{
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
            'userId': user.id
        };
        TopicApi.followAction(
            param
        ).then(result => {
            this._getActivityData();
            this.$toastShow(result.msg);
        }).catch(error => {
            this.$toastShow(error.msg);
        });

    };

    //选择规格确认 秒杀 降价拍
    _selectionViewConfirm = (amount, priceId) => {
        let orderProducts = [];
        orderProducts.push({
            priceId: priceId,
            num: amount,
            code: this.state.activityData.activityCode
        });
        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                orderType: this.state.activityType,
                orderProducts: orderProducts
            }
        });
    };

    //选择规格确认 礼包
    _selectionViewPakageConfirm = (amount, selectData) => {
        let priceList = [];
        selectData.forEach((item) => {
            priceList.push({
                num: 1,
                priceId: item.productPriceId,
                productId: item.productId,
                productName: item.productName,
                sourceId: item.id,
                spec: item.specValues,
                specImg: item.specImg
            });
        });

        let orderProducts = [{
            num: 1,
            priceId: this.state.data.id,
            productId: this.state.data.id,
            priceList: priceList
        }];

        this.$navigate('order/order/ConfirOrderPage', {
            orderParamVO: {
                packageCode: this.params.activityCode,
                orderType: this.state.activityType,
                orderProducts: orderProducts
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
            this.props.navigation.navigate('login/login/LoginPage');
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
                                      showDetailModal={() => {
                                          this.TopicDetailShowModal.show('降价拍规则', null, null, `降价拍活动规则说明：\n降价拍活动开启后，每到规定时间都降低销售价；\n什么时候降价？每个活动，每个商品的降价时间都是不固定的；\n参与降价拍的商品是有限的，而且每个商品的购买都是有限制的；\n降价拍活动时间？每个活动的时间都是规定的，直到商品拍卖结束位置；\n关于购买限制？每个用户购买成功后都会扣除购买机会，即时退款也无法增加购买次数；`);
                                      }}/>;
    };

    _renderSectionHeader = () => {
        return <TopicDetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = () => {
        let { product = {} } = this.state.data;
        if (this.state.selectedIndex === 0) {
            return <View>
                <HTML html={this.state.activityType === 3 ? this.state.data.content : product.content}
                      imagesMaxWidth={ScreenUtils.width}
                      imagesInitialDimensions={ScreenUtils.width}
                      containerStyle={{ backgroundColor: '#fff' }}/>
                <View style={{ backgroundColor: 'white' }}>
                    <Text
                        style={{
                            paddingVertical: 13,
                            marginLeft: 15,
                            fontSize: 15,
                            color: DesignRule.textColor_mainTitle
                        }}>价格说明</Text>
                    <View
                        style={{ height: 0.5, marginHorizontal: 0, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    <Text style={{
                        padding: 15,
                        color: DesignRule.textColor_instruction,
                        fontSize: 13
                    }}>{`划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过销售价等，并非原价，仅供参考\n未划线价格：指商品的实时价格，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化最终以订单`}</Text>
                </View>
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
                }}>{this.state.activityType === 3 ? item.param || '' : item.paramName || ''}</Text>
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

    _renderCouponModal = () => {

        let view = (
            <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    canGetCoupon: false
                });
                this.$navigate('mine/userInformation/MyCashAccountPage', { availableBalance: user.availableBalance });
            }}>
                <View style={{ position: 'absolute', bottom: 18, left: 0, right: 0, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: px2dp(24) }}>
                        领取成功
                    </Text>
                    <Text style={{ color: 'white', fontSize: px2dp(11), marginTop: px2dp(5) }}>
                        可前往我的-
                        <Text style={{ textDecorationLine: 'underline' }}>现金账户</Text>
                        查看
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );

        let button = (
            <TouchableWithoutFeedback onPress={this.getCoupon}>
                <Text
                    style={{ position: 'absolute', top: px2dp(220), left: px2dp(115), color: '#80522A', fontSize: 14 }}>
                    {`立即\n领取`}
                </Text>
            </TouchableWithoutFeedback>
        );

        return (
            <CommModal visible={this.state.canGetCoupon}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center', justifyContent: 'center' }}>
                    <ImageBackground source={redEnvelopeBg} style={{
                        height: px2dp(362), width: px2dp(257),
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', includeFontPadding: false, fontSize: px2dp(14), marginTop: 26 }}>
                            {EmptyUtils.isEmpty(this.state.couponData) ? null : StringUtils.encryptPhone(this.state.couponData.phone)}
                        </Text>
                        <Text style={{ color: 'white', includeFontPadding: false, fontSize: px2dp(14) }}>
                            赠送了你一个红包
                        </Text>

                        <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(60), marginTop: 20 }}>
                            {EmptyUtils.isEmpty(this.state.couponData) ? null : StringUtils.formatMoneyString(this.state.couponData.price, false)}
                            <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(15) }}>
                                元
                            </Text>
                        </Text>
                        <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(14), marginTop: 12 }}>
                            红包抵扣金
                        </Text>
                        {this.state.hasGetCoupon ? null : button}

                        {this.state.hasGetCoupon ? view : null}
                    </ImageBackground>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            canGetCoupon: false
                        });
                    }}>
                        <Image source={tongyong_btn_close_white} style={{
                            position: 'absolute',
                            top: 107,
                            right: 35,
                            width: 24,
                            height: 24
                        }}/>
                    </TouchableWithoutFeedback>
                </View>
            </CommModal>
        );
    };

    _render() {
        let superStatus = this._getSuperStatus();
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={superStatus === 0 ? '暂无商品' : ''} leftPressed={() => {
                        this.$navigateBack();
                    }}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContainer)}
            </View>
        );
    }

    _renderContainer = () => {
        let bottomTittle, colorType;
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
                    bottomTittle = '已抢光';
                } else if (limitNumber !== -1 && limitFlag === 1) {
                    bottomTittle = `每人限购${limitNumber}次\n(您已购买过本商品）`;
                } else {
                    bottomTittle = '立即拍';
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

        let productPrice, productName, productImgUrl;
        if (this.state.activityType === 3) {
            const { name, levelPrice, imgUrl } = this.state.data || {};
            productPrice = levelPrice;
            productName = name;
            productImgUrl = imgUrl;
        } else {
            const { price = 0, product = {} } = this.state.data || {};
            const { name = '', imgUrl } = product;
            productPrice = price;
            productName = `${name}`;
            productImgUrl = imgUrl;
        }

        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                <DetailNavView ref={(e) => this.DetailNavView = e}
                               source={productImgUrl}
                               navBack={() => {
                                   this.$navigateBack();
                               }}
                               navRLeft={() => {
                                   this.$navigate('shopCart/ShopCart', {
                                       hiddeLeft: false
                                   });
                               }}
                               navRRight={() => {
                                   this.DetailNavShowModal.show((item) => {
                                       switch (item.index) {
                                           case 0:
                                               this.$navigate('message/MessageCenterPage');
                                               break;
                                           case 1:
                                               this.$navigateReset();
                                               break;
                                           case 2:
                                               this.shareModal.open();
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
                        <Text style={{ color: DesignRule.white, fontSize: 13 }}>商品已经下架啦~</Text>
                    </View> : null}
                    <TouchableOpacity style={{
                        height: 49,
                        backgroundColor: colorType === 1 ? '#33B4FF' : (colorType === 2 ? DesignRule.mainColor : '#CCCCCC'),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => this._bottomAction(colorType)} disabled={!(colorType === 1 || colorType === 2)}>
                        <Text style={{
                            color: 'white',
                            fontSize: 14
                        }}>{bottomTittle}</Text>
                    </TouchableOpacity>
                </View>

                {this.state.activityType === 3 ?
                    <PackageDetailSelectPage ref={(ref) => this.PackageDetailSelectPage = ref}/> :
                    <TopicDetailSelectPage ref={(ref) => this.TopicDetailSelectPage = ref}/>}

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: productImgUrl,
                                    titleStr: productName,
                                    priceStr: `￥${productPrice}`,
                                    QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.id || ''}`
                                }}
                                webJson={{
                                    title: productName,
                                    dec: '商品详情',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.id || ''}`,
                                    thumImage: productImgUrl
                                }}
                                miniProgramJson={{
                                    title: productName,
                                    dec: '商品详情',
                                    thumImage: 'logo.png',
                                    hdImageURL: productImgUrl,
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/${this.params.activityType}/${this.params.activityCode}?upuserid=${user.id || ''}`,
                                    miniProgramPath: `/pages/index/index?type=${this.params.activityType}&id=${this.params.activityCode}&inviteId=${user.id || ''}`
                                }}/>
                <TopicDetailShowModal ref={(ref) => {
                    this.TopicDetailShowModal = ref;
                }}/>
                <DetailNavShowModal ref={(ref) => {
                    this.DetailNavShowModal = ref;
                }}/>
                {this._renderCouponModal()}
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

