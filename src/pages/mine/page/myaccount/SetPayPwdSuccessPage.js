/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/3/18.
 *
 */

'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res'
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';
const {
    button:{
        tongyon_icon_check_green
    }
} = res;
const { autoSizeWidth } = ScreenUtils;
const titleString = '密码设置成功';
const tipString = '为了确保您的账户安全，交易支付密码需要保密';


export default class SetPayPwdSuccessPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '设置交易密码',
        show: true// false则隐藏导航
    };


    componentDidMount() {

    }

    $NavigationBarDefaultLeftPressed = (callBack) => {
        this.$navigateBack(-4);
    };

    onPress = () => {
        this.$navigateBack(-4);
    }
    _render() {
        const {bgViewStyle, imageStyle, titleStyle, tipStyle} = styles;
        return (
            <View style={DesignRule.style_container}>
                <View style={bgViewStyle}>
                    <Image source={tongyon_icon_check_green} style={imageStyle}/>
                    <MRText style={titleStyle}>{titleString}</MRText>
                    <MRText style={tipStyle}>{tipString}</MRText>
                </View>
                <TouchableOpacity onPress={this.onPress} style={[DesignRule.style_bigRedRadiusBtn, {marginHorizontal: 30, marginTop: autoSizeWidth(50)}]}>
                    <MRText style={DesignRule.style_btnWhiteText}>确定</MRText>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgViewStyle: {
        height: autoSizeWidth(290),
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 10,
    },
    imageStyle: {
        height: autoSizeWidth(70),
        width: autoSizeWidth(70),
        marginTop: autoSizeWidth(70)
    },
    titleStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_48,
        marginTop: autoSizeWidth(30)
    },
    tipStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle_28,
        marginTop: autoSizeWidth(30)
    }
});
