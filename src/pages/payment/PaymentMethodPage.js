import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    AppState
} from 'react-native';
import BasePage from '../../BasePage';
import StringUtils from '../../utils/StringUtils';
import Toast from '../../utils/bridge';
import user from '../../model/user';
import { observer } from 'mobx-react/native';
import { Payment, paymentType } from './Payment';
import PaymentResultView, { PaymentResult } from './PaymentResultView';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import PasswordView from './PasswordView';
// import { NavigationActions } from 'react-navigation';
import PayCell from './PaymentCell'
import PayBottom from './PaymentBottom'
const { px2dp } = ScreenUtils

@observer
export default class PaymentMethodPage extends BasePage {

    $navigationBarOptions = {
        title: '支付方式',
        show: true // false则隐藏导航
    };

    constructor(props) {
        super(props);
        this.state = {
            isShowPaymentModal: false,
            password: '',
            //需要支付的金额
            shouldPayMoney: this.params.amounts ? this.params.amounts : 0,
            //订单支付的参数
            orderNum: this.params.orderNum ? this.params.orderNum : 0
        };
        this.payment = new Payment();
        if (parseFloat(this.state.shouldPayMoney).toFixed(2) === 0.00) {
            this.payment.selectedBalace = true;
        }
        this.payment.updateUserData()
        this.payment.orderNo = this.params.orderNum
    }

    $NavBarLeftPressed = () => {
        // const { paySuccessFul } = this.payment;
        // const popAction = NavigationActions.pop({
        //     n: paySuccessFul ? 2 : 1
        // });
        // this.props.navigation.dispatch(popAction);
        this.$navigateBack();
    };

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (state) => {
        console.log('_handleAppStateChange AppState', state);
        const { selectedTypes } = this.payment;
        if (state === 'active' && this.payment.orderNo && selectedTypes) {
            if ( selectedTypes.type === paymentType.alipay) {
                this.payment.alipayCheck({
                    orderNo: this.payment.orderNo
                }).then(checkStr => {
                    console.log('_handleAppStateChange', state, checkStr);
                    this._showPayresult(checkStr.resultStr);
                });
            } else {
                this.payment.wechatCheck({
                    orderNo: this.payment.orderNo
                }).then(checkStr => {
                    console.log('_handleAppStateChange', state, checkStr);
                    this._showPayresult(checkStr.resultStr);
                });
            }
        }
    };

    _selectedPayType(value) {
        if (this.payment.selectedBalace && this.payment.availableBalance > this.state.shouldPayMoney) {
            Toast.$toast('余额充足，不需要三方支付');
            return;
        }
        this.payment.selectPaymentType(value);
    }

    _selectedBalancePay() {
        if (this.payment.selectedTypes && this.payment.availableBalance > this.state.shouldPayMoney) {
            this.payment.clearPaymentType();
        }
        this.payment.selectBalancePayment();
    }

    finishedPwd(password) {
        this.setState({ isShowPaymentModal: false });
        setTimeout(() => {
            this.setState({ password: password, isShowPaymentModal: false });
            this.commitOrder();
        }, 100);
    }

    forgetTransactionPassword = () => {
        this.setState({ isShowPaymentModal: false });
        this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
    };

    async _balancePay() {
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }

            let result = await this.payment.balancePay(this.state.password, this.paymentResultView);
            this.setState({ password: '' });
            console.log('checkRes', result);
            this._showPayresult(result);
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
        }
    }

    _alipay() {
        this.payment.alipay(this.paymentResultView);
    }

    _wechat() {
        this.payment.appWXPay(this.paymentResultView);
    }

    async _mixingPay() {
        let selectedTypes = this.payment.selectedTypes;
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }
            this.setState({password: ''})
            if (selectedTypes.type === paymentType.alipay) {
                this.payment.ailpayAndBalance(this.state.password, this.paymentResultView)
            }
            if (selectedTypes.type === paymentType.wechat) {
                this.payment.wechatAndBalance(this.state.password, this.paymentResultView)
            }
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
        }
    }

    _showPayresult(result) {
        if (parseInt(result.code, 0) === 10000) {
            this.paymentResultView.show(PaymentResult.sucess);
        } else {
            this.paymentResultView.show(PaymentResult.fail, result.msg);
        }
    }

    commitOrder = () => {
        const { selectedBalace, selectedTypes } = this.payment;
        if (selectedTypes && selectedTypes.type === paymentType.bank) {
            Toast.$toast('银行卡支付，暂不支持');
            return;
        }

        if (selectedBalace && selectedTypes) {
            this._mixingPay();
            return;
        }

        if (selectedBalace) {
            this._balancePay();
            return;
        }

        if (!selectedTypes) {
            Toast.$toast('请选择支付方式');
            return;
        }

        if (selectedTypes.type === paymentType.alipay) {
            this._alipay();
            return;
        }

        if (selectedTypes.type === paymentType.wechat) {
            this._wechat();
            return;
        }
    };

    _render() {
        const { paymentList, availableBalance, balancePayment, selectedBalace, selectedTypes } = this.payment;
        let items = [];
        paymentList.map((value, index) => {
            if (value.type === paymentType.section) {
                items.push(<View style={styles.section}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>{value.name}</Text>
                </View>);
            } else {
                items.push(<PayCell disabled={value.type !== paymentType.balance && parseFloat(this.state.shouldPayMoney).toFixed(2) === 0.00}
                                    key={index + ''} selectedTypes={selectedTypes} data={value}
                                    balance={availableBalance} press={() => this._selectedPayType(value)}/>);
            }
        });

        return <View style={styles.container}>
        <ScrollView style={styles.container}>
            <PayCell
                disabled={this.params.outTradeNo}
                data={balancePayment}
                isSelected={selectedBalace || parseFloat(this.state.shouldPayMoney).toFixed(2) === 0.00} balance={availableBalance}
                press={() => this._selectedBalancePay(balancePayment)}
            />
            {items}
        </ScrollView>
            <PayBottom onPress={() => this.commitOrder()} shouldPayMoney={this.state.shouldPayMoney}/>
            <PasswordView
                forgetAction={() => this.forgetTransactionPassword()}
                closeAction={() => this.setState({ isShowPaymentModal: false })}
                visible={this.state.isShowPaymentModal}
                finishedAction={(password) => this.finishedPwd(password)}
            />
            <PaymentResultView
                ref={(ref) => {
                    this.paymentResultView = ref;
                }}
                navigation={this.props.navigation}
                payment={this.payment}
            />
        </View>;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    section: {
        backgroundColor: DesignRule.bgColor,
        height: px2dp(39),
        justifyContent: 'center'
    },
    sectionTitle: {
        fontSize: px2dp(13),
        color: DesignRule.textColor_instruction,
        marginLeft: px2dp(15)
    }
});

