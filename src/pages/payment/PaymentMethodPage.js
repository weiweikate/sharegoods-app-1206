import React from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import BasePage from '../../BasePage';
import { UIText } from '../../components/ui';
import StringUtils from '../../utils/StringUtils';
import { color } from '../../constants/Theme';
import selectedImg from './res/selected.png';
import Toast from '../../utils/bridge';
import InputTransactionPasswordModal from './InputTransactionPasswordModal';
import user from '../../model/user';
import { observer } from 'mobx-react/native';
import { NavigationActions } from 'react-navigation';
import unselectedImg from './res/unselected.png'
import { Payment, paymentType } from './Payment'
import PayUtil from './PayUtil'

const PayCell = ({data, isSelected, balance, press, selectedTypes, disabled}) => {
    let selected = isSelected
    if (data.type !== paymentType.balance && selectedTypes) {
        selected = selectedTypes.type === data.type
    }
    return <TouchableOpacity style={styles.cell} disabled={disabled} onPress={()=>press && press()}>
        <View style={{ flexDirection: 'row', alignItems: 'center' ,flex:1}}>
            <Image source={data.icon} style={{ height: 33 }} resizeMode={'contain'}/>
            <Text style={[styles.blackText, { marginLeft: 5 }]}>{data.name}</Text>
        </View>
        {
            data.hasBalance
            ?
            <Text style={{
                    marginLeft: 5,
                    marginRight: 7,
                    color: '#999999',
                    fontSize: 13
                }}>可用余额: {balance}</Text>
            :
            null
        }
        <Image source={selected ? selectedImg : unselectedImg} style={{ height: 22, width: 22 }} resizeMode={'stretch'}/>
    </TouchableOpacity>
}

const Section = ({data}) => <View style={{
    backgroundColor: color.page_background,
    height: 39,
    justifyContent: 'center'
}}>
    <Text style={{
        fontFamily: 'PingFang-SC-Medium', fontSize: 13
        , color: '#999999', marginLeft: 15
    }}>{data.name}</Text>
