import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { SubProductView } from './components/SuitProductItemView';
import SuitProductModel from './SuitProductModel';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import SuitProductBottomView from './components/SuitProductBottomView';
import RouterMap from '../../../navigation/RouterMap';
import user from '../../../model/user';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import { AutoHeightImage } from '../../../components/ui/AutoHeightImage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SuitExplainModal from './components/SuitExplainModal';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import res from '../res/product';
import apiEnvironment from '../../../api/ApiEnvironment';
import { trackEvent } from '../../../utils/SensorsTrack';
import CommShareModal from '../../../comm/components/CommShareModal';
import SelectionPage from '../SelectionPage';
import { ProductDetailSuitModel } from '../components/ProductDetailSuitView';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';

const { share } = res.pDetailNav;

@observer
export default class SuitProductPage extends BasePage {
    productDetailSuitModel = new ProductDetailSuitModel();
    suitProductModel = new SuitProductModel();

    $navigationBarOptions = {
        title: '优惠套装'
    };

    $NavBarRenderRightItem = () => {
        const { isSuitFixed } = this.suitProductModel;
        if (isSuitFixed) {
            return (
                <NoMoreClick style={styles.rightNavBtn} onPress={() => {
                    this.shareModal && this.shareModal.open();
                }}>
                    <Image source={share}/>
                </NoMoreClick>
            );
        }
        return null;
    };
    $getPageStateOptions = () => {
        const { loadingState, netFailedInfo } = this.suitProductModel;
        return {
            loadingState: loadingState,
            netFailedProps: {
                buttonText: '重新加载',
                netFailedInfo: netFailedInfo,
                reloadBtnClick: this.requestData
            }
        };
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('didFocus', state);
                this.requestData();
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    requestData = () => {
        const { packageIndex, productCode } = this.params;
        this.productDetailSuitModel.request_promotion_detail(productCode).then(() => {
            this.suitProductModel.setProductArr(this.productDetailSuitModel, packageIndex);
            this.suitProductModel.loadingState = PageLoadingState.success;
        }).catch((e) => {
            this.suitProductModel.loadingState = PageLoadingState.fail;
            this.suitProductModel.netFailedInfo = e;
        });
    };

    setNav = autorun(() => {
        const { activityName } = this.suitProductModel;
        this.$NavigationBarResetTitle(activityName || '优惠套装');
    });

    _bottomAction = () => {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        const {
            activityCode, selectedAmount, packageItem, suitProducts,
            selectedProductSkuS, isSuitFixed, selected_products
        } = this.suitProductModel;
        const { groupCode, maxPurchaseTimes, purchaseTimes } = packageItem;
        //有限购次数&&已买次数>=限购次数
        if (maxPurchaseTimes && purchaseTimes >= maxPurchaseTimes) {
            this.$toastShow(`最多可购买${maxPurchaseTimes}次，已超过购买次数`);
            return;
        }
        if (isSuitFixed) {
            if (suitProducts.length !== selectedProductSkuS.length) {
                this.$toastShow('还有商品未选择规格');
                return;
            }
        } else {
            let hasMainProduct;
            for (const item of selected_products) {
                if (item.isMainProduct) {
                    hasMainProduct = true;
                    break;
                }
            }
            if (!hasMainProduct) {
                this.$toastShow('主商品未选择规格');
                return;
            }
            if (selectedProductSkuS.length < 2) {
                this.$toastShow('至少选择一件搭配商品');
                return;
            }
        }
        let orderProductList = selectedProductSkuS.map((item) => {
            const { prodCode, skuCode } = item;
            return {
                activityCode: activityCode,
                batchNo: groupCode,
                productCode: prodCode,
                skuCode: skuCode,
                quantity: selectedAmount
            };
        });
        this.$navigate(RouterMap.ConfirOrderPage, {
            orderParamVO: {
                orderType: 1,
                source: 2,
                orderProducts: [...orderProductList]
            }
        });
    };
    _selectSkuWithSelectionPage = (productItem, changeItem) => {
        this.SelectionPage.show(productItem, (amount, skuCode, skuItem) => {
            changeItem(amount, skuCode, skuItem);
        }, { unShowAmount: true, needUpdate: true });
    };

    _render() {
        const { packageIndex, productCode } = this.params;
        const { suitProducts, packageItem, afterSaleLimitText, priceRetailTotal, priceTotal } = this.suitProductModel;
        const totalProduct = suitProducts || [];
        const { image, afterSaleTip, shareContent } = packageItem;
        const htmlUrl = `${apiEnvironment.getCurrentH5Url()}/package-product?spucode=${productCode}&upuserid=${user.code || ''}&index=${packageIndex}`;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <AutoHeightImage source={{ uri: image }} style={styles.imgView}
                                     borderRadius={5}
                                     ImgWidth={ScreenUtils.width - 30}/>
                    <View style={styles.whiteView}>
                        {
                            totalProduct.map((item, index) => {
                                return <SubProductView item={item}
                                                       key={index}
                                                       selectSkuWithSelectionPage={this._selectSkuWithSelectionPage}
                                                       suitProductModel={this.suitProductModel}/>;
                            })
                        }
                    </View>
                    <NoMoreClick style={styles.iconView} onPress={() => {
                        this.SuitExplainModal.open(afterSaleLimitText, afterSaleTip);
                    }}>
                        <MRText style={styles.iconText}>{afterSaleLimitText}</MRText>
                        <Image style={styles.iconImg} source={res.suitProduct.suitWhy}/>
                    </NoMoreClick>
                </ScrollView>
                <SuitProductBottomView suitProductModel={this.suitProductModel} bottomAction={this._bottomAction}/>
                <SuitExplainModal ref={(ref) => this.SuitExplainModal = ref}/>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                trackParmas={{
                                    spuCode: productCode,
                                    spuName: shareContent
                                }}
                                trackEvent={trackEvent.Share}
                                type={'Image'}
                                imageJson={{
                                    monthSaleType: 5,
                                    imageUrlStr: image,
                                    titleStr: `${shareContent}`,
                                    retailPrice: `套餐价：￥${priceRetailTotal}`,
                                    priceType: [],
                                    priceStr: `￥${priceTotal}`,
                                    QRCodeStr: htmlUrl,
                                    shareMoney: '',
                                    spellPrice: ''
                                }}
                                webJson={{
                                    title: shareContent,
                                    dec: '套餐',
                                    linkUrl: htmlUrl,
                                    thumImage: image
                                }}/>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightNavBtn: {
        justifyContent: 'center', alignItems: 'center', height: 44, width: 44
    },
    imgView: {
        marginVertical: 10, marginLeft: 15
    },
    whiteView: {
        borderRadius: 5, marginTop: 10
    },
    iconView: {
        justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center'
    },
    iconText: {
        color: DesignRule.textColor_instruction, fontSize: 10, marginRight: 5
    },
    iconImg: {
        width: 16, height: 16, marginVertical: 10, marginRight: 15
    }
});
