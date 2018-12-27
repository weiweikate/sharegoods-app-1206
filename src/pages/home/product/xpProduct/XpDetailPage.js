import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import BasePage from '../../../../BasePage';
import XpDetailProductView from './components/XpDetailProductView';
import XpDetailSelectListView from './components/XpDetailSelectListView';
import XpDetailBottomView from './components/XpDetailBottomView';
import XpDetailUpSelectListView from './components/XpDetailUpSelectListView';
import XpDetailParamsModal from './components/XpDetailParamsModal';
import XpDetailActivityInfoModal from './components/XpDetailActivityInfoModal';
import XpDetailModel from './XpDetailModel';
import { observer } from 'mobx-react';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../../../comm/res';
import procductRes from '../../res';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import ScreenUtils from '../../../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import SelectionPage from '../SelectionPage';
import shopCartCacheTool from '../../../shopCart/model/ShopCartCacheTool';
import { track, trackEvent } from '../../../../utils/SensorsTrack';

const arrow_right_black = res.button.arrow_right_black;
const detail_more_down = procductRes.product.detailNavView.detail_more_down;

@observer
export class XpDetailPage extends BasePage {

    xpDetailModel = new XpDetailModel();

    $navigationBarOptions = {
        title: '经验值专区',
        rightNavImage: detail_more_down
    };

    _getBasePageStateOptions = () => {
        return {
            loadingState: this.xpDetailModel.basePageState,
            netFailedProps: {
                buttonText: '重新加载',
                netFailedInfo: this.xpDetailModel.basePageError,
                reloadBtnClick: this._request_act_exp_detail
            }
        };
    };

    _getProductStateOptions = () => {
        return {
            loadingState: this.xpDetailModel.productPageState,
            netFailedProps: {
                buttonText: '重新加载',
                netFailedInfo: this.xpDetailModel.productPageError,
                reloadBtnClick: this.xpDetailModel.request_getProductDetailByCode
            }
        };
    };

    componentDidMount() {
        this._request_act_exp_detail();
    }

    _request_act_exp_detail = () => {
        const { activityCode } = this.params;
        this.xpDetailModel.request_act_exp_detail(activityCode);
    };

    /*活动信息*/
    _activityAction = () => {
        this.XpDetailActivityInfoModal.show(this.xpDetailModel);
    };

    /*产品参数*/
    _paramsAction = () => {
        this.XpDetailParamsModal.show(this.xpDetailModel);
    };

    /*加入购物车 立即购买*/
    _bottomViewAction = (type) => {
        if (type === 'goGwc') {

        }
        this.goType = type;
        this.SelectionPage.show(this.xpDetailModel.pData, this._selectionViewConfirm);
    };

    /*选择规格确认*/
    _selectionViewConfirm = (amount, skuCode) => {
        let orderProducts = [];
        if (this.goType === 'joinCart') {
            let temp = {
                'amount': amount,
                'skuCode': skuCode,
                'productCode': this.xpDetailModel.selectedSpuCode
            };
            shopCartCacheTool.addGoodItem(temp);

            /*加入购物车埋点*/
            const { prodCode, name, firstCategoryId, secCategoryId, minPrice } = this.xpDetailModel.pData;
            track(trackEvent.addToShoppingcart, {
                shoppingcartEntrance: '详情页面',
                commodityNumber: amount,
                commodityID: prodCode,
                commodityName: name,
                firstCommodity: firstCategoryId,
                secondCommodity: secCategoryId,
                pricePerCommodity: minPrice
            });
        } else if (this.goType === 'buy') {
            //订单延签卡  加个菊花
            this.$loadingShow();
            orderProducts.push({
                skuCode: skuCode,
                quantity: amount,
                productCode: this.xpDetailModel.selectedSpuCode
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts,
                    source: 2
                }
            });
        }
    };

    _renderProduct = () => {
        return <View>
            {/*商品信息*/}
            <XpDetailProductView xpDetailModel={this.xpDetailModel}/>
            <View style={styles.productPramsView}>
                <TouchableOpacity style={styles.pramsBtn} onPress={this._activityAction}>
                    <Text style={styles.pramsText}>活动规则</Text>
                    <Image style={styles.arrowImg} source={arrow_right_black}/>
                </TouchableOpacity>
                <View style={styles.lineView}/>
                <TouchableOpacity style={styles.pramsBtn} onPress={this._paramsAction}>
                    <Text style={styles.pramsText}>参数信息</Text>
                    <Image style={styles.arrowImg} source={arrow_right_black}/>
                </TouchableOpacity>
            </View>
            <View style={styles.productInfoView}>
                <View style={styles.infoTextView}>
                    <Text style={styles.pramsText}>商品信息</Text>
                    {/*图片详情*/}
                    <HTML html={this.xpDetailModel.pHtml}
                          imagesMaxWidth={ScreenUtils.width}
                          imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                          containerStyle={{ backgroundColor: '#fff' }}/>
                </View>
            </View>
        </View>;
    };

    _renderBaseView = () => {
        let pageStateDic = this._getProductStateOptions();
        return <View style={styles.container}>
            <ScrollView>
                {/*选择框*/}
                <XpDetailSelectListView xpDetailModel={this.xpDetailModel}/>
                {/*页面状态*/}
                {renderViewByLoadingState(pageStateDic, this._renderProduct)}
            </ScrollView>

            {/*购买,购物车*/}
            {pageStateDic.loadingState === PageLoadingState.success &&
            <XpDetailBottomView bottomViewAction={this._bottomViewAction}/>}

            {/*上拉显示的选择框*/}
            <XpDetailUpSelectListView xpDetailModel={this.xpDetailModel}/>
        </View>;
    };

    _render() {
        return (
            <View style={styles.container}>
                {/*页面状态*/}
                {renderViewByLoadingState(this._getBasePageStateOptions(), this._renderBaseView)}

                {/*modal*/}
                {/*活动信息*/}
                <XpDetailParamsModal ref={(e) => this.XpDetailParamsModal = e}/>
                {/*规格*/}
                <XpDetailActivityInfoModal ref={(e) => this.XpDetailActivityInfoModal = e}/>
                {/*sku选择*/}
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    productPramsView: {
        marginTop: 10,
        backgroundColor: DesignRule.white
    },
    pramsBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 44
    },
    pramsText: {
        marginLeft: 15,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    arrowImg: {
        marginRight: 15
    },
    lineView: {
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        height: StyleSheet.hairlineWidth
    },

    productInfoView: {
        marginTop: 10,
        backgroundColor: DesignRule.white
    },
    infoTextView: {
        height: 44, justifyContent: 'center'
    }
});

export default XpDetailPage;
