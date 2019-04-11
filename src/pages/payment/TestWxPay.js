import React from "react";
import BasePage from "../../BasePage";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text
} from "react-native";
import ScreenUtils from "../../utils/ScreenUtils";
import DesignRule from "../../constants/DesignRule";
import Toast from "../../utils/bridge";
import PayUtil from "./PayUtil";

export default class TestWxPay extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            jsonValue: ""
        };
    }

    $navigationBarOptions={
        title: 'wx支付测试工具',
        leftNavItemHidden: true
    }

    _render() {
        return (
            <View style={{
                flex: 1
            }}>
                <View style={{
                    backgroundColor: "#fff",
                    height: 120,
                    width: ScreenUtils.width,

                    alignItems: "center",
                    justifyContent: "center"

                }}>
                    <TextInput
                        allowFontScaling={false}
                        style={{ width: ScreenUtils.width - 50, height: 100 }}
                        value={this.state.jsonValue}
                        onChangeText={text => {
                            this.setState({
                                jsonValue: text
                            });
                        }}
                        multiline={true}
                        placeholder='请输入微信支付json'
                        placeholderTextColor={DesignRule.textColor_placeholder}
                    />
                </View>

                <TouchableOpacity onPress={() => {this._beginPay()}}>
                    <View style={{ alignItems: "center", justifyContent: "center",marginTop:30,width:ScreenUtils.width - 100,marginLeft:50,height:50 ,
                    borderRadius:25,backgroundColor:DesignRule.mainColor}}>
                        <Text style={{fontSize:20,color:'#fff'}}>开始请求</Text>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }

    _beginPay = (paramsJson) => {

        if (this.state.jsonValue.length > 0){
            console.log("开始支付");
            try {
                Toast.showLoading();
                const payInfo = JSON.parse(this.state.jsonValue);
                Toast.hiddenLoading();
                payInfo.partnerid = payInfo.mchId;
                payInfo.timestamp = payInfo.timeStamp;
                payInfo.prepayid = payInfo.prepayId;
                payInfo.sign = payInfo.paySign;
                payInfo.noncestr = payInfo.nonceStr;
                payInfo.appid = payInfo.appId;
                const resultStr = PayUtil.appWXPay(payInfo);
                console.log(JSON.stringify(resultStr));
                // if (parseInt(resultStr.code, 0) !== 0) {
                //     throw new Error(resultStr.msg);
                // }
                return resultStr;

            } catch (error) {
                Toast.hiddenLoading();
                Toast.$toast(error.msg)
            }
        } else {
            Toast.$toast('请输入json字符串')
        }

    };

}
