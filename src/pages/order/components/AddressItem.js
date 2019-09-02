import React from 'react';
import { View, TouchableOpacity, Clipboard, NativeModules } from 'react-native';
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
        let { name = '',
            phone = '',
            address = ''} =props;
        Clipboard.setString(name +'；手机号：'+ phone + '；收件人地址:'+address);
        NativeModules.commModule.toast('已复制地址');
    };
    const {
        name = '',
        phone = '',
        address = '',
        isRightArrow = true,
        onPress = this.defaultPress,
        style = {
            flexDirection: 'row',
            minHeight: 84,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white'
        }
    } = props;
    this.renderRightImage = () => {
        return (isRightArrow ?
                <UIImage resizeMode={'contain'} source={arrow_right} style={{ height: 12, marginLeft: 17, marginRight: 17 }}/> :
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
                        numberOfLines={0}/>
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
