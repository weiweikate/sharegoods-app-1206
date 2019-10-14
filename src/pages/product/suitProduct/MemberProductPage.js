/**
 * @author 陈阳君
 * @date on 2019/10/07
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import BasePage from '../../../BasePage';
import { ContentItemView } from '../components/ProductDetailItemView';
import DetailBanner from '../components/DetailBanner';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import MemberProductModel from './MemberProductModel';
import { MemberBuyView, MemberNameView, MemberNavView, MemberPriceView } from './components/MemberProductItem';
import { observer } from 'mobx-react';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar/NavigatorBar';
import SelectionPage from '../SelectionPage';
import res from '../res/product';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import SuitExplainModal from './components/SuitExplainModal';
import { MemberSubAlert } from './components/MemberSubAlert';
import CommShareModal from '../../../comm/components/CommShareModal';
import RouterMap from '../../../navigation/RouterMap';
import apiEnvironment from '../../../api/ApiEnvironment';
import user from '../../../model/user';

@observer
export default class MemberProductPage extends BasePage {
    memberProductModel = new MemberProductModel();

    $navigationBarOptions = {
        show: false
    };

    _getPageStateOptions = () => {
        const { loadingState, netFailedInfo } = this.memberProductModel;
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
        this.requestData();
    }

    requestData = () => {
        const { productCode } = this.params;
        this.memberProductModel.request_promotion_detail(productCode);
    };

    _rightAction = () => {
        this.shareModal && this.shareModal.open();
    };

    _buyAction = () => {
        const { mainProduct, totalProPrice, productCode, activityCode, subProducts, promotionInfoItem } = this.memberProductModel;
        const activityList = [{ activityCode }, {
            activityTag: promotionInfoItem.activityTag,
            promotionId: promotionInfoItem.promotionId,
            activityCode: promotionInfoItem.activityCode
        }];

        const { show, promotionPrice } = promotionInfoItem;

        this.SelectionPage.show(mainProduct, (amount, skuCode) => {
            let orderProductList = (subProducts || []).map((subProduct) => {
                const { skuList, prodCode } = subProduct || {};
                const skuItem = (skuList || [])[0];
                const { skuCode } = skuItem || {};
                return {
                    activityList,
                    activityCode,
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
                        activityList,
                        activityCode,
                        batchNo: 1,
                        productCode: productCode,
                        skuCode: skuCode,
                        quantity: amount
                    }, ...orderProductList]
                }
            });
        }, { priceShow: show === 1 ? promotionPrice : totalProPrice });
    };

    _allAction = () => {
        this.MemberSubAlert.open();
    };

    _renderListHeader = () => {
        const { mainImages, packageVideo } = this.memberProductModel;
        const imgFileList = (mainImages || []).map((item) => {
            return { originalImg: item };
        });
        return (
            <View>
                <DetailBanner
                    data={{ imgFileList, videoUrl: packageVideo, videoCover: mainImages[0] }}
                    navigation={this.props.navigation}/>
                <MemberPriceView memberProductModel={this.memberProductModel} allAction={this._allAction}/>
                <MemberNameView memberProductModel={this.memberProductModel}/>
            </View>
        );
    };

    _renderListFooter = ({ afterSaleLimitText, afterSaleTip }) => {
        return <NoMoreClick style={styles.iconView} onPress={() => {
            this.SuitExplainModal.open(afterSaleLimitText, afterSaleTip);
        }}>
            <MRText style={styles.iconText}>{afterSaleLimitText}</MRText>
            <Image style={styles.iconImg} source={res.suitProduct.suitWhy}/>
        </NoMoreClick>;
    };

    _renderItem = ({ item }) => {
        return <ContentItemView item={item}/>;
    };

    _render() {
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState !== PageLoadingState.success &&
                <NavigatorBar leftPressed={() => {
                    this.$navigateBack();
                }}/>}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    _renderContent = () => {
        const { detailImages, mainImages } = this.memberProductModel;
        const { afterSaleLimitText, afterSaleTip, shareContent } = this.memberProductModel;
        const { productCode } = this.params;
        const htmlUrl = `${apiEnvironment.getCurrentH5Url()}/giftpack-product?spucode=${productCode}&upuserid=${user.code || ''}&index=0`;
        return (
            <View style={{ flex: 1 }}>
                <MemberNavView showAction={this._rightAction}/>
                <FlatList data={detailImages}
                          ListHeaderComponent={this._renderListHeader}
                          ListFooterComponent={this._renderListFooter({ afterSaleLimitText, afterSaleTip })}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <MemberBuyView memberProductModel={this.memberProductModel} buyAction={this._buyAction}/>

                <SuitExplainModal ref={(ref) => this.SuitExplainModal = ref}/>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
                <MemberSubAlert ref={(ref) => this.MemberSubAlert = ref} memberProductModel={this.memberProductModel}/>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                webJson={{
                                    title: shareContent,
                                    dec: '',
                                    linkUrl: htmlUrl,
                                    thumImage: mainImages[0]
                                }}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
