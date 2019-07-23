import React from 'react';
import {
    View,
    StyleSheet,
    SectionList
} from 'react-native';
import BasePage from '../../BasePage';
import DetailBottomView from './components/DetailBottomView';
import SelectionPage, { sourceType } from './SelectionPage';
import ScreenUtils from '../../utils/ScreenUtils';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import CommShareModal from '../../comm/components/CommShareModal';
import DetailNavShowModal from './components/DetailNavShowModal';
import apiEnvironment from '../../api/ApiEnvironment';
import { track, trackEvent } from '../../utils/SensorsTrack';
import user from '../../model/user';
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import DetailHeaderServiceModal from './components/DetailHeaderServiceModal';
import DetailPromoteModal from './components/DetailPromoteModal';
import { beginChatType, QYChatTool } from '../../utils/QYModule/QYChatTool';
import ProductDetailModel, { productItemType, sectionType } from './ProductDetailModel';
import { observer } from 'mobx-react';
import RouterMap from '../../navigation/RouterMap';
import {
    ContentItemView,
    HeaderItemView,
    ParamItemView,
    PromoteItemView,
    ServiceItemView, ShowTopView, SuitItemView, PriceExplain
} from './components/ProductDetailItemView';
import ProductDetailScoreView from './components/ProductDetailScoreView';
import DetailParamsModal from './components/DetailParamsModal';
import { ContentSectionView, SectionLineView, SectionNullView } from './components/ProductDetailSectionView';
import ProductDetailNavView from './components/ProductDetailNavView';
import { IntervalMsgType, IntervalMsgView, IntervalType } from '../../comm/components/IntervalMsgView';
import ProductDetailCouponsView, { ProductDetailCouponsWindowView } from './components/ProductDetailCouponsView';
import { ProductDetailSetAddressView } from './components/ProductDetailAddressView';

/**
 * @author chenyangjun
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email chenyangjun@meeruu.com
 */

// const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
@observer
export default class ProductDetailPage extends BasePage {

