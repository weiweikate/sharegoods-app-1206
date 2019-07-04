import { View, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder';

const { px2dp } = ScreenUtils;
const cell_width = (ScreenUtils.width - px2dp(35)) / 2;

export default class ShopCartEmptyCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { itemData, onClick } = this.props;
        return (
            <View style={{
                width: cell_width,
                borderRadius: px2dp(5),
                height: itemData.height,
                backgroundColor: DesignRule.color_fff,
                marginTop: px2dp(5),
                overflow: 'hidden'
            }}>
                <TouchableOpacity onPress={() => {
                    onClick();
                }}>
                    <ImageLoad
                        source={{ uri: itemData.imgUrl }}
                        style={{
                            width: cell_width,
                            height: itemData.imageHeight,
                        }}
                        showPlaceholder={false}
                    />
                    <MRText numberOfLines={2}
                            style={{
                                fontSize: px2dp(13),
                                color: DesignRule.textColor_mainTitle,
                                marginTop: px2dp(5),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                height: px2dp(45)
                            }}>
                        {itemData.name}
                    </MRText>
                    <View style={{ flexDirection: 'row', marginTop: px2dp(3) }}>
                        {this.createTipView([])}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: px2dp(10) }}>
                        <View style={{ flex: 1 }}>
                            <MRText style={{ color: 'rgba(255, 0, 80, 1)', fontSize: px2dp(12) }}>
                                {`￥${itemData.promotionMinPrice?itemData.promotionMinPrice:itemData.minPrice}`}
                            </MRText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    createTipView = (tipArr = ['秒杀', '直降aaa']) => {
        let tipViewArr = [];
        tipViewArr = tipArr.map((itemStr, index) => {
            return (
                <View style={{
                    backgroundColor: 'rgba(255, 0, 80, 0.2)',
                    paddingLeft: px2dp(1),
                    paddingRight: px2dp(1),
                    marginLeft: px2dp(3),
                    height: px2dp(14),
                    borderRadius: px2dp(2),
                    justifyContent: 'center'
                }}>
                    <MRText style={{ color: 'rgba(255, 0, 80, 1)', fontSize: px2dp(10) }}>
                        {itemStr}
                    </MRText>
                </View>
            );
        });
        return tipViewArr;
    };
}
