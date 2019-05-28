import React, { Component } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { MRText } from '../../../../components/ui';
import UIImage from '@mr/image-placeholder';
import DesignRule from '../../../../constants/DesignRule';
import shopRes from '../../res';
import LinearGradient from 'react-native-linear-gradient';
import MRBannerView from '../../../../components/ui/bannerView/MRBannerView';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/RouterMap';
import { homeModule } from '../../../home/model/Modules';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import CommShareModal from '../../../../comm/components/CommShareModal';
import user from '../../../../model/user';
import apiEnvironment from '../../../../api/ApiEnvironment';

const { myShop } = shopRes;
const { shopProduct, shopProductShare } = myShop;
const { px2dp } = ScreenUtils;
const itemImgSize = px2dp(100);
const progressWidth = px2dp(60);

@observer
export class ShopProductItemView extends Component {

    _renderItem = ({ item, index }) => {
        const { image, title, content, shareMoney, promotionMinPrice, price, progressBar, salesVolume, linkTypeCode, linkType } = item || {};
        /*进度条显示*/
        let salesVolumeS = (salesVolume || 0) / 100;
        if (salesVolumeS > 1) {
            salesVolumeS = 1;
        }
        salesVolumeS = salesVolumeS * progressWidth;
        if (salesVolumeS < 10) {
            salesVolumeS = 10;
        }
        /*钱显示*/
        let shareMoneyS = (shareMoney && shareMoney !== '?') ? `${shareMoney.split('-').shift()}` : null;
        if (shareMoneyS == 0) {
            shareMoneyS = null;
        }
        return (
            <NoMoreClick style={[ProductItemViewStyles.itemView, { marginLeft: index === 0 ? 15 : 10 }]} onPress={
                () => {
                    const router = homeModule.homeNavigate(linkType, linkTypeCode);
                    let params = homeModule.paramsNavigate(item);
                    if (router) {
                        navigate(router, params);
                    }
                }
            }>
                <UIImage source={{ uri: image || '' }}
                         style={ProductItemViewStyles.itemImg}>
                    <LinearGradient style={ProductItemViewStyles.LinearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        {shareMoneyS ? <MRText
                            style={ProductItemViewStyles.LinearGradientText}>赚{shareMoneyS}</MRText> : null}
                    </LinearGradient>
                </UIImage>
                <MRText style={ProductItemViewStyles.itemTittle}
                        numberOfLines={1}>{title || ''}</MRText>
                <MRText style={ProductItemViewStyles.itemSubTittle}
                        numberOfLines={1}>{content || ''}</MRText>
                <View style={ProductItemViewStyles.bottomView}>
                    <View>
                        <MRText style={ProductItemViewStyles.itemPrice}
                                numberOfLines={1}>¥{promotionMinPrice || price || ''}</MRText>
                        {progressBar === 1 && <View style={ProductItemViewStyles.progressBgView}>
                            <LinearGradient
                                style={[ProductItemViewStyles.progressView, { width: salesVolumeS }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}/>
                            <View style={ProductItemViewStyles.progressTextView}>
                                <MRText style={ProductItemViewStyles.progressText}>{salesVolume || 0}%</MRText>
                            </View>
                        </View>}
                    </View>
                    <NoMoreClick onPress={() => {
                        this.shareModal.open();
                    }}>
                        <Image style={ProductItemViewStyles.shareImg} source={shopProductShare}/>
                    </NoMoreClick>
                </View>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'miniProgramWithCopyUrl'}
                                webJson={{
                                    title: title,
                                    dec: '商品详情',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${linkTypeCode}?upuserid=${user.code || ''}`,
                                    thumImage: image
                                }}/>
            </NoMoreClick>
        );
    };
    _keyExtractor = (item, index) => {
        return item + index;
    };

    render() {
        const { MyShopDetailModel } = this.props;
        const { productList } = MyShopDetailModel;
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

    bottomView: {
        height: 37, marginHorizontal: 5,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },

    itemPrice: {
        fontSize: 10, color: DesignRule.mainColor, fontWeight: 'bold'
    },
    /*进度条*/
    progressBgView: {
        backgroundColor: '#FFCCDC', borderRadius: 5, width: progressWidth, height: 10
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

@observer
export class ShopBottomBannerView extends Component {

    render() {
        const { MyShopDetailModel } = this.props;
        const { bottomBannerList } = MyShopDetailModel;
        if (!bottomBannerList || bottomBannerList.length === 0) {
            return null;
        }

        const images = bottomBannerList.map((item) => {
            return item.image;
        });
        return (
            <MRBannerView style={bottomBannerStyles.banner}
                          imgUrlArray={images}
                          onDidSelectItemAtIndex={(e) => {
                              const index = e.nativeEvent.index;
                              const selectedItem = bottomBannerList[index];
                              const { linkType, linkTypeCode } = selectedItem;
                              const router = homeModule.homeNavigate(linkType, linkTypeCode);
                              let params = homeModule.paramsNavigate(selectedItem);
                              if (router) {
                                  navigate(router, params);
                              }
                          }}
                          onDidScrollToIndex={() => {
                          }} autoLoop={bottomBannerList.length !== 1}>
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
