/**
 * Created by zhanglei on 2018/6/20.
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { color } from '../../../constants/Theme';
import {
    UIText
} from '../../../components/ui';
import GoodsItem from './GoodsItem';
import StringUtils from '../../../utils/StringUtils';
import DateUtils from '../../../utils/DateUtils';
import constants from '../../../constants/constants';

const GoodsListItem = props => {
    const {
        orderNum,
        orderCreateTime,
        orderStatus,
        freightPrice,
        totalPrice,
        orderProduct,
        clickItem,
        goodsItemClick,
        operationMenuClick,
        outTrandNo
    } = props;

    this.renderMenu = () => {
        let nameArr = constants.viewOrderStatus[orderStatus].menuData;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            if ((StringUtils.isNoEmpty(outTrandNo) && nameArr[i].id == 2) | (StringUtils.isEmpty(outTrandNo) && nameArr[i].id == 3)) {

            } else {
                itemArr.push(
                    <TouchableOpacity key={i} style={{
                        borderWidth: 1,
                        borderColor: nameArr[i].isRed ? color.red : color.gray_DDD,
                        height: 30,
                        borderRadius: 10,
                        marginRight: 15,
                        justifyContent: 'center',
                        paddingLeft: 20,
                        paddingRight: 20
                    }} onPress={() => {
                        operationMenuClick(nameArr[i]);
                    }}>
                        <Text
                            style={{ color: nameArr[i].isRed ? color.red : color.gray_666 }}>{nameArr[i].operation}</Text>
                    </TouchableOpacity>
                );
            }

        }
        return itemArr;
    };
    this.renderLine = () => {
        return (
            <View style={{ flex: 1, height: 1, backgroundColor: color.line }}/>
        );
    };
    this.renderWideLine = () => {
        return (
            <View style={{ flex: 1, height: 10, backgroundColor: color.page_background }}/>
        );
    };
    this.renderGoodsList = () => {
        let itemArr = [];
        for (let i = 0; i < orderProduct.length; i++) {
            itemArr.push(
                <GoodsItem
                    key={i}
                    uri={orderProduct[i].imgUrl}
                    goodsName={orderProduct[i].productName}
                    salePrice={orderProduct[i].price}
                    category={orderProduct[i].spec}
                    goodsNum={'X' + orderProduct[i].num}
                    onPress={goodsItemClick}
                />
            );
        }
        return itemArr;
    };
    this.renderOrderNum = () => {
        return (
            <View style={{ height: 44, backgroundColor: color.white, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UIText value={'订单编号：' + orderNum}
                            style={{ fontSize: 13, color: color.black_222, marginLeft: 18 }}/>
                    <UIText value={constants.viewOrderStatus[orderStatus].orderStatus}
                            style={{ fontSize: 13, color: color.red, marginRight: 18 }}/>
                </View>
            </View>
        );
    };
    this.renderCalculate = () => {
        return (
            <View style={{
                flex: 1,
                height: 40,
                backgroundColor: color.white,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 16
            }}>
                <UIText value={'共' + orderProduct.length + '件商品  合计：'}
                        style={{ fontSize: 13, color: color.black_222 }}/>
                <UIText value={StringUtils.formatMoneyString(totalPrice)} style={{ fontSize: 13, color: color.red }}/>
                <UIText value={'（含运费' + StringUtils.formatMoneyString(freightPrice, false) + '）'}
                        style={{ fontSize: 13, color: color.black_222 }}/>
            </View>
        );
    };
    this.renderTime = () => {
        return (
            <View style={{
                flex: 1,
                height: 40,
                backgroundColor: color.white,
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 16,
                paddingLeft: 16
            }}>
                <UIText value={'创建时间：' + DateUtils.getFormatDate(orderCreateTime / 1000)}
                        style={{ fontSize: 13, color: color.black_222 }}/>
            </View>
        );
    };
    return (
        <View>
            <TouchableOpacity onPress={clickItem}>
                {this.renderOrderNum()}
                {this.renderGoodsList()}
                {this.renderCalculate()}
                {this.renderLine()}
                {this.renderTime()}
                {this.renderLine()}
            </TouchableOpacity>
            {constants.viewOrderStatus[orderStatus].menuData.length == 0 ? null :
                <View style={{
                    flexDirection: 'row',
                    height: 48,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: color.white
                }}>
                    {this.renderMenu()}
                </View>
            }
            {this.renderWideLine()}
        </View>
    );
};

export default GoodsListItem;