    productDetailModel = new ProductDetailModel();

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            goType: ''
        };
        this.productDetailModel.prodCode = this.params.productCode;
        this.productDetailModel.trackCode = this.params.trackCode;
        this.productDetailModel.trackType = this.params.trackType;
    }

    _getPageStateOptions = () => {
        const { productStatus, loadingState, netFailedInfo, requestProductDetail } = this.productDetailModel;
        return {
            loadingState: loadingState,
            netFailedProps: {
                buttonText: productStatus === 0 ? '去首页' : '重新加载',
                netFailedInfo: netFailedInfo,
                reloadBtnClick: productStatus === 0 ? this.$navigateBackToHome : requestProductDetail
            }
        };
    };


    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', payload => {
                const { state } = payload;
                if (state && state.routeName === 'product/ProductDetailPage' && !user.isProdFirstLoad) {
                    this.productDetailModel && this.productDetailModel.requestProductDetail();
                }
            }
        );
        if (user.isProdFirstLoad) {
            setTimeout(() => {
                user.isProdFirstLoad = false;
                this.productDetailModel && this.productDetailModel.requestProductDetail();
            }, 200);
        }
    }

    componentWillUnmount() {
        this.productDetailModel.clearTime();
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    //去购物车
    _bottomViewAction = (type) => {
        const { productIsPromotionPrice, isGroupIn } = this.productDetailModel;
        switch (type) {
            case 'jlj':
                this.shareModal && this.shareModal.open();
                break;
            case 'keFu':
                if (!user.isLogin) {
                    this.gotoLoginPage();
                    return;
                }
                track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 2 });
                const { shopId, title, name, secondName, imgUrl, prodCode, showPrice } = this.productDetailModel;
                QYChatTool.beginQYChat({
                    shopId: shopId || '',
                    title: title || '',
                    chatType: beginChatType.BEGIN_FROM_PRODUCT,
                    data: {
                        title: name,
                        desc: secondName,
                        pictureUrlString: imgUrl,
                        urlString: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}`,
                        note: showPrice
                    }
                });
                break;
            case 'buy':
                if (!user.isLogin) {
                    this.gotoLoginPage();
                    return;
                }
                this.state.goType = type;
                this.SelectionPage.show(this.productDetailModel, this._selectionViewConfirm, {
                    sourceType: productIsPromotionPrice ? sourceType.promotion : null,
                    isGroupIn
                });
                break;
            case 'gwc':
                this.state.goType = type;
                this.SelectionPage.show(this.productDetailModel, this._selectionViewConfirm, { sourceType: productIsPromotionPrice ? sourceType.promotion : null });
                break;
        }
    };

    //选择规格确认
    _selectionViewConfirm = (amount, skuCode) => {
        const { prodCode, name, originalPrice, isGroupIn, groupActivity } = this.productDetailModel;
        const { goType } = this.state;
        if (goType === 'gwc') {
            shopCartCacheTool.addGoodItem({
                'amount': amount,
                'skuCode': skuCode,
                'productCode': prodCode
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
        } else if (goType === 'buy') {
            if (isGroupIn) {
                const { subProductList, code } = groupActivity;
                let orderProductList = (subProductList || []).map((subProduct) => {
                    const { skuList, prodCode } = subProduct || {};
                    const skuItem = (skuList || [])[0];
                    const { skuCode } = skuItem || {};
                    return {
                        activityCode: code,
                        batchNo: 1,
                        productCode: prodCode,
                        skuCode: skuCode,
                        quantity: amount
                    };
                });
                this.$navigate(RouterMap.ConfirOrderPage, {
                    orderParamVO: {
                        orderType: 1,
                        source: 2,
                        orderProducts: [{
                            activityCode: code,
                            batchNo: 1,
                            productCode: prodCode,
                            skuCode: skuCode,
                            quantity: amount
                        }, ...orderProductList]
                    }
                });
                return;
            }
            const { type, couponId } = this.params;
            let orderProducts = [{
                skuCode: skuCode,
                quantity: amount,
                productCode: prodCode
            }];
            this.$navigate(RouterMap.ConfirOrderPage, {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts,
                    source: parseInt(type) === 9 ? 4 : 2,
                    couponsId: parseInt(couponId)
                }
            });
        }
    };

    _renderSectionHeader = ({ section: { key } }) => {
        switch (key) {
            case sectionType.sectionHeader:
            case sectionType.sectionExPlain:
                return null;
            case sectionType.sectionContent: {
                return <ContentSectionView/>;
            }
            default: {
                return <SectionNullView/>;
            }
        }
    };

    _renderItem = ({ item, index, section: { key } }) => {
        const { productDetailCouponsViewModel, productDetailAddressModel } = this.productDetailModel;
        if (key === sectionType.sectionContent) {
            return <ContentItemView item={item}/>;
        }
        const { itemKey } = item;
        switch (itemKey) {
            case productItemType.headerView: {
                return <HeaderItemView productDetailModel={this.productDetailModel}
                                       navigation={this.props.navigation}
                                       shopAction={() => {
                                           this.$navigateBackToStore();
                                       }}/>;
            }
            case productItemType.suit: {
                return <SuitItemView productDetailModel={this.productDetailModel}/>;
            }
            case productItemType.coupons: {
                return <ProductDetailCouponsView productDetailCouponsViewModel={productDetailCouponsViewModel}
                                                 onPress={() => {
                                                     if (!user.isLogin) {
                                                         this.gotoLoginPage();
                                                         return;
                                                     }
                                                     this.ProductDetailCouponsWindowView.showWindowView();
                                                 }}/>;
            }
            case productItemType.promote: {
                return <PromoteItemView productDetailModel={this.productDetailModel}
                                        promotionViewAction={() => {
                                            this.DetailPromoteModal.show(this.productDetailModel);
                                        }}/>;
            }
            case productItemType.service: {
                return <ServiceItemView productDetailModel={this.productDetailModel}
                                        serviceAction={() => {
                                            this.DetailHeaderServiceModal.show(this.productDetailModel);
                                        }}/>;
            }
            case productItemType.param: {
                return <ParamItemView paramAction={() => {
                    this.DetailParamsModal.show(this.productDetailModel);
                }}/>;
            }
            case productItemType.address: {
                return <ProductDetailSetAddressView productDetailAddressModel={productDetailAddressModel}/>;
            }
            case productItemType.comment: {
                return <ProductDetailScoreView pData={this.productDetailModel}
                                               navigation={this.props.navigation}/>;
            }
            case productItemType.priceExplain: {
                return <PriceExplain/>;
            }
            default:
                return null;
        }
    };

    _onScroll = (event) => {
        /*实时透明度*/
        let offsetY = event.nativeEvent.contentOffset.y;
        let opacity = 1;
        if (offsetY < 44) {
            opacity = 0;
        } else if (offsetY < ScreenUtils.autoSizeWidth(375)) {
            opacity = (offsetY - 44) / (ScreenUtils.autoSizeWidth(375) - 44);
        }
        this._refHeader.setNativeProps({
            opacity: opacity
        });

        /*model相关赋值*/
        this.productDetailModel.offsetY = offsetY;
        this.productDetailModel.opacity = opacity;
    };

    _onPressToTop = () => {
        this.SectionList && this.SectionList.scrollToLocation({ sectionIndex: 0, itemIndex: 0 });
    };

    _render() {
        const { productStatus } = this.productDetailModel;
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState !== PageLoadingState.success &&
                <NavigatorBar title={productStatus === 0 ? '暂无商品' : '商品详情'} leftPressed={() => {
                    this.$navigateBack();
                }}/>}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    _renderContent = () => {
        const {
            name, imgUrl, prodCode, originalPrice, groupPrice, v0Price, promotionMinPrice,
            shareMoney, sectionDataList, productIsPromotionPrice, isSkillIn, nameShareText, productDetailCouponsViewModel,
            priceTypeTextList, monthSaleCount
        } = this.productDetailModel;
        const { couponId } = this.params;
        return <View style={styles.container}>
            <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
            <ProductDetailNavView productDetailModel={this.productDetailModel}
                                  showAction={() => {
                                      this.shareModal && this.shareModal.open();
                                  }}/>
            <SectionList onScroll={this._onScroll}
                         ref={(e) => this.SectionList = e}
                         renderSectionHeader={this._renderSectionHeader}
                         renderItem={this._renderItem}
                         keyExtractor={(item, index) => {
                             return item + index;
                         }}
                         sections={sectionDataList}
                         scrollEventThrottle={10}
                         ItemSeparatorComponent={() => {
                             return <SectionLineView/>;
                         }}
                         showsVerticalScrollIndicator={false}/>
            <DetailBottomView bottomViewAction={this._bottomViewAction}
                              pData={this.productDetailModel}/>
            <ShowTopView productDetailModel={this.productDetailModel}
                         toTopAction={this._onPressToTop}/>
            <IntervalMsgView pageType={IntervalType.productDetail}/>
            <ProductDetailCouponsWindowView ref={(ref) => this.ProductDetailCouponsWindowView = ref}
                                            productDetailCouponsViewModel={productDetailCouponsViewModel}/>
            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            defaultModalVisible={this.params.openShareModal}
                            trackParmas={{
                                spuCode: prodCode,
                                spuName: name
                            }}
                            trackEvent={trackEvent.Share}
                            type={'Image'}
                            imageJson={{
                                monthSaleType: isSkillIn ? 4 : (monthSaleCount >= 1000 ? 3 : (monthSaleCount >= 500 ? 2 : 1)),
                                imageUrlStr: imgUrl,
                                titleStr: `${name}`,
                                priceType: priceTypeTextList,
                                priceStr: `￥${originalPrice}`,
                                retailPrice: `￥${productIsPromotionPrice ? promotionMinPrice : v0Price}`,
                                shareMoney: shareMoney,
                                spellPrice: `￥${groupPrice}`,
                                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}&couponId=${couponId}`
                            }}
                            webJson={{
                                title: nameShareText.name,
                                dec: nameShareText.desc,
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}&couponId=${couponId}`,
                                thumImage: imgUrl
                            }}
                            taskShareParams={{
                                uri: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}&couponId=${couponId}`,
                                code: IntervalMsgType.productDetail,
                                data: prodCode
                            }}/>
            <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
            <DetailHeaderServiceModal ref={(ref) => this.DetailHeaderServiceModal = ref}/>
            <DetailPromoteModal ref={(ref) => this.DetailPromoteModal = ref}/>
            <DetailParamsModal ref={(ref) => this.DetailParamsModal = ref}/>
        </View>;
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    opacityView: {
        zIndex: 1024,
        height: ScreenUtils.headerHeight, backgroundColor: 'white', opacity: 0,
        position: 'absolute', top: 0, left: 0, right: 0
    }
});

