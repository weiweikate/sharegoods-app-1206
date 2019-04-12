import React from "react";
import { View, StyleSheet, Image, TouchableWithoutFeedback, Alert } from "react-native";
import res from "./res";
import BasePage from "../../BasePage";
import { observer } from "mobx-react/native";
import ScreenUtils from "../../utils/ScreenUtils";
import DesignRule from "../../constants/DesignRule";
import { MRText as Text } from "../../components/ui";
import user from "../../model/user";
import { payment, paymentType, payStatus, payStatusMsg } from "./Payment";
import PasswordView from "./PayPasswordView";
import { PaymentResult } from "./PaymentResultPage";

const { px2dp } = ScreenUtils;
import Toast from "../../utils/bridge";
import { NavigationActions } from "react-navigation";
import RouterMap from "../../navigation/RouterMap";

@observer
export default class PaymentPage extends BasePage {

    $navigationBarOptions = {
        title: "订单支付",
        show: true
    };

    state = {
        showPwd: false,
        showPwdMsg: "",
        showResult: false,
        payResult: PaymentResult.none,
        payMsg: ""
    };

    constructor(props) {
        super(props);
        payment.amounts = this.params.amounts ? parseFloat(this.params.amounts) : 0.0;
        let orderProduct = this.params.orderProductList && this.params.orderProductList[0];
        payment.name = orderProduct && orderProduct.productName;
        payment.orderNo = this.params.orderNum;
        payment.platformOrderNo = this.params.platformOrderNo;
        payment.modeType = this.params.modeType ? this.params.modeType : 0;
        payment.bizType = this.params.bizType ? this.params.bizType : 0;
        payment.oneCoupon = this.params.oneCoupon ? this.params.oneCoupon : 0;
        user.updateUserData();
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    };

    goToPay = () => {
        const { bizType, modeType, platformOrderNo, amounts, oneCoupon } = payment;
        payment.checkOrderStatus(platformOrderNo, bizType, modeType, amounts).then(result => {
            if (result.code === payStatus.payNo) {
                if (payment.amounts <= 0) {
                    this._zeroPay();
                    return;
                }
                //是否选择余额
                const { selectedBalace } = payment;
                if (!selectedBalace && oneCoupon <= 0) {
                    this.$navigate("payment/ChannelPage");
                    return;
                }
                //用户设置过交易密码
                if (user.hadSalePassword) {
                    this.setState({ showPwd: true });
                } else {
                    this.$navigate("mine/account/JudgePhonePage", { title: "设置交易密码" });
                }
            } else if (result.code === payStatus.payNeedThrid) {
                this.$navigate("payment/ChannelPage", { remainMoney: Math.floor(result.unpaidAmount * 100) / 100 });
            } else if (result.code === payStatus.payOut) {
                Toast.$toast(payStatusMsg[result.code]);
                this._goToOrder(2);
            } else {
                Toast.$toast(payStatusMsg[result.code]);
            }
        }).catch(err => {
            Toast.$toast(err.msg);
        });
    };

    _zeroPay = () => {
        this._platformPay();
    };

    _selectedBalance() {
        payment.selectBalancePayment();
    }

    _platformPay(password) {
        let selectBance = payment.selectedBalace;
        let { availableBalance } = user;//去出用余额
        let channelAmount = parseFloat(payment.amounts); //需要支付的金额
        let { fundsTradingNo, oneCoupon, bizType } = payment;
        let detailList = [];

        if (channelAmount == 0.00){
            detailList.push({
                payType: paymentType.zeroPay,
                payAmount: channelAmount
            })
        }
        //拼店扩容 且 减去优惠券后
        if (bizType === 1 && oneCoupon > 0) {
            detailList.push({
                payType: paymentType.coupon,
                payAmount: oneCoupon
            });
            channelAmount = (channelAmount - oneCoupon * 1) > 0 ? (channelAmount - oneCoupon * 1) : 0;
        }
       //余额支付
        if (selectBance) {
            if (parseFloat(channelAmount)  > 0) {
                if (parseFloat(channelAmount)  > parseFloat(availableBalance) ) {
                    detailList.push({
                        payType: paymentType.balance,
                        payAmount: availableBalance
                    });
                } else {
                    detailList.push({
                        payType: paymentType.balance,
                        payAmount: channelAmount
                    });
                }
            }
        }


        payment.platformPay(password, fundsTradingNo, detailList).then((result) => {
            this.setState({ showPwd: false });
            if (parseInt(result.status) === payStatus.payNeedThrid) {
                payment.selectedBalace = false;
                this.$navigate("payment/ChannelPage", { remainMoney: (payment.amounts - channelAmount).toFixed(2) });
                return;
            }
            let replace;
            if (bizType === 1) {
                //如何为拼店扩容来的支付，支付结果跳转拼店扩容结果页
                replace = NavigationActions.replace({
                    key: this.props.navigation.state.key,
                    routeName: RouterMap.AddCapacitySuccessPage,
                    params: { payResult: PaymentResult.success }
                });
            } else {
                replace = NavigationActions.replace({
                    key: this.props.navigation.state.key,
                    routeName: "payment/PaymentResultPage",
                    params: { payResult: PaymentResult.success }
                });
            }
            this.props.navigation.dispatch(replace);
            payment.resetPayment();
        }).catch(err => {
            this.setState({ showPwdMsg: err.msg });
        });
    }

