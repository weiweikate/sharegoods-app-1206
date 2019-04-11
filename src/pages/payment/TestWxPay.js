import React, { Component } from "react";
import BasePage from "../../BasePage";
import {
    View,
    TextInput,
    TouchableOpacity

} from "react-native";
import ScreenUtils from "../../utils/ScreenUtils";
import { MRText } from "../../components/ui";
import DesignRule from "../../constants/DesignRule";

export default class TestWxPay extends BasePage {

    constructor(props){
        super(props)
    }


    _render() {

        return (
            <View style={{
                flex: 1

            }}>
                <TextInput
                    allowFontScaling={false}
                    style={{width:ScreenUtils.width - 50,height:50}}
                    value={this.registModel.phoneNumber}
                    onChangeText={text => {
                        this.registModel.savePhoneNumber(text);
                    }}
                    placeholder='请输入手机号'
                    keyboardType='numeric'
                    maxLength={11}
                    placeholderTextColor={DesignRule.textColor_placeholder}
                />
                <TouchableOpacit onPress={
                    () => {
                        this._beginPay()
                    }
                }>

                </TouchableOpacit>


            </View>

        );
    }

    _beginPay = (paramsJson) => {
        console.log("开始支付");
    };

}
