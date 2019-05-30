import React from 'react';
import {
    ScrollView,
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    NativeModules,
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import AutoHeightWebView from '@mr/react-native-autoheight-webview';

const { px2dp } = ScreenUtils;
import { ShowDetail } from './Show';
import { observer } from 'mobx-react';
import CommShareModal from '../../comm/components/CommShareModal';
import user from '../../model/user';
import apiEnvironment from '../../api/ApiEnvironment';
import BasePage from '../../BasePage';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import {
    MRText as Text
} from '../../components/ui';
import Toast from '../../utils/bridge';
import { NetFailedView } from '../../components/pageDecorator/BaseView';
import AvatarImage from '../../components/ui/AvatarImage';
import { track, TrackApi, trackEvent } from '../../utils/SensorsTrack';
import { SmoothPushPreLoadHighComponent } from '../../comm/components/SmoothPushHighComponent';
import ProductRowListView from './components/ProductRowListView';
import ShowUtils from './utils/ShowUtils';
import { sourceType } from '../product/SelectionPage';
import AddCartModel from './model/AddCartModel';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import SelectionPage from '../product/SelectionPage';
import EmptyUtils from '../../utils/EmptyUtils';
import NoMoreClick from '../../components/ui/NoMoreClick';
import ProductListModal from './components/ProductListModal';
import RouterMap from '../../navigation/RouterMap';
import ShowApi from './ShowApi';
import LinearGradient from 'react-native-linear-gradient';

const { iconShowFire, iconLike, iconNoLike, iconShowShare } = res;


@SmoothPushPreLoadHighComponent
@observer
export default class ShowRichTextDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.showDetailModule = new ShowDetail();
        this.state = {
            pageState: PageLoadingState.loading,
            errorMsg: '',
            productModalVisible: false
        };
        this.noNeedRefresh = false;
        TrackApi.xiuChangDetail();
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                if (this.noNeedRefresh) {
                    this.noNeedRefresh = true;
                    return;
                }
                const { state } = payload;
                if (state && state.routeName === 'show/ShowRichTextDetailPage') {
                    Toast.showLoading();
                    if (this.params.code) {
                        this.getDetailByIdOrCode(this.params.code);
                    } else if (this.params.id) {
                        this.getDetailByIdOrCode(this.params.id);
                    } else {
                        this.setState({
                            pageState: PageLoadingState.success
                        });
                        Toast.hiddenLoading();
                        let data = this.params.data;
                        data.hotCount += 1;
                        this.showDetailModule.setDetail(data);
                        this.params.ref && this.params.ref.replaceData(this.params.index, data.hotCount);
                    }
                    this.incrCountByType(6);
                }
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        let { detail } = this.showDetailModule;
        this.params.ref && this.params.ref.replaceItemData(this.params.index, JSON.stringify(detail));
    }

    getDetailByIdOrCode=(code)=>{
        this.showDetailModule.showDetailCode(code).then(() => {
            const { detail } = this.showDetailModule;
            TrackApi.XiuChangDetails({
                articleCode: detail.code,
                author: detail.userName,
                collectionCount: detail.collectCount
            });
            if (this.params.isFormHeader) {
                this.params.ref && this.params.ref.setClick(detail.click);
            } else {
                this.params.ref && this.params.ref.replaceData(this.params.index, detail.click);
            }
            this.setState({
                pageState: PageLoadingState.success
            });
            Toast.hiddenLoading();
        }).catch(error => {
            this.setState({
                pageState: PageLoadingState.fail,
                errorMsg: error.msg || '获取详情失败'
            });
            Toast.$toast(error.msg || '获取详情失败');
            Toast.hiddenLoading();
        });
    }


    _goBack() {
        console.log('_goBack');
        const { navigation } = this.props;
        navigation.goBack(null);
    }

    _goToGoodsPage(good) {
        const { navigation } = this.props;
        navigation.push('product/ProductDetailPage', {
            productCode: good.code
        });
    }

    _goodAction() {
        console.log('_goodAction', user.isLogin);
        if (user.isLogin) {
            this.showDetailModule.showGoodAction();
        } else {
            const { navigation } = this.props;
            navigation.push('login/login/LoginPage');
        }
    }

    _collectAction() {
        if (user.isLogin) {
            this.showDetailModule.showConnectAction();
        } else {
            const { navigation } = this.props;
            navigation.push('login/login/LoginPage');
        }
    }

    _goToShare() {
        const { pageState } = this.state;
        if (pageState === PageLoadingState.fail) {
            return;
        }
        this.shareModal && this.shareModal.open();
    }

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        let height = ScreenUtils.width;
        let shadowOpacity = 0;
        console.log('_onScroll', Y);
        if (Y < height) {
            shadowOpacity = Y / height;
        } else {
            shadowOpacity = 1;
        }
        this._whiteNavRef.setNativeProps({
            opacity: shadowOpacity
        });
        this._blackNavRef.setNativeProps({
            opacity: 1 - shadowOpacity
        });
    };


    _renderNormalTitle() {
        let { detail } = this.showDetailModule;
        if (!detail) {
            detail = { imgs: '', products: [], click: 0, content: '' };
        }

        let userImage =  (detail.userInfoVO && detail.userInfoVO.userImg) ? detail.userInfoVO.userImg : '';
        let userName = (detail.userInfoVO && detail.userInfoVO.userName) ? detail.userInfoVO.userName : '';

        return (

            <View style={styles.navTitle}>
                <TouchableOpacity style={styles.backView} onPress={() => this._goBack()}>
                    <Image source={res.back}/>
                </TouchableOpacity>
                <View style={styles.profileRow}>
                    <View style={styles.profileLeft}>
                        <AvatarImage borderRadius={px2dp(18)} style={styles.portrait}
                                     source={{ uri: userImage}}/>
                        <Text style={styles.showName}
                              allowFontScaling={false}>{userName}</Text>
                    </View>

                </View>

                <TouchableOpacity style={styles.shareView} onPress={() => {
                    this._goToShare();
                }}>
                    <Image source={iconShowShare}/>
                </TouchableOpacity>
            </View>
        );

    }

    _shieldRender = () => {
        return (
            <View style={styles.shieldWrapper}>
                <View style={styles.shieldTextWrapper}>
                    <Text style={styles.shieldText}>
                        尊敬的用户，经平台审核，您发布的内容因涉嫌【内容违规】，被下架处理，请严格遵守相关规则，期待您的下一次分享
                    </Text>
                </View>
                <Image style={styles.shieldImage} source={res.addShieldIcon}/>
            </View>
        );
    };

    _showImagesPage(imgs, index) {
        this.noNeedRefresh = true;
        const { navigation } = this.props;
        navigation.push('show/ShowDetailImagePage', {
            imageUrls: imgs,
            index: index
        });
    }

    _otherInfoRender = () => {
        let { detail } = this.showDetailModule;
        return (
            <View style={styles.otherInfoWrapper}>
                <Text style={styles.timeTextStyle}>
                    {detail.publishTimeStr}
                </Text>
                <View style={{ flex: 1 }}/>
                <Image style={styles.fireIcon} source={iconShowFire}/>
                <Text style={styles.fireNumText}>{ShowUtils.formatShowNum(detail.hotCount)}</Text>
            </View>
        );
    };

    _onLongClickImage = (event) => {
        let url = event.nativeEvent.url;
        Alert.alert('保存图片', '', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '保存到相册', onPress: () => {
                    NativeModules.commModule.saveImageToPhotoAlbumWithUrl(url).then(() => {
                        this.$toastShow('保存成功!');
                    }).catch((error) => {
                    });
                }
            }]);
    };

    reduceCountByType = (type) => {
        let showNo;
        if (this.params.id) {
            showNo = this.params.id;
        } else if (this.params.code) {
            showNo = this.params.code;
        } else {
            showNo = this.params.data.showNo;
        }
        ShowApi.reduceCountByType({ showNo, type });
    };
    incrCountByType = (type) => {
        let showNo;
        if (this.params.id) {
            showNo = this.params.id;
        } else if (this.params.code) {
            showNo = this.params.code;
        } else {
            showNo = this.params.data.showNo;
        }
        ShowApi.incrCountByType({ showNo, type });
    };

    _clickLike = () => {
        let { detail } = this.showDetailModule;
        if (detail.like) {
            if (detail.likesCount <= 0) {
                return;
            }
            this.reduceCountByType(1);
            detail.like = false;
            detail.likesCount -= 1;
            this.showDetailModule.setDetail(detail);
        } else {
            this.incrCountByType(1);
            detail.like = true;
            detail.likesCount += 1;
            this.showDetailModule.setDetail(detail);
        }
    };

    _bottomRender = () => {
        let { detail } = this.showDetailModule;
        return (
            <View style={styles.bottom}>
                <NoMoreClick onPress={this._clickLike}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.bottomIcon} source={detail.like ? iconLike : iconNoLike}/>
                        <Text style={styles.bottomNumText}>
                            {ShowUtils.formatShowNum(detail.likesCount)}
                        </Text>
                    </View>
                </NoMoreClick>
                <View style={{ width: px2dp(24) }}/>

                <View style={{ flex: 1 }}/>
                {!EmptyUtils.isEmptyArr(detail.products) ? <TouchableWithoutFeedback onPress={() => {
                    this.setState({
                        productModalVisible: true
                    });
                }}>
                    <View>
                        <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                        colors={['#FFCB02', '#FF9502']}
                                        style={{
                                            width: px2dp(90),
                                            height: px2dp(34),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius:px2dp(17)
                                        }}
                        >
                            <Text style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_threeTitle_28 }}>
                                立即购买
                            </Text>
                        </LinearGradient>
                        <View style={{
                            position: 'absolute',
                            top: px2dp(-5),
                            right: px2dp(-5),
                            width: px2dp(20),
                            height: px2dp(20),
                            borderRadius: px2dp(10),
                            borderWidth: 1,
                            borderColor: DesignRule.white,
                            backgroundColor: DesignRule.mainColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ color: DesignRule.white, fontSize: px2dp(12) }}>
                                {detail.products.length}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback> : null}

            </View>
        );
    };

    addCart = (code) => {
        let addCartModel = new AddCartModel();
        addCartModel.requestProductDetail(code, (productIsPromotionPrice) => {
            this.setState({
                productModalVisible:false
            });
            this.SelectionPage.show(addCartModel, (amount, skuCode) => {
                const { prodCode, name, originalPrice } = addCartModel;
                shopCartCacheTool.addGoodItem({
                    'amount': amount,
                    'skuCode': skuCode,
                    'productCode': code
                });
                /*加入购物车埋点*/
                track(trackEvent.AddToShoppingcart, {
                    spuCode: prodCode,
                    skuCode: skuCode,
                    spuName: name,
                    pricePerCommodity: originalPrice,
                    spuAmount: amount,
                    shoppingcartEntrance: 1
                });
            }, { sourceType: productIsPromotionPrice ? sourceType.promotion : null });
        }, (error) => {
            this.$toastShow(error.msg || '服务器繁忙');
        });
    };


    _render() {
        const { pageState } = this.state;
        if (pageState === PageLoadingState.fail) {
            return <View style={styles.container}>
                <NetFailedView netFailedInfo={{ msg: this.state.errorMsg }}/>{this._renderNormalTitle()}
            </View>;
        }
        if (pageState === PageLoadingState.loading) {
            return <View style={styles.container}>
                {this._renderNormalTitle()}
            </View>;
        }

        let { detail } = this.showDetailModule;
        if (!detail) {
            detail = { imgs: '', products: [], click: 0, content: '' };
        }

        let content = detail.content ? detail.content : '';
        let html = '<!DOCTYPE html><html>' +
            '<head>' +
            '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />' +
            //'<meta content="m.007fenqi.com" name="author"/>' +
            '<meta content="yes" name="apple-mobile-web-app-capable"/>' +
            '<meta content="yes" name="apple-touch-fullscreen"/>' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />' +
            '<meta http-equiv="Expires" content="-1"/>' +
            '<meta http-equiv="Cache-Control" content="no-cache">' +
            '<meta http-equiv="Pragma" content="no-cache">'
            // + '<link rel="stylesheet" href="http://m.007fenqi.com/app/app.css" type="text/css"/>'
            + '<style type="text/css">' + 'html, body, p, embed, iframe, div ,video {'
            + 'position:relative;width:100%;margin:0;padding:0;background-color:#ffffff' + ';line-height:28px;box-sizing:border-box;display:block;font-size:'
            + 13
            + 'px;'
            + '}'
            + 'p {word-break:break-all;}'
            + 'table { border-collapse:collapse;}'
            + 'table, td, th {border:1px solid #ddd;}'
            + 'blockquote { display: block;' +
            '    background: #f9f9f9;' +
            '    border-left: 10px;' +
            '    margin: 10px;' +
            '    padding: 0px;' +
            '    position: relative;' +
            '    box-sizing: border-box;}'
            //  + Utils.NVL(this.props.webviewStyle, '')
            + '</style>'
            + '<script type="text/javascript">'
            + 'function ResizeImages() {'
            + 'var myimg,oldwidth;'
            + 'var maxwidth = document.body.clientWidth;'
            + 'for(i=0;i <document.images.length;i++){'
            + 'myimg = document.images[i];'
            + 'if(myimg.width > maxwidth){'
            + 'oldwidth = myimg.width;'
            + 'myimg.width = maxwidth;'
            + '}'
            + '}'
            + '}'
            + '</script>'
            + '</head>'
            + '<body onload="ResizeImages();">'
            + '<div>'
            + content
            + '</div>'
            + '</body></html>';

        return <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={30}
                // onScroll={this._onScroll.bind(this)}
                scrollEnabled={pageState === PageLoadingState.success}

            >
                <View style={styles.virHeader}/>


                <Text style={styles.titleStyle}
                      numberOfLines={2}
                      ellipsizeMode={'tail'}>
                    {detail.title}
                </Text>

                <AutoHeightWebView source={{ html: html }}
                                   style={{ width: DesignRule.width - 30, alignSelf: 'center' }}
                                   scalesPageToFit={true}
                                   javaScriptEnabled={true}
                                   cacheEnabled={true}
                                   domStorageEnabled={true}
                                   mixedContentMode={'always'}
                                   onLongClickImage={this._onLongClickImage}
                                   showsHorizontalScrollIndicator={false}
                                   showsVerticalScrollIndicator={false}

                />

                <ProductRowListView style={{ marginVertical: px2dp(10) }}
                                    products={detail.products}
                                    addCart={this.addCart}
                                    pressProduct={(prodCode) => {
                                        this.$navigate(RouterMap.ProductDetailPage, { productCode: prodCode });
                                    }}
                />

                {this._otherInfoRender()}


                {/*{*/}
                {/*isCollecting*/}
                {/*?*/}
                {/*<View style={[styles.bottomBtn]}>*/}
                {/*<ActivityIndicator style={styles.btnLoading} size='small'/>*/}
                {/*</View>*/}
                {/*:*/}
                {/*<TouchableOpacity style={styles.bottomBtn} onPress={() => this._collectAction()}>*/}
                {/*<Image style={styles.collectImg}*/}
                {/*source={detail.hadCollect ? res.showFire : res.noShowFire}/>*/}
                {/*<Text style={styles.bottomText}*/}
                {/*allowFontScaling={false}>{pageState === PageLoadingState.fail ? '' :'收藏'} · {detail.collectCount}</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*}*/}
            </ScrollView>
            {pageState === PageLoadingState.fail ? null :
                (this._bottomRender())
            }
            <View style={styles.whiteNav}/>
            {this._renderNormalTitle()}
            {detail.products ? <ProductListModal visible={this.state.productModalVisible}
                                                 pressProduct={(prodCode) => {
                                                     this.setState({
                                                         productModalVisible: false
                                                     });
                                                     this.$navigate(RouterMap.ProductDetailPage, { productCode: prodCode });
                                                 }}
                                                 addCart={this.addCart}
                                                 products={detail.products} requestClose={() => {
                this.setState({
                    productModalVisible: false
                });
            }}/> : null}
            {detail.status !== 1 ? this._shieldRender() : null}
            <SelectionPage ref={(ref) => this.SelectionPage = ref} />
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            type={'Show'}
                            trackEvent={'ArticleShare'}
                            trackParmas={{ articeCode: detail.code, articleTitle: detail.title }}
                            imageJson={{
                                imageType:'show',
                                imageUrlStr: detail.resource ? detail.resource[0].url:"",
                                titleStr: detail.title,
                                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                headerImage: (detail.userInfoVO && detail.userInfoVO.userImg)? detail.userInfoVO.userImg: null,
                                userName: (detail.userInfoVO && detail.userInfoVO.userName)? detail.userInfoVO.userName: '',
                                dec:''
                            }}
                            webJson={{
                                title:detail.showType === 1 ? detail.content : detail.title,//分享标题(当为图文分享时候使用)
                                linkUrl:`${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,//(图文分享下的链接)
                                thumImage:'',//(分享图标小图(https链接)图文分享使用)
                                dec:''
                            }}
            />
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: ScreenUtils.statusBarHeight
    },
    scroll: {
        flex: 1
    },
    bottom: {
        height: px2dp(50) + ScreenUtils.safeBottom,
        paddingBottom: ScreenUtils.safeBottom,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: ScreenUtils.onePixel,
        borderTopColor: '#ddd',
        paddingHorizontal: DesignRule.margin_page
    },
    goodsItem: {
        height: px2dp(66),
        width: ScreenUtils.width - 2 * px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: ScreenUtils.onePixel,
        borderRadius: px2dp(5),
        marginBottom: px2dp(10),
        overflow: 'hidden'
    },
    collectImg: {
        marginLeft: px2dp(16)
    },
    goodImg: {
        height: px2dp(65),
        width: px2dp(65)
    },
    goodDetail: {
        flex: 1,
        marginLeft: px2dp(9),
        marginRight: px2dp(9)
    },
    name: {
        fontSize: px2dp(13),
        color: DesignRule.textColor_mainTitle,
        fontWeight: '600'
    },
    price: {
        fontSize: px2dp(13),
        color: '#FF1A54'
    },
    goodsView: {
        marginTop: px2dp(17),
        marginRight: px2dp(15),
        marginLeft: px2dp(15),
        marginBottom: px2dp(15)
    },
    button: {
        backgroundColor: '#FF1A54',
        height: px2dp(32),
        width: px2dp(125),
        borderRadius: px2dp(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(15)
    },
    buttonTitle: {
        color: '#fff',
        fontSize: px2dp(15)
    },
    bottomGoodImg: {},
    bottomText: {
        marginLeft: px2dp(8),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11)
    },
    profileRow: {
        height: px2dp(45),
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        marginLeft: px2dp(5)
    },
    portrait: {
        width: px2dp(36),
        height: px2dp(36),
        borderRadius: px2dp(18)
    },
    showName: {
        color: DesignRule.textColor_mainTitle,
        marginLeft: px2dp(10),
        fontSize: px2dp(15)
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileRight: {
        flexDirection: 'row',
        marginLeft: px2dp(10),
        alignItems: 'center'
    },
    number: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(13),
        marginLeft: px2dp(8)
    },
    bottomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: px2dp(15)
    },
    leftButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        flexDirection: 'row',
        height: px2dp(50),
        flex: 1
    },
    text: {
        color: '#fff',
        fontSize: px2dp(14)
    },
    btnLoading: {
        marginLeft: px2dp(26)
    },
    nav: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ScreenUtils.width,
        height: ScreenUtils.headerHeight,
        paddingTop: ScreenUtils.statusBarHeight
    },
    whiteNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ScreenUtils.width,
        height: ScreenUtils.statusBarHeight,
        backgroundColor: '#fff'
    },
    navTitle: {
        height: px2dp(44),
        width: ScreenUtils.width,
        flexDirection: 'row',
        alignItems: 'center',
        top: ScreenUtils.statusBarHeight,
        position: 'absolute',
        left: 0,
        backgroundColor: DesignRule.white
    },
    virHeader: {
        height: px2dp(44),
        marginTop: ScreenUtils.statusBarHeight
    },
    backView: {
        width: px2dp(44),
        height: px2dp(44),
        alignItems: 'center',
        justifyContent: 'center'
    },
    shareView: {
        width: px2dp(50),
        height: px2dp(44),
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(17)
    },
    showTimesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    seeImgStyle: {
        width: px2dp(20),
        height: px2dp(20)
    },
    bottomIcon: {
        width: px2dp(18),
        height: px2dp(18)
    },
    bottomNumText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11),
        marginLeft: px2dp(5)
    },
    shieldWrapper: {
        position: 'absolute',
        top: (ScreenUtils.statusBarHeight + px2dp(44)),
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.7)'
    },
    shieldTextWrapper: {
        width: DesignRule.width,
        backgroundColor: 'black',
        paddingHorizontal: DesignRule.margin_page,
        paddingVertical: px2dp(6)
    },
    shieldText: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_24
    },
    shieldImage: {
        width: px2dp(120),
        height: px2dp(120),
        marginTop: px2dp(50),
        alignSelf: 'center'
    },
    otherInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: px2dp(18),
        paddingHorizontal: DesignRule.margin_page
    },
    timeTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_20
    },
    fireIcon: {
        width: px2dp(13),
        height: px2dp(17),
        marginRight: px2dp(8)
    },
    fireNumText: {
        fontSize: DesignRule.fontSize_22,
        color: DesignRule.textColor_mainTitle
    },
    titleStyle: {
        alignSelf: 'center',
        marginHorizontal: DesignRule.margin_page,
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_secondTitle,
        marginTop: px2dp(10),
        marginBottom: px2dp(13),
        fontWeight: 'bold'
    }
});

