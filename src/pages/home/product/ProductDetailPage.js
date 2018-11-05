import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Image,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    ImageBackground,
    AsyncStorage
} from 'react-native';

import BasePage from '../../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';
import DetailSegmentView from './components/DetailSegmentView';
import DetailBottomView from './components/DetailBottomView';
import SelectionPage from './SelectionPage';
import HomeAPI from '../api/HomeAPI';
import ScreenUtils from '../../../utils/ScreenUtils';
import detailBack from '../../../comm/res/show_detail_back.png';
import detailMore from '../../../comm/res/show_share.png';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import CommShareModal from '../../../comm/components/CommShareModal';
import HTML from 'react-native-render-html';
import DetailNavShowModal from './components/DetailNavShowModal';
import apiEnvironment from '../../../api/ApiEnvironment';
import CommModal from '../../../comm/components/CommModal';
import redEnvelopeBg from './res/red_envelope_bg.png';

const { px2dp } = ScreenUtils;
import user from '../../../model/user';
import EmptyUtils from '../../../utils/EmptyUtils';
import StringUtils from '../../../utils/StringUtils';
import closeIcon from '../../../../src/comm/res/tongyong_btn_close_white.png';
import DateUtils from '../../../utils/DateUtils';
const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
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
            hasGetCoupon: false
        };
        this.couponId = null;
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._getProductDetail();
        this.getPromotion();
    }

    getPromotion = () => {
        try {
            const value = AsyncStorage.getItem(LASTSHOWPROMOTIONTIME);
            if (value == null || !DateUtils.isToday(new Date(value))) {
                if (user.isLogin && EmptyUtils.isEmpty(user.upUserid)) {
                    HomeAPI.getReceivePackage({ type: 2 }).then((data) => {
                        this.setState({
                            canGetCoupon: true,
                            couponData: data.data
                        });
                        this.couponId = data.data.id;
                        AsyncStorage.setItem(LASTSHOWPROMOTIONTIME,new Date().getTime())
                    });
                }
            }
        } catch (error) {

        }

    };




    getCoupon = () => {
        if (EmptyUtils.isEmpty(this.couponId)) {
            this.$toastShow('领取失败！');
        } else {
            HomeAPI.givingPackageToUser({ id: this.couponId }).then((data) => {
                this.setState({
                    hasGetCoupon: true
                });
            }).catch((error) => {
                this.$toastShow(error.msg);
            });

        }
    };

    //数据
    _getProductDetail = () => {
        this.$loadingShow();
        if (this.params.productId) {
            HomeAPI.getProductDetail({
                id: this.params.productId
            }).then((data) => {
                this.$loadingDismiss();
                this._savaData(data.data || {});
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        } else {
            HomeAPI.getProductDetailByCode({
                code: this.params.productCode
            }).then((data) => {
                this.$loadingDismiss();
                this._savaData(data.data || {});
            }).catch((error) => {
                this.$loadingDismiss();
                this.$toastShow(error.msg);
            });
        }
    };

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
            this.$toastShow(error.msg);
        });
    };

    _savaData = (data) => {
        this.setState({
            data: data
        }, () => {
            this._getQueryByProductId();
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
            case 'goGwc': {
                this.$navigate('shopCart/ShopCart', {
                    hiddeLeft: false
                });
            }
                break;
            case 'gwc':
            case 'buy': {
                this.state.goType = type;
                this.SelectionPage.show(this.state.data, this._selectionViewConfirm);
            }
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
                          imagesInitialDimensions={ScreenUtils.width}
                          containerStyle={{ backgroundColor: '#fff' }}/>
                    <View style={{ backgroundColor: 'white' }}>
                        <Text
                            style={{ paddingVertical: 13, marginLeft: 15, fontSize: 15, color: '#222222' }}>价格说明</Text>
                        <View style={{ height: 0.5, marginHorizontal: 0, backgroundColor: '#eee' }}/>
                        <Text style={{
                            padding: 15
                        }}>{`划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过销售价等，并非原价，仅供参考\n未划线价格：指商品的实时价格，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化最终以订单`}</Text>
                    </View>
                </View>;
            } else {
                return null;
            }

        } else {
            return <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ marginHorizontal: 16, marginVertical: 16, borderWidth: 0.5, borderColor: '#eee' }}
                    renderItem={this._renderSmallItem}
                    ItemSeparatorComponent={this._renderSeparatorComponent}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.data.paramList || []}/>
            </View>;
        }
    };

    _renderSmallItem = ({ item }) => {
        return <View style={{ flexDirection: 'row', height: 35 }}>
            <View style={{ backgroundColor: '#DDDDDD', width: 70, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 10, color: '#222222', fontSize: 12 }}>{item.paramName || ''}</Text>
            </View>
            <Text style={{
                flex: 1,
                alignSelf: 'center',
                marginLeft: 20,
                color: '#999999',
                fontSize: 12
            }}>{item.paramValue || ' '}</Text>
        </View>;
    };

    _renderSeparatorComponent = () => {
        return <View style={{ height: 0.5, backgroundColor: '#eee' }}/>;
    };
    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < 100) {
            this.st = Y * 0.01;
        } else {
            this.st = 1;
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    };


    _renderCouponModal() {

        let view = (
            <View style={{ position: 'absolute', bottom: 18, left: 0, right: 0, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: px2dp(24) }}>
                    领取成功
                </Text>
                <Text style={{ color: 'white', fontSize: px2dp(11), marginTop: px2dp(5) }}>
                    可前往我的-优惠卷查看
                </Text>
            </View>
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
                            {EmptyUtils.isEmpty(this.state.couponData) ? null : this.state.couponData.price}
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
                        <Image source={closeIcon} style={{
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
    }


    _render() {
        const { price = 0, product = {} } = this.state.data || {};
        const { name = '', imgUrl } = product;

        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                <View style={styles.transparentView}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={detailBack}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        this.DetailNavShowModal.show((item) => {
                            switch (item.index) {
                                case 0:
                                    this.$navigate('message/MessageCenterPage');
                                    this.DetailNavShowModal.close();
                                    break;
                                case 1:
                                    this.props.navigation.popToTop();
                                    break;
                                case 2:
                                    this.shareModal.open();
                                    break;
                            }
                        });
                    }}>
                        <Image source={detailMore}/>
                    </TouchableWithoutFeedback>
                </View>

                <SectionList onScroll={this._onScroll}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             sections={[{ data: [{}] }]}
                             scrollEventThrottle={10}/>
                <DetailBottomView bottomViewAction={this._bottomViewAction}/>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: imgUrl,
                                    titleStr: `${name}`,
                                    priceStr: `￥${price}`,
                                    QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${product.id}`
                                }}
                                webJson={{
                                    title: `${name}`,
                                    dec: '商品详情',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${product.id}`,
                                    thumImage: imgUrl
                                }}/>
                <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
                {this._renderCouponModal()}
            </View>
        );
    }

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
    },
    transparentView: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: ScreenUtils.statusBarHeight,
        left: 16,
        right: 16,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

});

