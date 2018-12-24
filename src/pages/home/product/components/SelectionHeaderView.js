import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    TouchableOpacity, StyleSheet
} from 'react-native';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import UIImage from '@mr/image-placeholder';
import {MRText as Text} from '../../../../components/ui';


const icon_close = res.product.icon_close;


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

    render() {
        const { imgUrl, minPrice } = this.props.product || {};
        let price = minPrice || '';
        let stock = 0;
        let stockUnit = '';
        let specImg;
        this.props.selectSpecList.forEach((item) => {
            //总库存库存遍历相加
            stock = stock + item.sellStock;
            //件
            stockUnit = item.stockUnit;
            specImg = item.specImg;
            price = item.price;
        });

        let selectStrListTemp = this.props.selectStrList.filter((item) => {
            return !StringUtils.isEmpty(item);
        });

        return (
            <View style={{ backgroundColor: 'transparent' }}>
                <UIImage style={styles.headerImg} source={{ uri: specImg || imgUrl || '' }} borderRadius={5}/>
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
                            }} allowFontScaling={false}>{`库存${stock}${stockUnit || ''}`}</Text>
                        <Text style={{
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 13,
                            marginTop: 6
                        }} numberOfLines={2} allowFontScaling={false}>{selectStrListTemp.join(',').replace(/@/g, '')}</Text>
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
    }
});
