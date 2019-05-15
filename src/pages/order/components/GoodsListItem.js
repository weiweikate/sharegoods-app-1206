/**
 * Created by zhanglei on 2018/6/20.
 */

import React from 'react';
import {
    View,
    Image
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
import res from '../res'
const arrow_black_bottom = res.button.arrow_black_bottom

export default class GoodsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }

    render() {
        const {
            clickItem,
        } = this.props;
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
                {this.renderMenu()}
            </View>
        )
    }

    checkOrderAfterSaleService = (products = [], status, nowTime) => {
        if (status === 1) {//待付款、无售后
            return false;
        }
        let hasAfterSaleService = false;

        products.forEach((product) => {
            let { activityCodes = [], afterSaleTime } = product
            //礼包产品3  经验值专区商品5 无售后
            if (activityCodes && activityCodes.length > 0 && (activityCodes[0].orderType === 3 || activityCodes[0].orderType === 5)) {
                return;
            }
            //商品售后已过期 无售后
            if (status > 3 && nowTime && afterSaleTime && afterSaleTime < nowTime) {
                return;
            }

            hasAfterSaleService = true;
        })


        return hasAfterSaleService

    }

    renderMenu = () => {
        const {
            orderStatus,
            orderProduct,
            nowTime,
            operationMenuClick,
            commentStatus
        } = this.props;

        let nameArr = [...constants.viewOrderStatus[orderStatus].menuData];
        let hasAfterSaleService = this.checkOrderAfterSaleService(orderProduct, orderStatus, nowTime)
            if (orderStatus === 4 && commentStatus) {
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
            if (hasAfterSaleService) {
                let cancelIndex = 0
                nameArr.forEach((item, index) => {
                    if (item.operation === '删除订单') {
                        cancelIndex = index + 1;
                    }
                })
                nameArr.splice(cancelIndex, 0, {
                    id: 99,
                    operation: '申请售后',
                    isRed: false
                })

            }
            if (nameArr.length === 0) {
                return null;
            }

            let moreArr = []
        if (nameArr.length > 3){
            moreArr = nameArr.splice(0,nameArr.length - 3);
        }


        return <View style={{
                flexDirection: 'row',
                height: 48,
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row' }}>
            {moreArr.length > 0?
                    <NoMoreClick
                        style={{
                            height: 30,
                            width: 68,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            this.setState({isShow: !this.state.isShow})
                        }}
                    >
                        <Text style={{color: '#666666', fontSize: 13}}>更多</Text>
                    </NoMoreClick> : null}
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
                                this.setState({isShow: false})
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
                </View>
            {
                this.state.isShow ?
                    <View style={{bottom: 40, right: 95*3, position: 'absolute',alignItems: 'center'}}>
                        {moreArr.map((item, i) => {
                                return <NoMoreClick key={i} style={{
                                    backgroundColor: '#999999',
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 68
                                }} onPress={() => {
                                    this.setState({isShow: false})
                                    operationMenuClick(item);
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 13
                                        }}>{item.operation}</Text>
                                </NoMoreClick>;

                            }
                        )}
                        <Image source={arrow_black_bottom} style={{height: 6, width: 12}}/>
                </View> : null
            }

            </View>
    }


        renderGoodsList = () => {
            const {
                orderProduct,
                goodsItemClick
            } = this.props;
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
                        onPress={(data)=> {goodsItemClick(data); this.setState({isShow: false})}}
                        activityCodes={orderProduct[i].activityCodes}
                    />
                );
            }
            return itemArr;
        };

        renderOrderNum = () => {
            const {
                orderStatus,
                orderCreateTime,
                warehouseType,
                subStatus
            } = this.props;
            return (
                <View style={{ height: 44, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <UIText value={'订单提交时间：' + DateUtils.getFormatDate(orderCreateTime / 1000)}
                                style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 18 }}/>
                        <UIText
                            value={warehouseType !== 2 && orderStatus === 3 && subStatus === 3 ? '部分发货' : constants.viewOrderStatus[orderStatus].orderStatus}
                            style={{ fontSize: 13, color: DesignRule.mainColor, marginRight: 13 }}/>
                    </View>
                </View>
            );
        };


        renderCalculate = () => {
            const {
                orderStatus,
                quantity,
                totalPrice,
            } = this.props;
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


        renderTime = () => {
            const {
                orderStatus,
                orderCreateTime,
                platformPayTime,
                sendTime,
                deliverTime,
                finishTime,
                cancelTime
            } = this.props;
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
    }

