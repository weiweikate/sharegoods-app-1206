import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import BasePage from "../../BasePage";
import { payment, paymentTrack, payStatus } from "./Payment";
import DesignRule from "../../constants/DesignRule";
import ScreenUtils from "../../utils/ScreenUtils";
import res from './res'
import { track, trackEvent } from "../../utils/SensorsTrack";
import { PaymentResult } from "./PaymentResultPage";

const {px2dp} = ScreenUtils


export default class PaymentCheckPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            msg: " 支付返回结果等待中..."
        };
    }

    $navigationBarOptions = {
        title: '支付订单',
    };

    componentDidMount() {
        this.orderTime = (new Date().getTime()) / 1000;
        this._checkStatues();
    }

    _render() {
        return (
            <View style={{
                flex:1,
                backgroundColor:DesignRule.color_fff,
                marginTop:-2,
                backgroundColor:DesignRule.bgColor
            }}>
                <View
                style={{
                    alignItems:'center',
                    justifyContent:'center',
                    marginTop:px2dp(137)
                }}
                >
                    <Image
                    style={{
                        height:px2dp(72),
                        width:px2dp(72),
                    }}
                    source={res.pay_check_statue}
                    />
                    <Text style={{marginTop:px2dp(22),fontSize:px2dp(13),color:DesignRule.textColor_instruction}}>
                        支付返回结果等待中...
                    </Text>
                </View>
                <View
                style={{
                    marginTop:px2dp(150),
                    alignItems:'center',
                    justifyContent:'center'
                }}
                >
                    <Text style={{color:DesignRule.mainColor,fontSize:px2dp(13),}}>
                        温馨提示
                    </Text>
                    <Text style={{marginTop:px2dp(5),color:DesignRule.textColor_instruction,fontSize:px2dp(13)}}>
                        结果返回前，请不要重复支付
                    </Text>
                </View>
            </View>
        );
    }

    _checkStatues = () => {
        let time = (new Date().getTime()) / 1000;
        track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "checking" });
        if (time - this.orderTime > 60) {
            track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "checkOut" });
            this.$toastShow('支付结果请求超时');
            this._goToOrder(2);
            payment.resetPayment();
            return;
        }
        payment.checkPayStatus().then(result => {
            console.log(result);
            let  resultData = result.data;
            if (parseInt(resultData.status) === payStatus.paySuccess) {
                this.props.navigation.dispatch({
                    key: this.props.navigation.state.key,
                    type: "ReplacePayScreen",
                    routeName: "payment/PaymentResultPage",
                    params: { payResult: PaymentResult.success }
                });
                track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "success" });
                payment.resetPayment();

            }else if (parseInt(resultData.status) === payStatus.payClose){
                this.props.navigation.dispatch({
                    key: this.props.navigation.state.key,
                    type: "ReplacePayScreen",
                    routeName: "payment/PaymentResultPage",
                    params: { payResult: PaymentResult.fail ,payMsg:'支付关闭'}
                });
                payment.resetPayment();
            }else {
                setTimeout(()=>{
                    this._checkStatues();
                },1000)
            }
        }).catch(err => {


        });
    };
    _goToOrder(index) {
        this.props.navigation.dispatch({
            key: this.props.navigation.state.key,
            type: "ReplacePayScreen",
            routeName: "order/order/MyOrdersListPage",
            params: { index: index ? index : 1 }
        });
    }

}

const styles=StyleSheet.create({
    topBtnBgStyle:{

    },
    bottomTextBgStyle:{

    }
})
