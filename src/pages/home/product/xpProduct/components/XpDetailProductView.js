import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';


const { px2dp } = ScreenUtils;

@observer
export class XpDetailProductView extends Component {

    _goFullImage = () => {

    };

    render() {
        const { xpDetailModel } = this.props;
        const { img, price, vip, leave, tittle, subTittle } = xpDetailModel;
        return (
            <View style={styles.bgView}>
                <TouchableWithoutFeedback onPress={this._goFullImage}>
                    <UIImage style={styles.headerImg} source={img}/>
                </TouchableWithoutFeedback>
                <View style={styles.levelPriceView}>
                    <View style={styles.levelView}>
                        <Text style={styles.levelText}>{vip}</Text>
                    </View>
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>¥<Text
                            style={styles.priceTextNum}>{price}</Text></Text>
                    </View>
                </View>
                <Text style={styles.leaveText}>{leave}</Text>
                <Text style={styles.tittle} numberofLines={2}>{tittle}</Text>
                <Text style={styles.subTittle}>{subTittle}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    /*背景*/
    bgView: {
        alignItems: 'center'
    },
    /*图片*/
    headerImg: {
        width: px2dp(180), height: px2dp(180)
    },
    /*等级价格*/
    levelPriceView: {
        flexDirection: 'row', alignItems: 'center',
        marginTop: 10
    },

    levelView: {
        justifyContent: 'center',
        height: 14,
        borderRadius: 2, borderWidth: 1, borderColor: DesignRule.mainColor
    },
    levelText: {
        paddingHorizontal: 5,
        fontSize: 10, color: DesignRule.textColor_redWarn
    },

    priceView: {
        flexDirection: 'row', alignItems: 'flex-end',
        marginLeft: 5
    },
    priceText: {
        fontSize: 10, color: DesignRule.textColor_redWarn
    },
    priceTextNum: {
        fontSize: 13
    },
    /*库存*/
    leaveText: {
        marginTop: 10,
        fontSize: 12, color: DesignRule.textColor_instruction
    },
    /*标题*/
    tittle: {
        textAlign: 'center',
        marginTop: 10, marginHorizontal: px2dp(39),
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    subTittle: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 11, color: DesignRule.textColor_instruction
    }
});

export default XpDetailProductView;
