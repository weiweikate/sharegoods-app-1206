import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
    UIText
} from '../../../components/ui';
import { color } from '../../../constants/Theme';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';

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
        <TouchableOpacity style={{ flexDirection: 'row', height: 100, alignItems: 'center' ,width:ScreenUtils.width,backgroundColor:DesignRule.white}} onPress={() => onPress()}>
            <View style={{ height: 80, width: 80, marginLeft: 15 }}>
                <Image style={{ height: 80, width: 80 }} source={{ uri: uri }}/>
            </View>
            <View style={{ justifyContent: 'space-between',  height: 80 ,flex:1}}>
                <View style={{height:30,justifyContent:'center'}}>
                    <Text style={{
                        flexWrap: 'wrap',
                        color: color.black_222,
                        fontSize: 13,
                        marginLeft: 10,
                        marginRight: 20
                    }} numberOfLines={2}>{goodsName}</Text>
                </View>
                <View style={{ marginTop: 5 ,marginLeft:10}}>
                    <UIText value={`规格: ${category}`} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
                <View style={{
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection:'row',
                     justifyContent:'space-between'
                }}>

                        <UIText value={salePrice} style={{ color: '#D51243', fontSize: 13 }}/>

                       <UIText value={goodsNum} style={{ color: color.black_999, fontSize: 13 }}/>

                </View>
            </View>
        </TouchableOpacity>
    );
};


export default GoodsItem;