</View>

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
            /*
            * 用于支付页面的相关数据展示与页面控制,这里展示最大子集(可拓展)，并不需要全部传完
            * */
            paymentPageParams: {
                //0:订单 1:拼店 and etc (页面来源,默认值为1拼店)
                pageType: this.params.openShopPay ? 1 : 0,
                //需要支付的金额
                shouldPayMoney: this.params.amounts ? this.params.amounts : 0,
                //example:2表示两个代币兑换1个余额
                //-1表示该参数未初始化,不能完成支付 todo 做支付拦截
                tokenCoinToBalance: this.params.tokenCoinToBalance ? this.params.tokenCoinToBalance : -1,
                //订单支付的参数
                orderPayParams: {
                    //订单编号
                    orderNum: this.params.orderNum ? this.params.orderNum : 0
                    // //订单 0:快递订单 1:自提订单
                    // orderType:this.params.orderType?this.params.orderType:0,
                }
            }
        };
        this.payment = new Payment()
        this.payment.payStore = this.params.payStore
    }
    _selectedPayType(value) {
        this.payment.selectPaymentType(value)
    }

    _selectedBalancePay() {
        this.payment.selectBalancePayment()
    }

    _render() {
        const { paymentList,  availableBalance, balancePayment, selectedBalace, selectedTypes} = this.payment
        let items = []
        paymentList.map((value, index) => {
            if (value.type === paymentType.section) {
                items.push(<Section key={index + ''} data={value}/>)
            } else {
                items.push(<PayCell disabled={value.type !== paymentType.balance && this.state.paymentPageParams.shouldPayMoney  === 0} key={index + ''}  selectedTypes={selectedTypes} data={value} balance={availableBalance} press={()=>this._selectedPayType(value)}/>)
            }
        })

        return  <View  style={styles.container}><ScrollView style={styles.container}>
            <PayCell data={balancePayment} isSelected={selectedBalace || this.state.paymentPageParams.shouldPayMoney  === 0} balance={availableBalance} press={()=>this._selectedBalancePay(balancePayment)}/>
            {items}
        </ScrollView>
        {this.renderBottomOrder()}
        {this.renderPaymentModal()}
        </View>
    }
    //支付方式弹窗
    renderPaymentModal = () => {
        const {  payStore } = this.payment
        
        return (
            <InputTransactionPasswordModal
                isShow={this.state.isShowPaymentModal}
                detail={{ title: '平台支付密码', context: '请输入平台的支付密码' }}
                closeWindow={() => {
                    this.setState({ isShowPaymentModal: false });
                }}
                passwordInputError={this.state.isShowPaymentModal}
                bottomText={'忘记支付密码'}
                inputText={(text) => {
                    if (text.length === 6) {
                        this.setState({isShowPaymentModal: false})
                        setTimeout(() => {
                            if (payStore) {
                                this.payment.payStoreActoin().then(result => {
                                    if (result.sdkCode === 0) {
                                        this.$navigate('spellShop/shopSetting/SetShopNamePage');
                                    } else {
                                        Toast.$toast('支付失败')
                                    }
                                })
                            } else {
                                this.setState({ password: text, isShowPaymentModal: false });
                                this.commitOrder();
                            }
                        }, 100);
                    }
                }}
                forgetPassword={() => this.forgetTransactionPassword()}
            />
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };
    renderBottomOrder = () => {
        return (
            <View>
                {this.renderLine()}
                <View style={{ height: 49, flexDirection: 'row' }}>
                    <View style={styles.bottomStyleContainer}>
                        <UIText value={'合计：'} style={styles.bottomUiText}/>
                        <UIText value={`${this.state.paymentPageParams.shouldPayMoney || 0}元`}
                                style={styles.bottomUitext1}/>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.commitOrder()}>
                        <UIText value={'去支付'}
                                style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    forgetTransactionPassword = () => {
        this.setState({ isShowPaymentModal: false });
        this.navigate('mine/transactionPassword/SettingTransactionPasswordStep2Page');
    };
    async _balancePay() {
        const { params } = this.getApiRequestParams();
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }
            let result = await this.payment.balancePay(params)
            this.setState({password: ''})
            console.log('checkRes', result)
            this._showPayresult(result)
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
        }
    }
    async _alipay() {
        const { params } = this.getApiRequestParams()
        const {resultStr, preStr} = await this.payment.alipay(params)
        if (resultStr.code === 0) {
            let checkResult = await this.payment.checkPayStatus({outTradeNo: preStr.data.outTradeNo})
            this._showPayresult(checkResult)
        } else {
            Toast.$toast('支付失败')
        }
    }
    async _wechat() {
        const { params } = this.getApiRequestParams()
        const {resultStr, preStr} = await this.payment.appWXPay(params)
        if (resultStr.sdkCode === 0) {
            let checkResult = await this.payment.checkPayStatus({outTradeNo: preStr.data.outTradeNo})
            this._showPayresult(checkResult)
        } else {
            Toast.$toast('支付失败')
        }
    }
    async _mixingPay() {
        const { params } = this.getApiRequestParams();
        let selectedTypes = this.payment.selectedTypes
        params.type = 1 + this.payment.selectedTypes.type
        let otherAmounts = this.payment.availableBalance - params.amounts
        if (otherAmounts > 0) {
            params.balance = params.amounts
            params.amounts = 0
        } else {
            params.balance = this.payment.availableBalance
            params.amounts = params.amounts - this.payment.availableBalance
        }
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }
            let result = await this.payment.perpay(params)
            console.log('result', result)
            if (params.amounts === 0 && parseInt(result.code, 0) === 10000) {
                this._showPayresult(result)
                return
            }
            if (selectedTypes.type === paymentType.alipay) {
                const prePayStr = result.data.prePayStr
                const resultStr = await PayUtil.appAliPay(prePayStr)
                console.log('resultStr', resultStr)
                return
            }

            if (selectedTypes.type === paymentType.wechat) {
                const prePayStr = result.data.prePayStr
                const resultStr = await PayUtil.appAliPay(prePayStr)
                console.log('resultStr', resultStr)
                return
            }
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
        }
    }
    _showPayresult(result) {
        if ( parseInt(result.code, 0) === 10000) {
            Alert.alert('支付提示','支付成功', [
                {
                    text: '返回首页', onPress: () => {
                        let resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                            ]
                        });
                        this.props.navigation.dispatch(resetAction);
                    }
                },
                {
                    text: '回到订单', onPress: () => {
                        this.props.navigation.navigate('order/order/MyOrdersListPage',{index:0})
                    }
                }
            ], { cancelable: true });
        }
    }
    commitOrder = () => {
        const { selectedBalace, selectedTypes, payStore } = this.payment
        if (selectedTypes && selectedTypes.type === paymentType.bank) {
            Toast.$toast('银行卡支付，暂不支持')
            return
        }

        if (payStore) {
            if (selectedBalace) {
                if (user.hadSalePassword) {
                    if (StringUtils.isEmpty(this.state.password)) {
                        this.setState({ isShowPaymentModal: true });
                        return;
                    }
                    this.setState({password: ''})
                }
                else {
                    this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
                }
                return
            }
             this.payment.payStoreActoin().then(result => {
                if (result.sdkCode === 0) {
                    this.$navigate('spellShop/shopSetting/SetShopNamePage');
                } else {
                    Toast.$toast('支付失败')
                }
            })
            return
        }

        if (selectedBalace && selectedTypes) {
            this._mixingPay()
            return
        }

        if (selectedBalace) {
            this._balancePay()
            return
        }

        if (!selectedTypes) {
            Toast.$toast('请选择支付方式')
            return
        }

        if (selectedTypes.type === paymentType.alipay) {
            this._alipay()
            return
        }

        if (selectedTypes.type === paymentType.wechat) {
            this._wechat()
            return
        }
    };
    //需要在当前选择的支付方式能完成支付的情况下，才保证调用该方法返回的数据有效性
    getApiRequestParams = () => {
        //对应的leftShouldPayMoney后端也会计算
        let params = {
            amounts: this.state.paymentPageParams.shouldPayMoney,//N:第三方金额	number
            orderNum: this.state.paymentPageParams.orderPayParams.orderNum,//N:订单号	string
            salePsw: this.state.password,//Y:交易密码	string
            // type: type//N:支付方式	number 1:纯平台  2：微信小程序   4：微信app   8：支付宝   16：银联卡
        };
        return { params };
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    selectText: {
        fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff'
    }, blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#000000'
    }, grayText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#999999'
    },
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1
    },
    pcontainer: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginLeft: Platform.OS == 'ios' ? 22 : 40,
        marginRight: Platform.OS == 'ios' ? 22 : 40,
        marginBottom: 22
    },
    inputItem: {
        height: 35,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8
    },
    bottomStyleContainer: {
        width: 264,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottomUiText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#222222',
        marginRight: 12,
        marginLeft: 12
    },
    bottomUitext1: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: color.red,
        marginRight: 12
    },
    cell: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 44,
        paddingLeft: 21,
        paddingRight: 28,
        backgroundColor: color.white,
        marginTop: 10
    }
});

