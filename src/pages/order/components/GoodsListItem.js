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
import DesignRule from '../../../constants/DesignRule';
import res from '../res'
import ScreenUtils from '../../../utils/ScreenUtils';
import { GetViewOrderStatus, checkOrderAfterSaleService, OrderType } from '../order/OrderType';
const arrow_black_bottom = res.button.arrow_black_bottom

export default class GoodsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false //用于控制更多按钮的弹出框
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


    renderMenu = () => {
        const {
            baseInfo,
            merchantOrder,
            operationMenuClick,

        } = this.props;
        let orderStatus = merchantOrder.status;
        //merchantOrder.isGroup)
        let nameArr = [...GetViewOrderStatus(orderStatus,null, merchantOrder.isGroup).menuData];
        let hasAfterSaleService = checkOrderAfterSaleService(merchantOrder.productOrderList, orderStatus, baseInfo.nowTime)
        if (orderStatus === 4 && merchantOrder.commentStatus) {
            nameArr.push({
                id: 10,
                operation: '晒单',
                isRed: true
            });
        }
        if (hasAfterSaleService) {
            let cancelIndex = -1
            nameArr.forEach((item, index) => {
                if (item.operation === '删除订单') {
                    cancelIndex = index;
                }
            })
            nameArr.splice(cancelIndex+1, 0, {
                id: 99,
                operation: '申请售后',
                isRed: false
            })

            if (orderStatus === OrderType.COMPLETED && cancelIndex !== -1) {
                nameArr.splice(cancelIndex, 1);
            }

        }
        if (nameArr.length === 0) {
            return null;
        }

        let isAllVirtual = true;
        let isPhoneOrder = true;
        merchantOrder.productOrderList.forEach((item) => {
            if (item.orderType != 1){
                isAllVirtual = false;
            }

            if ((item.resource || {}).resourceType !== 'TELEPHONE_CHARGE'){
                isPhoneOrder = false;
            }
        });

        nameArr = nameArr.filter((item) => {
            if (!merchantOrder.existLogistics && item.operation === '查看物流') {
                return false;
            }
            if (!isAllVirtual){
                return true;
            }
            if (item.operation === '查看物流' || item.operation === '确认收货'){
                return false;
            }

            if (isPhoneOrder && item.operation === '再次购买') {
                return false;
            }
            return true;
        })

        let moreArr = []
        if (nameArr.length > 3){
            moreArr = nameArr.splice(0,nameArr.length - 3);
        }

        if (nameArr.length === 0){
            return null;
        }
        return <View style={{
            flexDirection: 'row',
            height: ScreenUtils.autoSizeWidth(40),
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center'
        }}>
                {moreArr.length > 0?
                    <NoMoreClick
                        style={{
                            height: ScreenUtils.autoSizeWidth(40),
                            width: ScreenUtils.autoSizeWidth(60),
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            left: 0,

                        }}
                        onPress={() => {
                            this.setState({isShow: !this.state.isShow})
                        }}
                    >
                        <Text style={{color: '#666666', fontSize: 12}}>更多></Text>
                    </NoMoreClick> : null}
                {nameArr.map((item, i) => {
                        return <NoMoreClick key={i} style={{
                            borderWidth: 1,
                            borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd,
                            height: ScreenUtils.autoSizeWidth(24),
                            borderRadius: ScreenUtils.autoSizeWidth(12),
                            marginRight: ScreenUtils.autoSizeWidth(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                            width:  ScreenUtils.autoSizeWidth(70)
                        }} onPress={() => {
                            this.setState({isShow: false})
                            operationMenuClick(item);
                        }}>
                            <Text
                                style={{
                                    color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle,
                                    fontSize: ScreenUtils.autoSizeWidth(12)
                                }}>{item.operation}</Text>
                        </NoMoreClick>;

                    }
                )}
            {
                this.state.isShow ?
                    <View style={{bottom: ScreenUtils.autoSizeWidth(40), right: ScreenUtils.autoSizeWidth(90*3-10), position: 'absolute',alignItems: 'center'}}>
                        {moreArr.map((item, i) => {
                                return <NoMoreClick key={i} style={{
                                    backgroundColor: '#999999',
                                    height: ScreenUtils.autoSizeWidth(30),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: ScreenUtils.autoSizeWidth(68)
                                }} onPress={() => {
                                    this.setState({isShow: false})
                                    operationMenuClick(item);
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: ScreenUtils.autoSizeWidth(13)
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
        let {
            merchantOrder,
            goodsItemClick,
            receiveInfo,
        } = this.props;
        receiveInfo = receiveInfo || {}
        let orderProduct = merchantOrder.productOrderList || []
        return orderProduct.map((item, index) => {
            let resource = item.resource || {}
            let resourceType = resource.resourceType;
            let category = item.spec
            if (resourceType === 'TELEPHONE_CHARGE'){
                category = '充值号码：' + receiveInfo.receiverPhone
            }
            // receiverPhone	String	18761600928
            return(
                <GoodsGrayItem
                    key={index}
                    style={{ backgroundColor: 'white' }}
                    uri={item.specImg || ''}
                    goodsName={item.productName}
                    salePrice={item.unitPrice}
                    category={category}
                    goodsNum={item.quantity}
                    onPress={()=> {goodsItemClick(); this.setState({isShow: false})}}
                    activityCodes={item.activityList || []}
                />)
        })
    };

    renderOrderNum = () => {
        const {
            baseInfo,
            merchantOrder
        } = this.props;
        return (
            <View style={{ height: 44, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UIText value={'订单提交时间：' + DateUtils.getFormatDate(baseInfo.orderTime / 1000)}
                            style={{ fontSize: 13, color: DesignRule.textColor_mainTitle, marginLeft: 18 }}/>
                    <UIText
                        value={ GetViewOrderStatus(merchantOrder.status, merchantOrder.subStatus, merchantOrder.isGroup).status}
                        style={{ fontSize: 13, color: DesignRule.mainColor, marginRight: 13 }}/>
                </View>
            </View>
        );
    };


    renderCalculate = () => {
        const {
            merchantOrder,
            payInfo,
            baseInfo
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
                <UIText value={`共${baseInfo.productQuantity}件商品  ${merchantOrder.status < 2 ? '需付款: ' : '实付款: '}`}

                        style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}/>
                <UIText value={StringUtils.formatMoneyString(payInfo.payAmount)}
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

