import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import UIImage from '@mr/image-placeholder';
import { MRText as Text } from '../../../../../components/ui';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DesignRule from '../../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import { formatDate } from '../../../../../utils/DateUtils';
import StringUtils from '../../../../../utils/StringUtils';

const { px2dp } = ScreenUtils;

@observer
export class XpDetailProductView extends Component {

    render() {
        const { xpDetailModel, imgBtnAction } = this.props;
        const { pImgUrl, pPriceType, pPrice, pName, pSecondName, skuTotal, pProductStatus, pUpTime } = xpDetailModel;
        let imgText = `${StringUtils.isNoEmpty(pUpTime) ? formatDate(pUpTime, 'MM月dd号HH:mm') : ''}开售`;
        return (
            <View style={styles.bgView}>
                <TouchableWithoutFeedback onPress={imgBtnAction}>
                    <View>
                        <UIImage style={styles.headerImg} source={{ uri: pImgUrl }}/>
                        {pProductStatus === 3 ?
                            <View style={styles.ImgAbView}>
                                <Text style={styles.ImgAbText}>{imgText}</Text>
                            </View> : null}
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.levelPriceView}>
                    <View style={styles.levelView}>
                        <Text style={styles.levelText}>{pPriceType}</Text>
                    </View>
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>¥<Text
                            style={styles.priceTextNum}>{pPrice}</Text></Text>
                    </View>
                </View>
                <Text style={styles.leaveText}>{`库存${skuTotal}`}</Text>
                <Text style={styles.tittle} numberofLines={2}>{pName}</Text>
                <Text style={styles.subTittle}>{pSecondName}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    /*背景*/
    bgView: {
        alignItems: 'center',
        paddingBottom: 15,
        backgroundColor: DesignRule.white
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
    },

    ImgAbView: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: 22,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    ImgAbText: {
        color: DesignRule.white,
        fontSize: 13
    }
});

export default XpDetailProductView;
