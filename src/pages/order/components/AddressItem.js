import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
    UIImage,
    UIText
} from '../../../components/ui';
import connectStyle from '../../../components/ui/connectStyle';
import { color } from '../../../constants/Theme';
import locationBlack from '../res/locationBlack.png';
import arrow_right from '../res/arrow_right.png';

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
            backgroundColor: color.white
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
            <UIImage source={locationBlack} style={{ width: 18, height: 20, marginLeft: 17 }}/>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <UIText value={name} style={{ color: color.black_999, fontSize: 15 }}/>
                    <UIText value={phone} style={{ color: color.black_999, fontSize: 15 }}/>
                </View>
                <UIText value={address} style={{ color: color.black_999, fontSize: 15}}
                        numberOfLines={2}
                />
            </View>
            {this.renderRightImage()}
        </TouchableOpacity>
    );
};

const style = {
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white
    }

};

export default connectStyle('AddressItem', style)(AddressItem);
