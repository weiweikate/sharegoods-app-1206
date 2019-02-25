import React from "react";
import { StyleSheet, Image, TouchableOpacity, View, Text } from "react-native";
import BasePage from "../../../BasePage";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import res from "../res";
import RouterMap from "../../../navigation/RouterMap";
import Toast from "../../../utils/bridge";
import OrderApi from "../api/orderApi";

const successImg = res.button.tongyon_icon_check_green;
const { px2dp } = ScreenUtils;

export default class ConfirmReceiveGoodsPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: "",
        show: true// false则隐藏导航
    };

    _render() {
        return (
            <View style={{ flex: 1, marginTop: px2dp(79), alignItems: "center" }}>
                <View style={{ alignItems: "center" }}>
                    <Image source={successImg} style={{ width: px2dp(60), height: px2dp(60) }}/>
                    <Text style={styles.firstTextStyle}>交易成功</Text>
                    <Text style={styles.secTextStyle}>去晒一晒本次的购物体验吧～</Text>
                </View>
                <View style={styles.selectStyle}>
                    <TouchableOpacity style={[styles.toucStyle, { marginRight: 10 }]}
                                      onPress={this.goToHomePage}>
                        <Text style={{ fontSize: px2dp(15), color: DesignRule.textColor_secondTitle }}>返回首页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.toucStyle, { marginLeft: 10 }]}
                                      onPress={this.showOrderPage}>
                        <Text style={{ fontSize: px2dp(15), color: DesignRule.textColor_secondTitle }}>立即晒单</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    goToHomePage = () => {
        this.$navigateBackToHome();

    };
    showOrderPage = () => {
        OrderApi.checkInfo({warehouseOrderNo:this.params.orderNo}).then(res => {
            if(res.data){
                this.$navigate(RouterMap.P_ScorePublishPage, {
                    orderNo: this.params.orderNo
                });
            }else{
                Toast.$toast('该商品已晒过单！');
            }
        }).catch(e =>{
            Toast.$toast(e.msg);
        })
    };
    $NavBarLeftPressed = () => {
        this.$navigateBack();
        this.params.callBack && this.params.callBack();
    };
}
const styles = StyleSheet.create({
    firstTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(20),
        fontWeight: "bold",
        marginTop: px2dp(10)
    },
    secTextStyle: { color: DesignRule.textColor_instruction, fontSize: px2dp(13), marginTop: px2dp(10) },
    toucStyle: {
        borderRadius: px2dp(24), borderColor: DesignRule.lineColor_inWhiteBg, borderWidth: 1,
        width: px2dp(110), height: px2dp(40), alignItems: "center", justifyContent: "center", flex: 1
    },
    selectStyle : {
        marginLeft: px2dp(58),
        marginRight: px2dp(58),
        marginTop: px2dp(40),
        flexDirection: "row",
        alignItems: "center"
    }
});
