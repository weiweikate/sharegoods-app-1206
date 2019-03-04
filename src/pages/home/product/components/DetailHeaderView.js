import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ProductActivityView from './ProductActivityView';
import user from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';
import DetailBanner from './DetailBanner';
import RES from '../../../../comm/res';
import StringUtils from '../../../../utils/StringUtils';
import { MRText as Text } from '../../../../components/ui';
import DetailHeaderScoreView from './DetailHeaderScoreView';
import NoMoreClick from '../../../../components/ui/NoMoreClick';

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
        this.ProductActivityView && this.ProductActivityView.saveActivityViewData(activityData, activityType, callBack);
    }

    render() {
        const { activityType, data, navigation, messageCount, promotionViewAction, serviceAction } = this.props;
        //priceType 3会员价  2拼店价
        const {
            freight, monthSaleCount, originalPrice, priceType,
            minPrice, maxPrice, groupPrice, name, secondName, restrictions, productStatus, promoteInfoVOList
        } = this.props.data || {};

        let priceSuper = minPrice !== maxPrice ? `￥${StringUtils.isNoEmpty(minPrice) ? minPrice : ''}-￥${StringUtils.isNoEmpty(maxPrice) ? maxPrice : ''}` : `￥${StringUtils.isNoEmpty(minPrice) ? minPrice : ''}`;
        return (
            <View>
                <DetailBanner data={this.props.data} navigation={this.props.navigation}/>
                {/*有活动&&商品不是未开售*/}
                {(activityType === 1 || activityType === 2) && productStatus !== 3 ?
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
                        }} numberOfLines={2} allowFontScaling={false}>{`${name || ''}`}</Text>
                        {StringUtils.isNoEmpty(secondName) ? <Text style={{
                            marginTop: 5, color: DesignRule.textColor_secondTitle,
                            fontSize: 13
                        }} allowFontScaling={false}>{secondName}</Text> : null}
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
                                        }}
                                              allowFontScaling={false}>{priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelRemark}价` : 'V1价'}</Text>
                                    </View>
                                    <Text style={{
                                        color: DesignRule.textColor_redWarn,
                                        fontSize: 19,
                                        marginLeft: 5
                                    }} allowFontScaling={false}>{priceSuper}</Text>
                                    {/*原价下对齐*/}
                                    <View style={{ justifyContent: 'flex-end', height: 16 }}>
                                        {priceType !== 2 && priceType !== 3 ? null : <Text style={{
                                            marginLeft: 5,
                                            color: DesignRule.textColor_instruction,
                                            fontSize: 10,
                                            textDecorationLine: 'line-through'
                                        }}>{`￥${originalPrice}`}</Text>}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            color: DesignRule.textColor_instruction,
                                            fontSize: 12
                                        }} allowFontScaling={false}>快递：{freight === 0 ? '包邮' : `${freight}元`}</Text>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 12,
                                        marginLeft: ScreenUtils.autoSizeWidth(67)
                                    }} allowFontScaling={false}>{`月销: ${monthSaleCount}`}</Text>
                                </View>
                            </View>
                            <View style={{ width: 62, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 1, backgroundColor: DesignRule.color_f2, height: 42 }}/>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                                  onPress={this.props.goShopAction}>
                                    <Text style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize: 10
                                    }} allowFontScaling={false}>拼店价</Text>
                                    <Text style={{
                                        marginTop: 4,
                                        color: DesignRule.textColor_redWarn,
                                        fontSize: 10
                                    }} allowFontScaling={false}>{`￥${groupPrice || ''}`}</Text>
                                </TouchableOpacity>
                                <Image source={arrow_right}/>
                            </View>
                        </View>
                    </View>
                </View>
                {this._renderPromotionView(promoteInfoVOList, promotionViewAction)}
                <NoMoreClick style={styles.serviceView} onPress={serviceAction}>
                    <Text style={styles.serviceNameText}>服务</Text>
                    <Text style={styles.serviceValueText} numberOfLines={1}>
                        {`质量保障·48小时发货${(restrictions & 4) === 4 ? `·7天退换` : ``}${(restrictions & 8) === 8 ? `·节假日发货` : ``}`}
                    </Text>
                    <Image source={arrow_right}/>
                </NoMoreClick>
                <DetailHeaderScoreView pData={data} navigation={navigation} messageCount={messageCount}/>
            </View>
        );
    }

    _renderPromotionView = (promoteInfoVOList, promotionViewAction) => {
        if (promoteInfoVOList && promoteInfoVOList.length > 0) {
            return (
                <NoMoreClick style={styles.promotionView} onPress={promotionViewAction}>
                    <View style={styles.promotionItemsView}>
                        {
                            promoteInfoVOList.map((item, index) => {
                                //8：经验翻倍 9：券兑换
                                const { type, message } = item;
                                let typeText;
                                if (type === 8) {
                                    typeText = '经验翻倍';
                                } else if (type === 9) {
                                    typeText = '券兑换';
                                }
                                if (index > 1) {
                                    return null;
                                }
                                return <View style={[styles.promotionItemView, { marginTop: index === 0 ? 10 : 0 }]}>
                                    <Text style={styles.promotionItemNameText}>{index === 0 ? '促销' : ''}</Text>
                                    {typeText ?
                                        <View
                                            style={[styles.promotionItemRedView, { marginLeft: index === 0 ? 13 : 39 }]}>
                                            <Text
                                                style={[styles.promotionItemRedText]}>{typeText}</Text>
                                        </View>
                                        :
                                        null
                                    }
                                    <Text
                                        style={[styles.promotionItemText]}
                                        numberOfLines={1}>{message || ''}</Text>
                                </View>;
                            })
                        }
                    </View>
                    <Image source={arrow_right}/>
                </NoMoreClick>
            );
        }
        return null;
    };
}

const styles = StyleSheet.create({
    promotionView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 10,
        backgroundColor: 'white'
    },
    promotionItemsView: {
        flex: 1
    },
    promotionItemView: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 10
    },

    promotionItemNameText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    promotionItemRedView: {
        borderRadius: 3, borderWidth: 1, borderColor: DesignRule.mainColor
    },
    promotionItemRedText: {
        paddingHorizontal: 4, paddingVertical: 2,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },
    promotionItemText: {
        marginLeft: 10, flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },

    /**服务**/
    serviceView: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10, paddingHorizontal: 15,
        backgroundColor: 'white', height: 40
    },
    serviceNameText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    serviceValueText: {
        flex: 1, marginLeft: 15,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    }

});
