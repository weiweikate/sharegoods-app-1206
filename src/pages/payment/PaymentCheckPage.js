import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";
import BasePage from "../../BasePage";
import { Payment } from "./Payment";
import DesignRule from "../../constants/DesignRule";
import ScreenUtils from "../../utils/ScreenUtils";

const {px2dp} = ScreenUtils


export default class PaymentCheckPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            msg: "清点击上方按钮检测支付结果"
        };

    }

    _render() {
        return (
            <View>

                <TouchableOpacity onPress={() => {
                    this._checkStatues();
                }}>
                    <View style={{
                        height:px2dp(50),
                        width:ScreenUtils.width,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:DesignRule.mainColor
                    }}>
                        <Text style={{
                            color:DesignRule.color_fff
                        }}>
                            检测状态
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={{
                    marginTop:px2dp(50),
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <Text>
                        {this.state.msg}
                    </Text>
                </View>
            </View>

        );
    }

    _checkStatues = () => {
        Payment.checkPayStatus().then(result => {

        }).catch(err => {

        });
    };

}

const styles=StyleSheet.create({
    topBtnBgStyle:{

    },
    bottomTextBgStyle:{

    }
})
