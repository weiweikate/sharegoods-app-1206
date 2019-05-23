import React, { Component } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { MRText } from '../../../../components/ui';
import UIImage from '@mr/image-placeholder';
import DesignRule from '../../../../constants/DesignRule';
import shopRes from '../../res';
import LinearGradient from 'react-native-linear-gradient';
import MRBannerView from '../../../../components/ui/bannerView/MRBannerView';
import ScreenUtils from '../../../../utils/ScreenUtils';

const { myShop } = shopRes;
const { shopProduct, shopProductShare } = myShop;
const { px2dp } = ScreenUtils;
const itemImgSize = px2dp(100);

export class ShopProductItemView extends Component {

    _renderItem = ({ item, index }) => {
        const { image, title, content, shareMoney, promotionMinPrice, price } = item || {};
        return (
            <View style={[ProductItemViewStyles.itemView, { marginLeft: index === 0 ? 15 : 10 }]}>
                <UIImage source={{ uri: image || 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png' }}
                         style={ProductItemViewStyles.itemImg}>
                    <LinearGradient style={ProductItemViewStyles.LinearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={ProductItemViewStyles.LinearGradientText}>赚{shareMoney || '2333.4'}</MRText>
                    </LinearGradient>
                </UIImage>
                <MRText style={ProductItemViewStyles.itemTittle}
                        numberOfLines={2}>{title || '推荐商品推荐商品推'}</MRText>
                <MRText style={ProductItemViewStyles.itemSubTittle}
                        numberOfLines={2}>{content || '推荐商品推荐商'}</MRText>
                <MRText style={ProductItemViewStyles.itemPrice}
                        numberOfLines={1}>¥{promotionMinPrice || price || '48949'}</MRText>
                <View style={ProductItemViewStyles.bottomView}>
                    <View style={ProductItemViewStyles.progressBgView}>
                        <LinearGradient style={[ProductItemViewStyles.progressView, { width: 40 }]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}/>
                        <View style={ProductItemViewStyles.progressTextView}>
                            <MRText style={ProductItemViewStyles.progressText}>50%</MRText>
                        </View>
                    </View>
                    <Image style={ProductItemViewStyles.shareImg} source={shopProductShare}/>
                </View>
            </View>
        );
    };
    _keyExtractor = (item, index) => {
        return item + index;
    };

    render() {
        let { productList } = this.props;
        productList = ['', '', '', ''];
        if (!productList || productList.length === 0) {
            return null;
        }
        return (
            <View style={ProductItemViewStyles.container}>
                <View style={ProductItemViewStyles.headerView}>
                    <Image style={ProductItemViewStyles.headerImg} source={shopProduct}/>
                    <MRText style={ProductItemViewStyles.headerText}>推荐商品</MRText>
                </View>
                <FlatList data={productList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}/>
            </View>
        );
    }
}

const ProductItemViewStyles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    /*标题*/
    headerView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 25, marginBottom: 10
    },
    headerImg: {
        marginRight: 6,
        width: 14, height: 14
    },
    headerText: {
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },
    /*item*/
    itemView: {
        backgroundColor: 'white', width: itemImgSize, borderRadius: 5, overflow: 'hidden'
    },
    itemImg: {
        height: itemImgSize, width: itemImgSize, alignItems: 'flex-end', justifyContent: 'flex-end'
    },
    LinearGradient: {
        marginRight: 3,
        borderRadius: 2
    },
    LinearGradientText: {
        padding: 2,
        fontSize: 10, color: DesignRule.white
    },

    itemTittle: {
        paddingTop: 7, paddingHorizontal: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    itemSubTittle: {
        paddingTop: 1.5, paddingHorizontal: 5,
        fontSize: 10, color: DesignRule.textColor_instruction
    },
    itemPrice: {
        paddingTop: 1.5, paddingHorizontal: 5,
        fontSize: 10, color: DesignRule.mainColor, fontWeight: 'bold'
    },

    bottomView: {
        marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'
    },

    /*进度条*/
    progressBgView: {
        marginLeft: 5,
        backgroundColor: '#FFCCDC', borderRadius: 5, width: 60, height: 10
    },
    progressView: {
        backgroundColor: DesignRule.mainColor, borderRadius: 5, height: 10
    },
    progressTextView: {
        justifyContent: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 5, right: 0
    },
    progressText: {
        fontSize: 8, color: DesignRule.textColor_white
    },

    shareImg: {
        marginRight: 9,
        width: 16, height: 16
    }
});

export class ShopBottomBannerView extends Component {
    render() {
        let { arr } = this.props;
        arr = ['http://pic37.nipic.com/20140113/8800276_184927469000_2.png', 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png'];
        if (!arr || arr.length === 0) {
            return null;
        }
        return (
            <MRBannerView style={bottomBannerStyles.banner}
                          imgUrlArray={arr}
                          onDidSelectItemAtIndex={() => {
                          }}
                          onDidScrollToIndex={() => {
                          }}>
            </MRBannerView>
        );
    }
}

const bottomBannerStyles = StyleSheet.create({
    banner: {
        alignSelf: 'center', overflow: 'hidden',
        width: px2dp(345), height: px2dp(120), borderRadius: 7
    }
});