    _finishedAction(password) {
        this._platformPay(password);
    }

    _forgetPassword = () => {
        this.setState({ showPwd: false });
        this.$navigate("mine/account/JudgePhonePage", { title: "设置交易密码" });
    };

    _cancelPay = () => {
        this.setState({ showPwd: false });
        setTimeout(() => {
            Alert.alert(
                "确认要放弃付款？",
                "订单会超时关闭，请尽快支付",
                [
                    {
                        text: "确认离开", onPress: () => {
                            this.setState({ showPwd: false });
                            this._goToOrder();
                        }
                    },
                    {
                        text: "继续支付", onPress: () => {
                            this.setState({ showPwd: true });
                        }
                    }
                ],
                { cancelable: false }
            );
        }, 600);

    };

    _goToOrder(index) {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: "order/order/MyOrdersListPage",
            params: { index: index ? index : 1 }
        });
        this.props.navigation.dispatch(replace);
        payment.resetPayment();
    }

    _render() {
        const { selectedBalace, name, bizType, oneCoupon } = payment;
        const { showPwd } = this.state;
        let { availableBalance } = user;
        let channelAmount = (payment.amounts).toFixed(2);
        //有优惠券先减掉优惠券
        if (bizType === 1) {
            channelAmount = channelAmount - oneCoupon * 1 <= 0 ? 0 : channelAmount - oneCoupon * 1;
        }
        if (selectedBalace) {
            channelAmount = (channelAmount - availableBalance) <= 0 ? 0.00 : (channelAmount - availableBalance).toFixed(2);
        }

        //此处可能因为拼店扩容存在一元劵
        return <View style={styles.container}>
            <View style={[styles.content, payment.oneCoupon > 0 ? { height: px2dp(150) } : { height: px2dp(100) }]}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>订单名称：{name}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.row}>
                    <Text style={styles.text}>需支付金额：</Text>
                    <Text style={styles.money}>￥{payment.amounts}</Text>
                </View>
                <View style={styles.line}/>
                {
                    payment.oneCoupon > 0 ? <View style={styles.row}>
                        <Text style={styles.text}>一元劵抵扣：</Text>
                        <Text style={styles.money}>￥{payment.oneCoupon}</Text>
                    </View> : null
                }

            </View>
            <TouchableWithoutFeedback disabled={availableBalance <= 0}
                                      onPress={() => this._selectedBalance()}>
                <View style={styles.balanceContent}>
                    <Image style={styles.iconBalance} source={res.balance}/>
                    <Text style={styles.text}>现金账户</Text>
                    <View style={{ flex: 1 }}/>
                    <Text style={styles.name}>可用金额: {availableBalance}元</Text>
                    <Image style={styles.iconCheck} source={selectedBalace ? res.check : res.uncheck}/>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.needView}>
                <Text style={styles.need}>三方需付金额</Text>
                <Text style={styles.amount}>￥{channelAmount}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {
                this.goToPay();
            }}>
                <View style={styles.payBtn}>
                    <Text style={styles.payText}>去支付</Text>
                </View>
            </TouchableWithoutFeedback>
            {showPwd ? <PasswordView
                finishedAction={(pwd) => {
                    this._finishedAction(pwd);
                }}
                forgetAction={() => {
                    this._forgetPassword();
                }}
                dismiss={() => {
                    this._cancelPay();
                }}
                showPwdMsg={this.state.showPwdMsg}
            /> : null}
        </View>;
    }
}

const bgColor = "#f2f2f2";
const whiteBg = "#fff";
const buttonBg = "#FF0050";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor
    },
    content: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(150),
        backgroundColor: whiteBg,
        borderRadius: 5
    },
    balanceContent: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        height: px2dp(50),
        backgroundColor: whiteBg,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    row: {
        height: px2dp(50),
        flexDirection: "row",
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        alignItems: "center"
    },
    name: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13)
    },
    line: {
        height: ScreenUtils.onePixel,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    text: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(13)
    },
    money: {
        color: DesignRule.mainColor,
        fontSize: px2dp(13)
    },
    iconBalance: {
        width: px2dp(24),
        height: px2dp(24),
        marginRight: px2dp(10)
    },
    iconCheck: {
        marginLeft: px2dp(10),
        width: px2dp(20),
        height: px2dp(20)
    },
    need: {
        marginTop: px2dp(30),
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13)
    },
    amount: {
        marginTop: px2dp(10),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(30),
        fontWeight: "600"
    },
    needView: {
        flex: 1,
        alignItems: "center"
    },
    payBtn: {
        backgroundColor: buttonBg,
        marginBottom: ScreenUtils.safeBottom + 20,
        height: px2dp(44),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(22),
        alignItems: "center",
        justifyContent: "center"
    },
    payText: {
        color: whiteBg,
        fontSize: px2dp(17)
    }
});

