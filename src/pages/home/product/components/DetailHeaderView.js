import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Text,
    View
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ProductActivityView from './ProductActivityView';
import user from '../../../../model/user';
import DesignRule from 'DesignRule';
import DetailBanner from './DetailBanner';

/**
 * 商品详情头部view
 */

export default class DetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            haveVideo: false
        };
    }

    componentDidMount() {
    }

    updateTime(activityData, activityType, callBack) {
        this.ProductActivityView.saveActivityViewData(activityData, activityType, callBack);
    }

    render() {
        const { activityType } = this.props;
        const { freight = 0, monthSaleTotal = 0, price = 0, originalPrice = 0, product = {}, priceType = '' } = this.props.data || {};
        const { name = '', afterSaleServiceDays } = product;
        return (
            <View>
                <DetailBanner data={this.props.data} navigation={this.props.navigation}/>
                {activityType === 1 || activityType === 2 ?
                    <ProductActivityView activityType={activityType}
                                         ref={(e) => {
                                             this.ProductActivityView = e;
                                         }}
                                         activityData={this.props.activityData}
                                         productActivityViewAction={this.props.productActivityViewAction}/> : null}
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 15
                        }}>{`${name}`}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 21, alignItems: 'center' }}>
                            <Text style={{ color: DesignRule.mainColor, fontSize: 18 }}>{`￥${price}起`}</Text>
                            <Text style={{
                                marginLeft: 5,
                                color: DesignRule.textColor_instruction,
                                fontSize: 10,
                                textDecorationLine: 'line-through'
                            }}>{`￥${originalPrice}`}</Text>
                            <View style={{
                                backgroundColor: DesignRule.mainColor,
                                marginLeft: 5,
                                borderRadius: 4, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 10, paddingHorizontal: 5, paddingVertical: 2
                                }}>{priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelName}价` : '原价'}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text
                                style={{
                                    color: DesignRule.textColor_instruction,
                                    fontSize: 11
                                }}>快递：{freight === 0 ? '包邮' : `${freight.toFixed(2)}元`}</Text>
                            <Text style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 11,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }}>{`月销售${monthSaleTotal}笔`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', marginTop: 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 13,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}>服务</Text>
                        <Text style={{
                            marginLeft: 11,
                            color: DesignRule.textColor_secondTitle,
                            fontSize: 12
                        }}>{`正品保证·急速发货 ${afterSaleServiceDays === 0 ? `无售后服务` : `${afterSaleServiceDays > 30 ? 30 : afterSaleServiceDays || ''}天无理由退换`}`}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
