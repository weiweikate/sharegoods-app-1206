import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    StyleSheet
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from 'DesignRule';
import res from '../res';
import ImageLoad from '@mr/image-placeholder'
const {right_arrow} = res;
import {
    MRText as Text
} from '../../../components/ui';

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
            height: 48, backgroundColor: 'white'
        },
        rightText_hasCircle: {
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 30,
            height: 30,
            width: 30,
            alignItems: 'center',
            borderColor: DesignRule.lineColor_inColorBg,
            marginRight: 15
        },
        rightText_noCircle: {
            justifyContent: 'center', alignItems: 'center', marginRight: 15
        }
    });

    this.renderLine = () => {
        return (!isLine ? null :
                <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };

    this.renderRightText = () => {
        return (
            <View
                style={circleStyle ? circleStyle : (isCircle ? styles.rightText_hasCircle : styles.rightText_noCircle)}>
                <Text style={rightTextStyle && rightTextStyle} allowFontScaling={false}>{rightText}</Text>
            </View>
        );
    };
    this.renderheadImage = () => {
        return (
            headImage === '' ? null :
                <ImageLoad source={{ uri: StringUtils.isNoEmpty(headImage) ? headImage : '' }}
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
        <TouchableOpacity style={[styles.containerStyle, itemHeightStyle]} onPress={onPress}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', marginLeft: marginLeft }}>
                    <Text style={leftTextStyle && leftTextStyle} allowFontScaling={false}>{leftText}</Text>
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
