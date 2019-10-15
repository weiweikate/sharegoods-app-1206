/*
* 商品详情套餐相关item
* */
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Image } from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import { routeNavigate, routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import UIImage from '@mr/image-placeholder';
import { MRText } from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import ProductApi from '../api/ProductApi';
import { observable } from 'mobx';
import StringUtils from '../../../utils/StringUtils';
import res from '../res/product';
import user from '../../../model/user';
import LinearGradient from 'react-native-linear-gradient';

const { suitSaleOut } = res.suitProduct;
const { px2dp } = ScreenUtils;
const { add } = StringUtils;

export const suitType = {
    fixedSuit: '11',
    chooseSuit: '12',
    memberSuit: '13'
};

/**老礼包**/
const SuitItemView = ({ imgUrl, name, promotionDecreaseAmount, price, pushCallback }) => {
    return (
        <View style={suitItemStyle.item}>
            <NoMoreClick onPress={pushCallback}>
                <UIImage style={suitItemStyle.itemImg} source={{ uri: imgUrl }}>
                    <View style={suitItemStyle.subView}>
                        <MRText style={suitItemStyle.subText}>{promotionDecreaseAmount}</MRText>
                    </View>
                </UIImage>
            </NoMoreClick>
            <MRText style={suitItemStyle.itemText}
                    numberOfLines={1}>{name}</MRText>
            <MRText style={suitItemStyle.itemPrice}>{price}</MRText>
        </View>
    );
};

const suitItemStyle = StyleSheet.create({
    item: {
        width: px2dp(100) + 5
    },
    itemImg: {
        overflow: 'hidden',
        width: px2dp(100), height: px2dp(100), borderRadius: 5
    },
    subView: {
        position: 'absolute', bottom: 5, left: 5, backgroundColor: DesignRule.mainColor, borderRadius: 1
    },
    subText: {
        color: DesignRule.white, fontSize: 10, padding: 2
    },
    itemText: {
        color: DesignRule.textColor_secondTitle, fontSize: 12
    },
    itemPrice: {
        color: DesignRule.textColor_redWarn, fontSize: 12, paddingBottom: 19
    }
});

export class ProductDetailSuitGiftView extends Component {
    _renderItem = ({ item }) => {
        const { imgUrl, name, skuList } = item;
        const { specImg, promotionDecreaseAmount, price } = skuList[0] || {};
        const props = {
            imgUrl: specImg || imgUrl,
            name,
            promotionDecreaseAmount: `立省${promotionDecreaseAmount || ''}`,
            price: `¥${price || ''}`,
            pushCallback: this._goProductPage.bind(this, item)
        };
        return <SuitItemView {...props}/>;
    };

    _goProductPage = (item) => {
        const { productDetailModel } = this.props;
        const { isGroupIn, prodCode } = productDetailModel;
        if (isGroupIn) {
            routePush(RouterMap.ProductDetailPage, { productCode: item.prodCode });
        } else {
            if (!user.isLogin) {
                routeNavigate(RouterMap.LoginPage);
                return;
            }
            routePush(RouterMap.MemberProductPage, { productCode: prodCode });
        }
    };

    render() {
        const { productDetailModel } = this.props;
        const { isGroupIn, groupActivity, productDetailSuitModel } = productDetailModel;
        const showList = isGroupIn ? (groupActivity.subProductList || []) : (productDetailSuitModel.packages[0].subProducts || []);
        return (
            <View style={SuitGiftStyles.bgView}>
                <View style={SuitGiftStyles.tittleView}>
                    <MRText style={SuitGiftStyles.LeftText}>优惠套餐</MRText>
                </View>
                <FlatList
                    style={SuitGiftStyles.flatList}
                    data={showList}
                    keyExtractor={(item) => item.prodCode + ''}
                    renderItem={this._renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                />
            </View>
        );
    }
}

const SuitGiftStyles = StyleSheet.create({
    bgView: {
        backgroundColor: DesignRule.white
    },
    tittleView: {
        justifyContent: 'center', marginHorizontal: 15, height: 40
    },
    LeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: '500'
    },
    flatList: {
        marginLeft: 15
    }
});

/**固定套餐**/
const SuitFixedView = ({ mainProduct, subProducts, itemIndex, pushCallback }) => {
    const productList = [mainProduct, ...(subProducts || [])];
    let suitPrice = 0, dePrice = 0;
    productList.forEach((item) => {
        const { skuList } = item;

        const suiPriceArr = skuList.map((item) => {
            return item.promotionPrice;
        });
        const minPrice = Math.min.apply(null, suiPriceArr);
        suitPrice = add(suitPrice, minPrice);

        const priceArr = skuList.map((item) => {
            return item.promotionDecreaseAmount;
        });
        /*每个spu里的优惠最大额*/
        const priceArrMax = Math.max.apply(null, priceArr);
        dePrice = dePrice + priceArrMax;
    });
    return (
        <NoMoreClick style={fixedStyles.container} onPress={pushCallback}>
            <MRText style={fixedStyles.suitOText}>{`套餐${itemIndex + 1} ￥${suitPrice}`}<MRText
                style={fixedStyles.suitDText}>{` 至多省￥${dePrice}`}</MRText></MRText>
            <View style={fixedStyles.imgContainer}>
                {
                    (productList || []).map((item, index) => {
                        const { imgUrl, totalStock } = item || {};
                        return (
                            <UIImage style={fixedStyles.img} source={{ uri: imgUrl || '' }} key={index}>
                                {
                                    totalStock < 1 &&
                                    <Image source={suitSaleOut} style={{ height: px2dp(60), width: px2dp(60) }}/>
                                }
                            </UIImage>
                        );
                    })
                }
            </View>
        </NoMoreClick>
    );
};

const fixedStyles = StyleSheet.create({
    container: {
        marginLeft: 15
    },
    suitOText: {
        paddingVertical: 6,
        fontSize: 10, color: DesignRule.textColor_mainTitle
    },
    suitDText: {
        fontSize: 10, color: DesignRule.textColor_redWarn
    },
    imgContainer: {
        flexDirection: 'row'
    },
    img: {
        width: 60, height: 60, marginRight: 5
    }
});


export class ProductDetailSuitFixedView extends Component {
    _goSuitPage = (packageIndex) => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        const { productDetailSuitModel } = this.props;
        routePush(RouterMap.SuitProductPage, { productCode: productDetailSuitModel.productCode, packageIndex });
    };

    render() {
        const { productDetailSuitModel } = this.props;
        const { mainProduct, packages } = productDetailSuitModel;
        return (
            <View style={SuitFixedStyles.bgView}>
                <View style={SuitFixedStyles.tittleView}>
                    <MRText style={SuitFixedStyles.LeftText}>优惠套餐({(packages || []).length})</MRText>
                </View>
                <View style={SuitFixedStyles.lineView}/>
                <ScrollView style={SuitFixedStyles.scrollView} horizontal={true}>
                    {
                        (packages || []).map((item, index) => {
                            const { subProducts } = item || {};
                            return <SuitFixedView key={index}
                                                  mainProduct={mainProduct}
                                                  itemIndex={index}
                                                  subProducts={subProducts}
                                                  pushCallback={() => this._goSuitPage(index)}/>;
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

const SuitFixedStyles = StyleSheet.create({
    bgView: {
        backgroundColor: DesignRule.white
    },
    tittleView: {
        justifyContent: 'center', marginHorizontal: 15, height: 40
    },
    LeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: '500'
    },
    lineView: {
        backgroundColor: DesignRule.lineColor_inWhiteBg, height: 0.5, marginLeft: 15
    },
    scrollView: {
        marginBottom: 15
    }
});

/**搭配套餐**/

const SuitItemCView = ({ imgUrl, name, promotionDecreaseAmount, price, pushCallback, totalStock }) => {
    return (
        <View style={suitItemCStyle.item}>
            <NoMoreClick onPress={pushCallback}>
                <UIImage style={suitItemCStyle.itemImg} source={{ uri: imgUrl }}>
                    {
                        totalStock < 1 &&
                        <Image source={suitSaleOut} style={{ height: px2dp(60), width: px2dp(60) }}/>
                    }
                    <LinearGradient style={suitItemCStyle.subView}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={suitItemCStyle.subText}>{promotionDecreaseAmount}</MRText>
                    </LinearGradient>
                </UIImage>
            </NoMoreClick>
            <MRText style={suitItemCStyle.itemText}
                    numberOfLines={1}>{name}</MRText>
            <MRText style={suitItemCStyle.itemPrice}>{price}</MRText>
        </View>
    );
};

const suitItemCStyle = StyleSheet.create({
    item: {
        width: px2dp(100) + 5
    },
    itemImg: {
        overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
        width: px2dp(100), height: px2dp(100), borderRadius: 5
    },
    subView: {
        position: 'absolute', bottom: 0, right: 3, borderRadius: 3
    },
    subText: {
        color: DesignRule.white, fontSize: 10, paddingHorizontal: 4, paddingVertical: 2
    },
    itemText: {
        color: DesignRule.textColor_secondTitle, fontSize: 12, paddingTop: 5
    },
    itemPrice: {
        color: DesignRule.textColor_redWarn, fontSize: 12, paddingBottom: 10
    }
});

export class ProductDetailSuitChooseView extends Component {
    _renderItem = ({ item, index }) => {
        const { imgUrl, name, skuList, totalStock } = item;

        const suiPriceArr = skuList.map((item) => {
            return item.promotionPrice;
        });
        const minPrice = Math.min.apply(null, suiPriceArr);

        let decreaseList = (skuList || []).map((sku) => {
            return sku.promotionDecreaseAmount;
        });
        let maxDecrease = decreaseList.length === 0 ? 0 : Math.max.apply(null, decreaseList);

        const props = {
            totalStock,
            imgUrl: imgUrl,
            name,
            promotionDecreaseAmount: `至多省${maxDecrease}`,
            price: `¥${minPrice || ''}`,
            pushCallback: this._goSuitPage.bind(this, index)
        };
        return <SuitItemCView {...props}/>;
    };

    _goSuitPage = (packageIndex) => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        const { productDetailSuitModel } = this.props;
        /*搭配套餐不需要传index 0下标就行*/
        routePush(RouterMap.SuitProductPage, { productCode: productDetailSuitModel.productCode, packageIndex: 0 });
    };

    render() {
        const { productDetailSuitModel } = this.props;
        const { packages } = productDetailSuitModel;
        return (
            <View style={SuitChooseStyles.bgView}>
                <View style={SuitChooseStyles.tittleView}>
                    <MRText style={SuitChooseStyles.LeftText}>优惠套餐</MRText>
                </View>
                <FlatList
                    style={SuitChooseStyles.flatList}
                    data={packages[0].subProducts || []}
                    keyExtractor={(item) => item.prodCode + ''}
                    renderItem={this._renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                />
            </View>
        );
    }
}

const SuitChooseStyles = StyleSheet.create({
    bgView: {
        backgroundColor: DesignRule.white
    },
    tittleView: {
        justifyContent: 'center', marginHorizontal: 15, height: 40
    },
    LeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: '500'
    },
    flatList: {
        marginLeft: 15
    }
});


export class ProductDetailSuitModel {
    @observable productCode;
    @observable activityCode;
    @observable activityName;
    @observable extraType;
    @observable mainProduct = {};
    /*packages层级下的对象
    * afterSaleLimit
    * afterSaleTip
    * canBuy
    * content
    * groupCode
    * image
    * shareContent
    * singlePurchaseNumber
    * subProducts
    * */
    @observable packages = [];

    request_promotion_detail = (productCode) => {
        return ProductApi.promotion_detail({ productCode }).then((data) => {
            const dataDic = data.data || {};
            const { activityCode, activityName, extraType, mainProduct, packages } = dataDic;
            this.productCode = productCode;
            this.activityCode = activityCode;
            this.activityName = activityName;
            this.extraType = extraType;
            this.mainProduct = mainProduct || {};
            this.packages = packages || [];
            return Promise.resolve();
        }).catch(e => {
            return Promise.reject(e);
        });
    };
}
