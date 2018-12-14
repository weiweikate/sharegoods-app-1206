import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    AppState,
    ActivityIndicator
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

    state = {
        isShowPaymentModal: false,
        password: '',
        orderChecking: false
    }

    constructor(props) {
        super(props);
        this.payment = new Payment();
        if (parseFloat(this.params.amounts).toFixed(2) === '0.00') {
            this.payment.selectedBalace = true;
        }
        this.payment.isGoToPay = false
        this.payment.amounts = this.params.amounts ? this.params.amounts : 0
        this.payment.orderNo = this.params.orderNum
        this.payment.updateUserData()
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
        if (this.state.orderChecking === true) {
            return
        }
        if (state === 'active' && this.payment.orderNo && selectedTypes && this.payment.isGoToPay === true) {
            this.setState({orderChecking: true})
            this.orderTime = (new Date().getTime()) / 1000
            this.payment.isGoToPay = false
            this._checkOrder()
        }
    }

    _checkOrder() {
        let time = (new Date().getTime()) / 1000
        console.log('checkorder', this.orderTime, time)
        if (time - this.orderTime > 10) {
            // if (this.payment.selectedTypes.type === paymentType.wechat) { 
            //     this.payment.closeOrder()
            // }
            return
        }
        this.payment.checkPayStatus().then(data => {
            if (data === 1) {
                setTimeout(() => {
                    this._checkOrder()
                }, 1000)
                return
            }
            this.setState({orderChecking: false})
            if (data === 3){
                this.paymentResultView.show(1)
            }
        }).catch(()=> {
            this.setState({orderChecking: false})
        })
    }

    _selectedPayType(value) {
        // console.log('_selectedPayType', this.payment.availableBalance, this.payment.amounts)
        if (this.payment.selectedBalace && this.payment.availableBalance * 100 > this.payment.amounts * 100) {
            Toast.$toast('余额充足，不需要三方支付');
            return;
        }
        this.payment.selectPaymentType(value);
    }

    _selectedBalancePay() {
        if (this.payment.selectedTypes &&  this.payment.availableBalance * 100 > this.payment.amounts * 100) {
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
            if (selectedTypes.type === paymentType.alipay) {
                this.payment.ailpayAndBalance(this.state.password, this.paymentResultView)
            }
            if (selectedTypes.type === paymentType.wechat) {
                this.payment.wechatAndBalance(this.state.password, this.paymentResultView)
            }
            this.setState({password: ''})
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
                items.push(<PayCell disabled={value.type !== paymentType.balance && parseFloat(this.payment.amounts).toFixed(2) === '0.00'}
                                    key={index + ''} selectedTypes={selectedTypes} data={value}
                                    balance={availableBalance} press={() => this._selectedPayType(value)}/>);
            }
        });

        return <View style={styles.container}>
        <ScrollView style={styles.container}>
            <PayCell
                disabled={this.params.outTradeNo}
                data={balancePayment}
                isSelected={selectedBalace || parseFloat(this.payment.amounts).toFixed(2) === '0.00'} balance={availableBalance}
                press={() => this._selectedBalancePay(balancePayment)}
            />
            {items}
        </ScrollView>
            <PayBottom onPress={() => this.commitOrder()} shouldPayMoney={this.payment.amounts}/>
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
            {
                this.state.orderChecking
                ?
                <View style={styles.loadingView}>
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#fff'/>
                        <View style={styles.loadingSpace}/>
                        <Text style={styles.loadingText}>支付结果等待中...</Text>
                    </View>
                </View>
                :
                null
            }
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
    },
    loadingView: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(140),
        height: px2dp(140),
        borderRadius: px2dp(10),
    },
    loadingText: {
        color: '#fff',
        fontSize: px2dp(13)
    },
    loadingSpace: {
        height: px2dp(27)
    }
});

