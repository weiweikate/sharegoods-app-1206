import { Component } from 'react';
import shopCartStore from '../../../shopCart/model/ShopCartStore';
import { View } from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import { MRText as Text } from '../../../../components/ui';
import React from 'react';
import { observer } from 'mobx-react';


@observer
export default class ShopCartRedNumView extends Component {

    render() {
        if (shopCartStore.getAllGoodsClassNumber === 0) {
            return null;
        }
        return (
            <View style={{
                position: 'absolute', height: 16, minWidth: 16,
                paddingHorizontal: 4,
                backgroundColor: DesignRule.mainColor,
                borderRadius: 8, justifyContent: 'center', alignItems: 'center'
            }}>
                <Text style={{ color: 'white', fontSize: 10 }}
                      allowFontScaling={false}>{shopCartStore.getAllGoodsClassNumber > 99 ? 99 : shopCartStore.getAllGoodsClassNumber}</Text>
            </View>);
    }
}
