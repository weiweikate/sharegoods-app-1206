import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
    UIText
} from '../../../components/ui';
import { color } from '../../../constants/Theme';

const GoodsItem = props => {
    const {
        uri = '',
        goodsName = '',
        salePrice = '',
        // originalPrice='',
        category = '',
        goodsNum = '',
        onPress
    } = props;

    return (
        <TouchableOpacity style={{ flexDirection: 'row', height: 100 }} onPress={() => onPress()}>
            <View style={{ height: 80, width: 80, marginLeft: 15, marginTop: 11 }}>
                <Image style={{ height: 80, width: 80 }} source={{ uri: uri }}/>
            </View>
            <View style={{ flex: 1, marginTop: 11 }}>
                <View style={{ height: 31, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        color: color.black_222,
                        fontSize: 13,
                        marginLeft: 10,
                        marginRight: 20
                    }} numberOfLines={2}>{goodsName}</Text>
                    <View style={{ marginRight: 14 }}>
                        <UIText value={salePrice} style={{ color: color.black_999, fontSize: 13 }}/>
                    </View>
                </View>
                <View style={{
                    height: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}>
                    <UIText value={category} style={{ color: color.black_999, fontSize: 13 }}/>
                    <UIText value={goodsNum} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default GoodsItem;
