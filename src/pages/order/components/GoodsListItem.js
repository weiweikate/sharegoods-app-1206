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
// import GoodsItem from './GoodsItem';
import GoodsGrayItem from './GoodsGrayItem'
import StringUtils from '../../../utils/StringUtils';
import DateUtils from '../../../utils/DateUtils';
import constants from '../../../constants/constants';
import { TimeDownUtils } from '../../../utils/TimeDownUtils';

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
        outTradeNo,
        platformPayTime,
        sendTime,
        finishTime,
        shutOffTime,
        cancelTime,
        callBack,
        autoReceiveTime,
        //deliverTime,
    } = props;
    this.state = { pageStateString: '27:45:45后自动取消订单' };

    this.startCutDownTime2 = (autoConfirmTime2) => {
        let str = '1';
        let autoConfirmTime = Math.round((autoConfirmTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return '';
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
    //28:45:45后自动取消订单
    this.renderMenu = () => {
        let nameArr = constants.viewOrderStatus[orderStatus].menuData;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            if (orderStatus == 1) {

                if (StringUtils.isNoEmpty(outTradeNo)) {
                    nameArr = [{
                        id: 1,
                        operation: '取消订单',
                        isRed: false
                    },
                        {
                            id: 3,
                            operation: '继续支付',
                            isRed: true
                        }
                    ];
                } else {
                    nameArr = [{
                        id: 1,
                        operation: '取消订单',
                        isRed: false
                    },
                        {
                            id: 2,
                            operation: '去支付',
                            isRed: true
                        }
                    ];
                }
                return (
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                            <Text
                                style={{ color: '#D51243', fontSize: 13 }}>{this.startCutDownTime2(shutOffTime)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {nameArr.map((item, i) => {
                                return <TouchableOpacity key={i} style={{
                                    borderWidth: 1,
                                    borderColor: item.isRed ? color.red : color.gray_DDD,
                                    height: 30,
                                    borderRadius: 10,
                                    marginRight: 15,
                                    justifyContent: 'center',
                                    paddingLeft: 20,
                                    paddingRight: 20
                                }} onPress={() => {
                                    operationMenuClick(item);
                                }}>
                                    <Text
                                        style={{ color: item.isRed ? color.red : color.gray_666 }}>{item.operation}</Text>
                                </TouchableOpacity>;
                            })}
                        </View>
                    </View>
                );
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
        let aboutTime;
        switch (orderStatus) {
            case 1:
            case 8:
                aboutTime = <UIText value={'创建时间：' + DateUtils.getFormatDate(orderCreateTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;

            case 2:
                aboutTime = <UIText value={'付款时间：' + DateUtils.getFormatDate(platformPayTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;
            case 3:
                aboutTime = <UIText value={'发货时间：' + DateUtils.getFormatDate(sendTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;

            case 4:
                aboutTime = <UIText value={'完成时间：' + DateUtils.getFormatDate(autoReceiveTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;
            case 5:
            case 6:
                aboutTime = <UIText value={'完成时间：' + DateUtils.getFormatDate(finishTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;
            case 7:
                aboutTime = <UIText value={'取消时间：' + DateUtils.getFormatDate(cancelTime / 1000)}
                                    style={{ fontSize: 13, color: color.black_222 }}/>;
                break;


        }
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
                {aboutTime}
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
