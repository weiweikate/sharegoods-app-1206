/**
 * Created by zhanglei on 2018/6/20.
 */

import React from 'react';
import {
    View
} from 'react-native';
import {
    UIText, MRText as Text, NoMoreClick
} from '../../../components/ui';
// import GoodsItem from './GoodsItem';
import GoodsGrayItem from './GoodsGrayItem';
import StringUtils from '../../../utils/StringUtils';
import DateUtils from '../../../utils/DateUtils';
import constants from '../../../constants/constants';
import DesignRule from '../../../constants/DesignRule';

const GoodsListItem = props => {
    const {
        // orderNum,
        orderCreateTime,
        orderStatus,
        warehouseType,
        subStatus,
        totalPrice,
        orderProduct,
        clickItem,
        goodsItemClick,
        operationMenuClick,
        // outTradeNo,
        platformPayTime,
        sendTime,
        finishTime,
        // shutOffTime,
        cancelTime,
        quantity,
        deliverTime,//发货时间
        commentStatus
    } = props;

    this.renderMenu = () => {
        let nameArr = constants.viewOrderStatus[orderStatus].menuData;
        if (orderStatus === 1) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: DesignRule.mainColor,
                                fontSize: 13
                            }}/>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {nameArr.map((item, i) => {
                            return <NoMoreClick key={i} style={{
                                borderWidth: 1,
                                borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                                height: 30,
                                borderRadius: 15,
                                marginRight: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 80
                            }} onPress={() => {
                                operationMenuClick(item);
                            }}>
                                <Text
                                    style={{
                                        color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle,
                                        fontSize: 13
                                    }} allowFontScaling={false}>{item.operation}</Text>
                            </NoMoreClick>;
                        })}
                    </View>
                </View>
            );
        } else {
            if (orderStatus == 4 && commentStatus) {
                nameArr = [{
                    id: 7,
                    operation: '删除订单',
                    isRed: false
                }, {
                    id: 8,
                    operation: '再次购买',
                    isRed: true
                }, {
                    id: 10,
                    operation: '晒单',
                    isRed: true
                }];
            }
            return <View style={{ flexDirection: 'row' }}>
                {nameArr.map((item, i) => {
                        return <NoMoreClick key={i} style={{
                            borderWidth: 1,
                            borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                            height: 30,
                            borderRadius: 15,
                            marginRight: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 80
                        }} onPress={() => {
                            operationMenuClick(item);
                        }}>
                            <Text
                                style={{
                                    color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle,
                                    fontSize: 13
                                }}>{item.operation}</Text>
                        </NoMoreClick>;

                    }
                )}
            </View>;
        }

    };
    this.renderLine = () => {
        return (
            <View style={{ flex: 1, height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    this.renderWideLine = () => {
        return (
            <View style={{ flex: 1, height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    this.renderGoodsList = () => {
        let itemArr = [];
        for (let i = 0; i < orderProduct.length; i++) {
            itemArr.push(
                <GoodsGrayItem
                    key={i}
                    style={{ backgroundColor: 'white' }}
                    uri={orderProduct[i].imgUrl || ''}
                    goodsName={orderProduct[i].productName}
                    salePrice={orderProduct[i].price}
                    category={orderProduct[i].spec}
                    goodsNum={orderProduct[i].num}
                    onPress={goodsItemClick}
                    activityCodes={orderProduct[i].activityCodes}
                />
            );
        }
        return itemArr;
    };
    this.renderOrderNum = () => {
        return (
            <View style={{ height: 44, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UIText value={'订单提交时间：' + DateUtils.getFormatDate(orderCreateTime / 1000)}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 18 }}/>
                    <UIText value={warehouseType != 2 && orderStatus == 3 && subStatus == 3?'部分发货':constants.viewOrderStatus[orderStatus].orderStatus}
                            style={{ fontSize: 13, color: DesignRule.mainColor, marginRight: 13 }}/>
                </View>
            </View>
        );
    };
    this.renderCalculate = () => {
        return (
            <View style={{
                flex: 1,
                height: 40,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 16
            }}>
                <UIText value={`共${quantity}件商品  ${orderStatus < 2 ? '需付款: ' : '实付款: '}`}

                        style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>
                <UIText value={StringUtils.formatMoneyString(totalPrice)}
                        style={{ fontSize: 13, color: DesignRule.mainColor }}/>
                {/*<UIText value={'（含运费' + StringUtils.formatMoneyString(freightPrice, false) + '）'}*/}
                {/*style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>*/}
            </View>
        );
    };
    this.renderTime = () => {
        let aboutTime;
        switch (orderStatus) {
            case 1:
            case 8:
                aboutTime = <UIText value={'创建时间：' + DateUtils.getFormatDate(orderCreateTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;

            case 2:
                aboutTime = <UIText value={'支付时间：' + DateUtils.getFormatDate(platformPayTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;
            case 3:
                aboutTime = <UIText value={'发货时间：' + DateUtils.getFormatDate(sendTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;

            case 4:
                aboutTime = <UIText value={'完成时间：' + DateUtils.getFormatDate(deliverTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;
            case 5:
            case 6:
                aboutTime = <UIText value={'完成时间：' + DateUtils.getFormatDate(finishTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;
            case 7:
                aboutTime = <UIText value={'取消时间：' + DateUtils.getFormatDate(cancelTime / 1000)}
                                    style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>;
                break;


        }
        return (
            <View style={{
                flex: 1,
                height: 40,
                backgroundColor: 'white',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 15,
                paddingLeft: 15
            }}>
                {aboutTime}
            </View>
        );
    };
    return (
        <View style={{
            marginLeft: 15,
            marginRight: 15,
            backgroundColor: 'white',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'white'
        }}>
            <NoMoreClick onPress={clickItem}>
                <View/>
                {this.renderOrderNum()}
                {this.renderGoodsList()}
                {this.renderCalculate()}
            </NoMoreClick>
            {constants.viewOrderStatus[orderStatus].menuData.length === 0 ? null :
                <View style={{
                    flexDirection: 'row',
                    height: 48,
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    {this.renderMenu()}
                </View>
            }
        </View>
    );
};

export default GoodsListItem;
