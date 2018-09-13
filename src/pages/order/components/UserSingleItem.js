
import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import right_arrow from '../res/arrow_right.png';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';

const UserSingleItem = props => {

    const {
        itemHeightStyle,
        isArrow = true,
        isLine = true,
        isCircle = false,
        circleStyle,
        leftText,
        leftTextStyle,
        rightText,
        rightTextStyle,
        headImage = '',
        onPress = () => {

        },
        marginLeft = 15
    } = props;
    const styles = StyleSheet.create({
        containerStyle: {
            height: 48, backgroundColor: color.white
        },
        rightText_hasCircle: {
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 30,
            height: 30,
            width: 30,
            alignItems: 'center',
            borderColor: color.gray_df,
            marginRight: 15
        },
        rightText_noCircle: {
            justifyContent: 'center', alignItems: 'center', marginRight: 15
        }
    });

    this.renderLine = () => {
        return (!isLine ? null :
                <View style={{ height: 1, backgroundColor: color.gray_EEE }}/>
        );
    };

    this.renderRightText = () => {
        return (
            <View
                style={circleStyle ? circleStyle : (isCircle ? styles.rightText_hasCircle : styles.rightText_noCircle)}>
                <Text style={rightTextStyle && rightTextStyle}>{rightText}</Text>
            </View>
        );
    };
    this.renderheadImage = () => {
        return (
            headImage === '' ? null :
                <Image source={{ uri: StringUtils.isNoEmpty(headImage) ? headImage : '' }}
                       style={{ width: 30, height: 30, borderRadius: 15 }}/>
        );
    };
    this.renderArrow = () => {
        return (!isArrow ? null :
                <View style={{ justifyContent: 'center', marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    {this.renderheadImage()}
                    <Image source={right_arrow} style={{ width: 8, height: 15 }}/>
                </View>
        );
    };

    return (
        <TouchableOpacity style={itemHeightStyle ? itemHeightStyle : styles.containerStyle} onPress={onPress}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', marginLeft: marginLeft }}>
                    <Text style={leftTextStyle && leftTextStyle}>{leftText}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderRightText()}
                    {this.renderArrow()}
                </View>
            </View>
            {this.renderLine()}
        </TouchableOpacity>
    );

};

export default UserSingleItem;
