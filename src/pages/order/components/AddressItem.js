import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
    UIImage,
    UIText
} from '../../../components/ui';
import connectStyle from '../../../components/ui/connectStyle';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
const locationBlack = res.dizhi;
const arrow_right = res.arrow_right;

const AddressItem = props => {
    this.defaultPress = () => {
    };
    const {
        name = '收货人：赵信',
        phone = '18254569878',
        address = '收货地址：浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502',
        isRightArrow = true,
        onPress = this.defaultPress,
        style = {
            flexDirection: 'row',
            height: 84,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white'
        }
    } = props;
    this.renderRightImage = () => {
        return (isRightArrow ?
                <UIImage source={arrow_right} style={{ width: 10, height: 14, marginLeft: 17, marginRight: 17 }}/> :
                <UIText value={''}/>
        );
    };
    return (
        <TouchableOpacity style={style} onPress={() => onPress()}>
            <UIImage source={locationBlack} style={{ width: 15, height: 20, marginLeft: 17 }}/>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', paddingRight: 20}}>
                    <UIText value={name}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 15, flex: 1, marginRight: 5 }}
                            numberOfLines={1}/>
                    <UIText value={phone} style={{ color: DesignRule.textColor_instruction, fontSize: 15 }}
                            numberOfLines={1}/>
                </View>
                <UIText value={address} style={{ color: DesignRule.textColor_instruction, fontSize: 15 }}
                        numberOfLines={2}/>
            </View>
            {/*{this.renderRightImage()}*/}
        </TouchableOpacity>
    );
};

const style = {
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }

};

export default connectStyle('AddressItem', style)(AddressItem);
