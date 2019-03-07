import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import res from './res'
import BasePage from '../../BasePage';
import { observer } from 'mobx-react/native';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';
import user from '../../model/user';
import { payment, payStatus, payStatusMsg } from './Payment'
import PasswordView from './PayPasswordView'
import PaymentResultView, { PaymentResult } from './PaymentResultView';
const { px2dp } = ScreenUtils;
import Toast from '../../utils/bridge'

@observer
export default class PaymentPage extends BasePage {

    $navigationBarOptions = {
        title: '订单支付',
        show: true
    };

    state = {
        showPwd: false
    }

    constructor(props) {
        super(props);
        payment.amounts = this.params.amounts ? this.params.amounts : 0
        let orderProduct = this.params.orderProductList && this.params.orderProductList[0];
        payment.name = orderProduct && orderProduct.productName
        payment.orderNo = this.params.orderNum;
        payment.platformOrderNo = this.params.platformOrderNo;
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    }

    goToPay() {
        const {selectedBalace} = payment
        if (!selectedBalace) {
            this.$navigate('payment/ChannelPage')
            return
        }

        //用户设置过交易密码
        if (user.hadSalePassword) {
            payment.checkOrderStatus().then(result => {
                if (result.data === payStatus.payNo) {
                    this.setState({ showPwd: true })
                } else {
                    Toast.$toast(payStatusMsg[result.data])
                }
            }).catch(err => {
                console.log('checkOrderStatus page err', err)
                Toast.$toast(err.msg)
            })
        }  else {
            this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
        }
    }

    _selectedBalance() {
        payment.selectBalancePayment()
    }

    _finishedAction(password) {
        payment.platformPay(password).then((result) => {
            this.setState({ showPwd: false })
            this.paymentResultView.show(PaymentResult.sucess)
        }).catch(err => {
            this.setState({ showPwd: false })
            this.paymentResultView.show(PaymentResult.fail, err.msg)
        })
    }

    _forgetPassword = () => {
        this.setState({ showPwd: false })
        this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
    };

    _render() {
        const { selectedBalace, name } = payment
        const { showPwd } = this.state
        return <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>订单名称：{name}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.row}>
                    <Text style={styles.text}>需支付金额：</Text>
                    <Text style={styles.money}>￥{payment.amounts}</Text>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={()=> this._selectedBalance()}>
            <View style={styles.balanceContent}>
                <Image style={styles.iconBalance} source={res.balance}/>
                <Text style={styles.text}>现金账户</Text>
                <View style={{flex: 1}}/>
                <Text style={styles.name}>可用金额: {user.availableBalance}元</Text>
                <Image style={styles.iconCheck} source={selectedBalace ? res.check : res.uncheck}/>
            </View>
            </TouchableWithoutFeedback>
            <View style={styles.needView}>
            <Text style={styles.need}>需付金额</Text>
            <Text style={styles.amount}>￥{payment.amounts}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {this.goToPay()}}>
            <View style={styles.payBtn}>
                <Text style={styles.payText}>去支付</Text>
            </View>
            </TouchableWithoutFeedback>
            {showPwd ? <PasswordView
                finishedAction={(pwd)=> {this._finishedAction(pwd)}}
                forgetAction={()=>{this._forgetPassword()}}
                dismiss={()=>{this.setState({showPwd: false})}}
            /> : null}
            <PaymentResultView
                ref={(ref) => {
                    this.paymentResultView = ref;
                }}
                navigation={this.props.navigation}
                payment={this.payment}
                repay={() => this._repay()}
            />
        </View>;
    }
}

const bgColor = '#f2f2f2'
const whiteBg = '#fff'
const buttonBg = '#FF0050'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor
    },
    content: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(100),
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
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        height: px2dp(50),
        flexDirection: 'row',
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        alignItems: 'center'
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
        fontWeight: '600'
    },
    needView: {
        flex: 1,
        alignItems: 'center'
    },
    payBtn: {
        backgroundColor: buttonBg,
        marginBottom: ScreenUtils.safeBottom + 20,
        height: px2dp(44),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(22),
        alignItems: 'center',
        justifyContent: 'center'
    },
    payText: {
        color: whiteBg,
        fontSize: px2dp(17)
    }
});

