import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { color } from '../../../constants/Theme';
// import GoodsItem from './GoodsItem';
import GoodsGrayItem from './GoodsGrayItem'
import DesignRule from 'DesignRule';

// status,//账单状态：0出账中，1待支付，2已支付，3逾期
const GoodsDetailItem = props => {
    const {
        uri,
        goodsName,
        salePrice,
        category,
        goodsNum,
        clickItem,
        afterSaleService,
        afterSaleServiceClick
    } = props;

    this.renderLine = () => {
        return (
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: color.line,
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
                <TouchableOpacity key={i}
                                  style={[styles.grayView, { borderColor: afterSaleService[i].isRed ? color.red : color.gray_DDD }]}
                                  onPress={() => {
                                      afterSaleServiceClick(afterSaleService[i]);
                                  }}>
                    <Text
                        style={[styles.grayText, { color: afterSaleService[i].isRed ? color.red : color.gray_666 }]}>{afterSaleService[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    this.renderLine = () => {
        return (
            <View style={{ flex: 1, height: 1, backgroundColor: color.white }}>
                <View style={{ flex: 1, height: 1, backgroundColor: color.line, marginLeft: 15 }}/>
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
                        backgroundColor: color.white
                    }}>
                        {this.renderMenu()}
                    </View>
                    {this.renderLine()}
                </View>
        );
    };
    return (
        <View>
            <GoodsGrayItem
                uri={uri}
                goodsName={goodsName}
                salePrice={salePrice}
                category={category}
                goodsNum={goodsNum}
                onPress={clickItem}/>
            {this.renderLine()}
            {this.renderAfterSaleService()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        flexDirection: 'row',
        height: 100
    }, grayView: {
        width: 80,
        height: 30,
        borderRadius: 15,
        backgroundColor: DesignRule.white,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#dddddd',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }, grayText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#666666'
    }
});
export default GoodsDetailItem;
