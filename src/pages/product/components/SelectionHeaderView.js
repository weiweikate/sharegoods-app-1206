import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    TouchableOpacity, StyleSheet
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';
import UIImage from '@mr/image-placeholder';
import { MRText as Text } from '../../../components/ui/index';
import { sourceType } from '../SelectionPage';
import RouterMap, { navigate } from '../../../navigation/RouterMap';
import NoMoreClick from '../../../components/ui/NoMoreClick';

const { icon_close } = res;


/**
 * 规格选择头部view
 */

export default class SelectionHeaderView extends Component {

    static propTypes = {
        product: PropTypes.object.isRequired,
        selectSpecList: PropTypes.array.isRequired,
        selectStrList: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _seeBigImage = () => {
        const { closeSelectionPage } = this.props;
        const { imgUrl, skuList } = this.props.product || {};
        let imageUrls = [];
        for (const item of skuList || []) {
            let tempUrl = StringUtils.isNoEmpty(item.specImg) ? item.specImg : imgUrl;
            if (imageUrls.indexOf(tempUrl) == -1) {
                imageUrls.push(tempUrl);
            }
        }
        if (imageUrls.length > 0) {
            closeSelectionPage();
            navigate(RouterMap.CheckBigImagesView, { imageUrls: imageUrls });
        }
    };

    render() {
        const { imgUrl, minPrice, promotionMinPrice, stockSysConfig } = this.props.product || {};
        let isPromotion = this.props.sourceType === sourceType.promotion;

        let price = isPromotion ? promotionMinPrice : minPrice;
        let stock = 0;
        let specImg;
        this.props.selectSpecList.forEach((item) => {
            //总库存库存遍历相加
            stock = stock + (isPromotion ? item.promotionStockNum : item.sellStock);
            specImg = item.specImg;
            price = isPromotion ? item.promotionPrice : item.price;
        });
        let goodsNumberText;
        for (let item of (stockSysConfig || [])) {
            const tempArr = item.value.split('★');
            if (parseFloat(stock) >= parseFloat(tempArr[0])) {
                goodsNumberText = tempArr[1];
                break;
            }
        }
        let selectStrListTemp = this.props.selectStrList.filter((item) => {
            return !StringUtils.isEmpty(item);
        }) || [];

        return (
            <View style={{ backgroundColor: 'transparent' }}>
                <NoMoreClick style={styles.headerImg} onPress={this._seeBigImage}>
                    <UIImage style={styles.img} source={{ uri: specImg || imgUrl || '' }} borderRadius={5}/>
                </NoMoreClick>
                <View style={{ backgroundColor: 'white', marginTop: 20, height: 95 }}>
                    <View style={{ marginLeft: 132 }}>
                        <Text style={{
                            color: DesignRule.mainColor,
                            fontSize: 16,
                            marginTop: 14
                        }} allowFontScaling={false}>{`￥${price}`}</Text>
                        <Text
                            style={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 13,
                                marginTop: 6
                            }}>{`库存${goodsNumberText || stock}`}</Text>
                        <Text style={{
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 13,
                            marginTop: 6
                        }} numberOfLines={2}
                              allowFontScaling={false}>{selectStrListTemp.join(',').replace(/@/g, '')}</Text>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16 }}
                                      onPress={this.props.closeSelectionPage}>
                        <Image source={icon_close}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerImg: {
        height: 107,
        width: 107,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 15,
        zIndex: 1
    },
    img: {
        height: 107,
        width: 107
    }
});
