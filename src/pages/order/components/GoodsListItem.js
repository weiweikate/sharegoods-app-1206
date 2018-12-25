/**
 * Created by zhanglei on 2018/6/20.
 */

import React from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import {
    UIText, MRText as Text
} from '../../../components/ui';
// import GoodsItem from './GoodsItem';
import GoodsGrayItem from './GoodsGrayItem';
import StringUtils from '../../../utils/StringUtils';
import DateUtils from '../../../utils/DateUtils';
import constants from '../../../constants/constants';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';
import DesignRule from 'DesignRule';

const GoodsListItem = props => {
    const {
        orderNum,
        orderCreateTime,
        orderStatus,
        // freightPrice,
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
        callBack,
        quantity,
        deliverTime,//发货时间
    } = props;
    this.state = { pageStateString: '27:45:45后自动取消订单' };

    this.startCutDownTime2 = (autoConfirmTime2) => {
        let str = '1';
        let autoConfirmTime = Math.round((autoConfirmTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            callBack();
            return '超时关闭';
        }
        let time = (new TimeDownUtils()).getDateData2(autoConfirmTime2);
        if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
            if (callBack) {
                callBack();
                return '';
            }
        } else {
            str = '' + time.hours + ':' + time.min + ':' + time.sec + '后自动关闭';
            return str;
        }
    };
    //28:45:45后自动取消订单 {this.startCutDownTime2(shutOffTime)}
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
                            return <TouchableOpacity key={i} style={{
                                borderWidth: 1,
                                borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                                height: 30,
                                borderRadius: 15,
                                marginRight: 15,
                                justifyContent: 'center',
                                alignItems:'center',
                                width:80
                            }} onPress={() => {
                                operationMenuClick(item);
                            }}>
                                <Text
                                    style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle,fontSize:13 }} allowFontScaling={false}>{item.operation}</Text>
                            </TouchableOpacity>;
                        })}
                    </View>
                </View>
            );
        } else {
            return <View style={{ flexDirection: 'row' }}>
                {nameArr.map((item, i) => {
                        return <TouchableOpacity key={i} style={{
                            borderWidth: 1,
                            borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                            height: 30,
                            borderRadius: 15,
                            marginRight: 15,
                            justifyContent: 'center',
                            alignItems:'center',
                            width:80
                        }} onPress={() => {
                            operationMenuClick(item);
                        }}>
                            <Text
                                style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle ,fontSize:13}}>{item.operation}</Text>
                        </TouchableOpacity>;

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
                    uri={orderProduct[i].imgUrl}
                    goodsName={orderProduct[i].productName}
                    salePrice={orderProduct[i].price}
                    category={orderProduct[i].spec}
                    goodsNum={orderProduct[i].num}
                    onPress={goodsItemClick}
                />
            );
        }
        return itemArr;
    };
    this.renderOrderNum = () => {
        return (
            <View style={{ height: 44, backgroundColor: 'white', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UIText value={'订单编号：' + orderNum}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 18 }}/>
                    <UIText value={constants.viewOrderStatus[orderStatus].orderStatus}
                            style={{ fontSize: 13, color: DesignRule.mainColor, marginRight: 18 }}/>
                </View>
            </View>
        );
    };
    this.renderCalculate = () => {
        return (
            <View style={{
                flex: 1,
                height: 40,
                backgroundColor: 'white',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: 16
            }}>
                <UIText value={`共${quantity}件商品  ${orderStatus<2?'需付款: ':'实付款: '}`}

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
                paddingRight: 16,
                paddingLeft: 16
            }}>
                {aboutTime}
            </View>
        );
    };
    return (
        <View>
            <TouchableOpacity onPress={clickItem}>
                <View />
                {this.renderOrderNum()}
                {this.renderGoodsList()}
                {this.renderCalculate()}
                {/*{this.renderLine()}*/}
                {/*{this.renderTime()}*/}
                {this.renderLine()}
            </TouchableOpacity>
            {constants.viewOrderStatus[orderStatus].menuData.length === 0 ? null :
                <View style={{
                    flexDirection: 'row',
                    height: 48,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}>
                    {this.renderMenu()}
                </View>
            }
            {this.renderWideLine()}
        </View>
    );
};

export default GoodsListItem;
