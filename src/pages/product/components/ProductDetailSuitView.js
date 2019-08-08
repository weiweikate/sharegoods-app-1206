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

const { suitSaleOut } = res.suitProduct;
const { px2dp } = ScreenUtils;
const { add } = StringUtils;

export const suitType = {
    fixedSuit: '11',
    chooseSuit: '12'
};
/*
* 公用图片文字item
* */
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

/**老礼包**/
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
        routePush(RouterMap.ProductDetailPage, { productCode: item.prodCode });
    };

    render() {
        const { productDetailModel } = this.props;
        const { groupActivity } = productDetailModel;
        return (
            <View style={SuitGiftStyles.bgView}>
                <View style={SuitGiftStyles.tittleView}>
                    <MRText style={SuitGiftStyles.LeftText}>优惠套餐</MRText>
                </View>
                <FlatList
                    style={SuitGiftStyles.flatList}
                    data={groupActivity.subProductList || []}
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

const SuitFixedView = ({ mainProduct, subProducts, itemIndex, pushCallback }) => {
    const productList = [mainProduct, ...(subProducts || [])];
    let suitPrice = 0, dePrice = 0;
    productList.forEach((item) => {
        const { skuList, minPrice } = item;
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
            <MRText style={fixedStyles.suitOText}>{`套餐${itemIndex + 1}￥${suitPrice}`}<MRText
                style={fixedStyles.suitDText}>{`至多省￥${dePrice}`}</MRText></MRText>
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

/**固定套餐**/
export class ProductDetailSuitFixedView extends Component {
    _goSuitPage = (packageIndex) => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        const { productDetailSuitModel } = this.props;
        routePush(RouterMap.SuitProductPage, { productDetailSuitModel, packageIndex });
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
export class ProductDetailSuitChooseView extends Component {
    _renderItem = ({ item }) => {
        const { imgUrl, name, minPrice, skuList } = item;
        let decreaseList = (skuList || []).map((sku) => {
            return sku.promotionDecreaseAmount;
        });
        let minDecrease = decreaseList.length === 0 ? 0 : Math.min.apply(null, decreaseList);

        const props = {
            imgUrl: imgUrl,
            name,
            promotionDecreaseAmount: `立省${minDecrease}起`,
            price: `¥${minPrice || ''}起`,
            pushCallback: this._goSuitPage.bind(this, item)
        };
        return <SuitItemView {...props}/>;
    };

    _goSuitPage = () => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        const { productDetailModel } = this.props;
        routePush(RouterMap.SuitProductPage, { productDetailModel });
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
                    data={packages[0].subProductList || []}
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
    @observable activityCode;
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
        ProductApi.promotion_detail({ productCode }).then((data) => {
            const dataDic = data.data || {};
            const { activityCode, extraType, mainProduct, packages } = dataDic;
            this.activityCode = activityCode;
            this.extraType = extraType;
            this.mainProduct = mainProduct || {};
            this.packages = packages || [];
        }).catch(e => {

        });
    };
}
