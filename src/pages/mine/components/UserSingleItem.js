/**

 * @appType crm_app
 * @Description:个人中心常用的ItemUI控件
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    StyleSheet
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
// import ImageLoad from '@mr/image-placeholder';
import { MRText as Text ,AvatarImage} from '../../../components/ui';

export default class UserSingleItem extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {
            itemHeightStyle,
            leftText,
            leftTextStyle,
            onPress = () => {

            },
            marginLeft = 15
        } = this.props;
        return (
            <TouchableOpacity style={itemHeightStyle ? itemHeightStyle : styles.containerStyle} onPress={onPress}>
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
    }

    renderLine = () => {
        const { isLine = true } = this.props;
        return (!isLine ? null :
                <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };

    renderRightText = () => {
        const { circleStyle, isCircle = false, rightTextStyle, rightText, isArrow = true } = this.props;
        return (
            <View
                style={[circleStyle ? circleStyle : (isCircle ? styles.rightText_hasCircle : styles.rightText_noCircle), { marginRight: isArrow ? 6 : 15 }]}>
                <Text style={rightTextStyle && rightTextStyle}
                      allowFontScaling={false}>{rightText}</Text>
            </View>
        );
    };
    renderheadImage = () => {
        const { headImage, isArrow = true } = this.props;
        return (
            !headImage ? null :
                <AvatarImage source={{ uri: StringUtils.isNoEmpty(headImage) ? headImage : '' }}
                           style={{ width: 30, height: 30, borderRadius: 15, marginRight: isArrow ? 8 : 15 }}
                           borderRadius={15}/>
        );
    };
    renderArrow = () => {
        const { isArrow = true } = this.props;
        return (!isArrow ? null :
                <View style={{ justifyContent: 'center', marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    {this.renderheadImage()}
                    <Image source={res.button.arrow_right}/>
                </View>
        );
    };

}
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
        borderColor: DesignRule.lineColor_inColorBg
    },
    rightText_noCircle: {
        justifyContent: 'flex-end', alignItems: 'center'
    }
});

