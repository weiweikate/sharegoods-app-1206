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
        const { mainProduct, totalProPrice } = this.memberProductModel;
        this.SelectionPage.show(mainProduct, (amount, skuCode, skuItem) => {

        }, { priceShow: totalProPrice });
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
                                    linkUrl: '',
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
