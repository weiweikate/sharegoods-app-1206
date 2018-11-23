import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ProductActivityView from './ProductActivityView';
import user from '../../../../model/user';
import DesignRule from 'DesignRule';
import DetailBanner from './DetailBanner';
import RES from '../../../../comm/res';

const arrow_right = RES.button.arrow_right_black;
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
        const {
            freight = 0, monthSaleTotal = 0, originalPrice = '', product = {}, priceType = '',
            minPrice, maxPrice, groupPrice
        } = this.props.data || {};
        const { name = '', afterSaleServiceDays } = product;
        let priceSuper = minPrice !== maxPrice ? `￥${minPrice || ''}-￥${maxPrice || ''}` : `￥${minPrice || ''}`;
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
                    <View style={{ marginLeft: 15, width: ScreenUtils.width - 30 }}>
                        <Text style={{
                            marginTop: 10,
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 13
                        }} numberOfLines={2}>{`${name}`}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 15, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignItems: 'center', height: 26, flexDirection: 'row' }}>
                                    <View style={{
                                        borderColor: DesignRule.textColor_redWarn,
                                        borderWidth: 1,
                                        borderRadius: 2, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            color: DesignRule.textColor_redWarn,
                                            fontSize: 10, paddingHorizontal: 6, paddingVertical: 2
                                        }}>{priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelName}价` : '原价'}</Text>
                                    </View>
                                    <Text style={{
                                        color: DesignRule.textColor_redWarn,
                                        fontSize: 19,
                                        marginLeft: 5
                                    }}>{priceSuper}</Text>
                                    {priceType !== 2 && priceType !== 3 ? null : <Text style={{
                                        marginLeft: 5,
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 10,
                                        textDecorationLine: 'line-through'
                                    }}>{`￥${originalPrice}`}</Text>}

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            color: DesignRule.textColor_instruction,
                                            fontSize: 12
                                        }}>快递：{freight === 0 ? '包邮' : `${freight}元`}</Text>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 12,
                                        marginLeft: ScreenUtils.autoSizeWidth(67)
                                    }}>{`月销: ${monthSaleTotal}`}</Text>
                                </View>
                            </View>
                            <View style={{ width: 62, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 1, backgroundColor: DesignRule.color_f2, height: 42 }}/>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                                  onPress={() => {
                                                      this.props.navigation.popToTop();
                                                      this.props.navigation.navigate('MyShop_RecruitPage');
                                                  }}>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 10
                                    }}>拼店价</Text>
                                    <Text style={{
                                        marginTop: 4,
                                        color: DesignRule.textColor_redWarn,
                                        fontSize: 10
                                    }}>{`￥${groupPrice || ''}`}</Text>
                                </TouchableOpacity>
                                <Image source={arrow_right}/>
                            </View>
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
