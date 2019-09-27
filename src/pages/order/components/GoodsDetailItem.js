import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
// import GoodsItem from './GoodsItem';
import GoodsGrayItem from './GoodsGrayItem';
import DesignRule from '../../../constants/DesignRule';
import { MRText as Text } from '../../../components/ui';
// status,//账单状态：0出账中，1待支付，2已支付，3逾期
const GoodsDetailItem = props => {
    let {
        uri,
        goodsName,
        salePrice,
        category,
        goodsNum,
        clickItem,
        afterSaleService,
        afterSaleServiceClick,
        style,
        activityCodes
    } = props;
    afterSaleService = afterSaleService || [];
    this.renderLine = () => {
        return (
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginTop: 10,
                marginBottom: 10,
                alignItems: 'center'
            }}/>
        );
    };
    this.renderMenu = () => {
        let itemArr = [];
        for (let i = 0; i < afterSaleService.length; i++) {
            itemArr.push(
                <TouchableOpacity
                    activeOpacity={0.7} key={i}
                    style={[styles.grayView, { borderColor: afterSaleService[i].isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                    onPress={() => {
                        afterSaleServiceClick(afterSaleService[i]);
                    }}>
                    <Text
                        style={[styles.grayText, { color: afterSaleService[i].isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }]}
                        allowFontScaling={false}>{afterSaleService[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    this.renderLine = () => {
        return (
            <View style={{ flex: 1, height: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: DesignRule.lineColor_inColorBg, marginLeft: 15 }}/>
            </View>
        );
    };
    this.renderAfterSaleService = () => {
        return (afterSaleService.length === 0 ? null :
                <View>
                    <View style={{
                        flexDirection: 'row',
                        height: 48,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        marginBottom: 1,
                    }}>
                        {this.renderMenu()}
                    </View>
                </View>
        );
    };
    return (
        <View>
            <GoodsGrayItem
                uri={uri}
                activityCodes={activityCodes}
                goodsName={goodsName}
                salePrice={salePrice}
                category={category}
                goodsNum={goodsNum}
                onPress={clickItem}
                style={style}/>
            {this.renderAfterSaleService()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 100
    }, grayView: {
        width: 90,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }, grayText: {
        fontSize: 13,
        lineHeight: 18,
        color: DesignRule.textColor_secondTitle
    }
});
export default GoodsDetailItem;
