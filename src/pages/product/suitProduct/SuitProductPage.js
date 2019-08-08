import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { SubProductView } from './components/SuitProductItemView';
import SuitProductModel from './SuitProductModel';
import { observer } from 'mobx-react';
import SuitProductBottomView from './components/SuitProductBottomView';
import RouterMap from '../../../navigation/RouterMap';
import user from '../../../model/user';
import { MRText } from '../../../components/ui';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import { AutoHeightImage } from '../../../components/ui/AutoHeightImage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SuitExplainModal from './components/SuitExplainModal';
import NoMoreClick from '../../../components/ui/NoMoreClick';

@observer
export default class SuitProductPage extends BasePage {

    suitProductModel = new SuitProductModel();

    $navigationBarOptions = {
        title: '优惠套装'
    };

    constructor(props) {
        super(props);
        const { productDetailSuitModel, packageIndex } = this.params;
        this.suitProductModel.setProductArr(productDetailSuitModel, packageIndex);
    }

    _bottomAction = () => {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        const { selectedAmount, packageItem, suitProducts, selectedProductSkuS, isSuitFixed, selected_products } = this.suitProductModel;
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
        const { groupCode } = packageItem;
        let orderProductList = selectedProductSkuS.map((item) => {
            const { prodCode, skuCode } = item;
            return {
                activityCode: groupCode,
                batchNo: 1,
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

    _render() {
        const { suitProducts, packageItem, afterSaleLimitText } = this.suitProductModel;
        const totalProduct = suitProducts || [];
        const { image, afterSaleTip } = packageItem;
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
