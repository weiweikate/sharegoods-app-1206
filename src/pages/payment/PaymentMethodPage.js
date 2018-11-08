import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AppState,TouchableWithoutFeedback } from 'react-native';
import BasePage from '../../BasePage';
import { UIText } from '../../components/ui';
import StringUtils from '../../utils/StringUtils';
import { color } from '../../constants/Theme';
import selectedImg from '../../comm/res/selected_circle_red.png';
import Toast from '../../utils/bridge';
import user from '../../model/user';
import { observer } from 'mobx-react/native';
import unselectedImg from '../../comm/res/unselected_circle.png';
import { Payment, paymentType } from './Payment';
import PayUtil from './PayUtil';
import PaymentResultView, { PaymentResult } from './PaymentResultView';
import ScreenUtils from '../../utils/ScreenUtils';
import spellStatusModel from '../spellShop/model/SpellStatusModel';
import DesignRule from 'DesignRule';
import CommModal from 'CommModal';
import paySuccessIcon from '../../comm/res/tongyon_icon_check_green.png';
import PasswordView from './PasswordView'

const PayCell = ({ data, isSelected, balance, press, selectedTypes, disabled }) => {
    let selected = isSelected;
    if (data.type !== paymentType.balance && selectedTypes) {
        selected = selectedTypes.type === data.type;
    }
    return <TouchableOpacity style={styles.cell} disabled={disabled} onPress={() => press && press()}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
                }}>可用余额: {balance ? balance : 0}</Text>
                :
                null
        }
        <Image source={selected ? selectedImg : unselectedImg} style={{ height: 22, width: 22 }}
               resizeMode={'stretch'}/>
    </TouchableOpacity>;
};

const Section = ({ data }) => <View style={{
    backgroundColor: color.page_background,
    height: 39,
    justifyContent: 'center'
}}>
    <Text style={{
        fontSize: 13
        , color: '#999999', marginLeft: 15
    }}>{data.name}</Text>
</View>;

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
            orderNum: this.params.orderNum ? this.params.orderNum : 0,
            payPromotionSuccess: false
        };
        this.payment = new Payment();
        this.payment.payStore = this.params.payStore;
        this.payment.payPromotion = this.params.payPromotion;
        if (this.state.shouldPayMoney === 0) {
            this.payment.selectedBalace = true;
        }
        if (this.params.outTradeNo) {
            this.payment.outTradeNo = this.params.outTradeNo;
            this.payment.continueToPay({ outTradeNo: this.params.outTradeNo }).then(data => {
                this.setState({ shouldPayMoney: data.data.amounts });
            });
        } else {
            this.payment.outTradeNo = '';
        }
        user.updateUserData().then(data => {
            this.payment.availableBalance = data.availableBalance;
        });
        console.log('shouldPayMoney', this.state.shouldPayMoney);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (state) => {
        console.log('_handleAppStateChange AppState', state);
        const { selectedTypes } = this.payment;
        let paytype = 1
        if (this.payment.payStore) {
            paytype = 2
        }
        if (this.payment.payPromotion) {
            paytype = 3
        }
        if (state === 'active' && this.payment.outTradeNo) {
            if (selectedTypes.type === paymentType.alipay) {
                this.payment.alipayCheck({
                    outTradeNo: this.payment.outTradeNo,
                    type: paymentType.alipay,
                    payType: paytype
                }).then(checkStr => {
                    console.log('_handleAppStateChange', state, checkStr);
                    this._showPayresult(checkStr.resultStr);
                    AppState.removeEventListener('change', this._handleAppStateChange);
                });
            } else {
                this.payment.wechatCheck({
                    outTradeNo: this.payment.outTradeNo,
                    type: 2,
                    payType: paytype
                }).then(checkStr => {
                    console.log('_handleAppStateChange', state, checkStr);
                    this._showPayresult(checkStr.resultStr);
                    AppState.removeEventListener('change', this._handleAppStateChange);
                });
            }
        }
    };

    _selectedPayType(value) {
        this.payment.selectPaymentType(value);
    }

    _selectedBalancePay() {
        this.payment.selectBalancePayment();
    }

    _render() {
        const { paymentList, availableBalance, balancePayment, selectedBalace, selectedTypes } = this.payment;
        let items = [];
        paymentList.map((value, index) => {
            if (value.type === paymentType.section) {
                items.push(<Section key={index + ''} data={value}/>);
            } else {
                items.push(<PayCell disabled={value.type !== paymentType.balance && this.state.shouldPayMoney === 0}
                                    key={index + ''} selectedTypes={selectedTypes} data={value}
                                    balance={availableBalance} press={() => this._selectedPayType(value)}/>);
            }
        });

        return <View style={styles.container}><ScrollView style={styles.container}>
            <PayCell disabled={this.params.outTradeNo} data={balancePayment}
                     isSelected={selectedBalace || this.state.shouldPayMoney === 0} balance={availableBalance}
                     press={() => this._selectedBalancePay(balancePayment)}/>
            {items}
        </ScrollView>
            {this.renderBottomOrder()}
            {this.renderPaymentModal()}
            {this.renderPayResult()}
            {this.renderPromotion()}
        </View>;
    }

    renderPromotion=()=>{
        return (
            <CommModal ref={(ref)=>{this.promotionModal = ref;}} visible={this.state.payPromotionSuccess}>
                <View style={styles.promotionBgStyle}>
                    <Image source={paySuccessIcon} style={{width:70,height:70,marginTop:20}}/>
                    <Text style={{color:DesignRule.textColor_secondTitle,fontSize:DesignRule.fontSize_mediumBtnText,includeFontPadding:false,marginTop:10}}>
                        支付成功
                    </Text>
                    <Text style={{color:DesignRule.textColor_secondTitle,fontSize:DesignRule.fontSize_22,includeFontPadding:false,marginTop:15,textAlign:'center'}}>
                        {`系统会在明天0点进行站内推广\n每成功获取一个下级将收到站内消息推送`}
                    </Text>
                    <View style={{width:200,marginHorizontal:24,justifyContent:'center',flexDirection:'row',marginTop:20}}>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.setState({payPromotionSuccess:false})
                            this.$navigateBack('mine/promotion/UserPromotionPage',{reload:true})
                        }}>
                            <View style={{borderRadius:5,borderColor:'#D51243',borderWidth:1,justifyContent:'center',alignItems:'center',width:93,height:30}}>
                                <Text style={{color:'#D51243',fontSize:DesignRule.fontSize_24,includeFontPadding:false}}>
                                    我的推广
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </CommModal>
        )
    }


    renderPayResult() {
        return <PaymentResultView ref={(ref) => {
            this.paymentResultView = ref;
        }} navigation={this.props.navigation}/>;
    }

    finishedPwd(password) {
        const { payStore, payPromotion } = this.payment
        this.setState({ isShowPaymentModal: false });
        setTimeout(() => {
            if (payStore) {
                this.payment.payStoreActoin().then(result => {
                    if (result.sdkCode === 0) {
                        //刷新拼店状态
                        spellStatusModel.storeStatus = 2;
                        spellStatusModel.getUser(2);
                        this.$navigate('spellShop/shopSetting/SetShopNamePage');
                    } else {
                        Toast.$toast('支付失败');
                    }
                });
            }else if(payPromotion){
                this.payment.payPromotionWithId(password,this.params.packageId, this.paymentResultView).then(result => {
                    if (result.sdkCode === 0) {
                        // //刷新拼店状态
                        // spellStatusModel.storeStatus = 2;
                        // spellStatusModel.getUser(2);
                        // this.$navigate('spellShop/shopSetting/SetShopNamePage');
                        this.setState({
                            payPromotionSuccess:true
                        });
                        this.promotionModal && this.promotionModal.open();
                    } else {
                        this.paymentResultView.show(2, result.message)
                    }
                });
            }else {
                this.setState({ password: password, isShowPaymentModal: false });
                this.commitOrder();
            }
        }, 100);
    }

    //支付方式弹窗
    renderPaymentModal = () => {
        return <PasswordView
            forgetAction={() => this.forgetTransactionPassword()}
            closeAction={()=> this.setState({isShowPaymentModal: false})}
            visible={this.state.isShowPaymentModal}
            finishedAction={(password)=> this.finishedPwd(password)}
            />
    };
    renderBottomOrder = () => {
        return (
            <View style={{ paddingBottom: ScreenUtils.safeBottom }}>
                <View style={{ height: ScreenUtils.onePixel, backgroundColor: color.line }}/>
                <View style={{ height: ScreenUtils.px2dp(49), flexDirection: 'row' }}>
                    <View style={styles.bottomStyleContainer}>
                        <UIText value={'合计：'} style={styles.bottomUiText}/>
                        <UIText value={`${this.state.shouldPayMoney || 0}元`}
                                style={styles.bottomUitext1}/>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.commitOrder()}>
                        <UIText value={'去支付'}
                                style={{ fontSize: 16, color: '#ffffff' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    forgetTransactionPassword = () => {
        this.setState({ isShowPaymentModal: false });
        this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: true });
    };

    async _balancePay() {
        const { params } = this.getApiRequestParams();
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }

            let result = await this.payment.balancePay(params, this.paymentResultView);
            this.setState({ password: '' });
            console.log('checkRes', result);
            this._showPayresult(result);
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
        }
    }

    _alipay() {
        const { params } = this.getApiRequestParams();
        this.payment.alipay(params, this.paymentResultView);
    }

    _wechat() {
        const { params } = this.getApiRequestParams();
        this.payment.appWXPay(params, this.paymentResultView);
    }

    async _mixingPay() {
        const { params } = this.getApiRequestParams();
        let selectedTypes = this.payment.selectedTypes;
        params.type = 1 + this.payment.selectedTypes.type;
        let otherAmounts = this.payment.availableBalance - params.amounts;
        if (otherAmounts > 0) {
            params.balance = params.amounts;
            params.amounts = 0;
        } else {
            params.balance = this.payment.availableBalance;
            params.amounts = (params.amounts - this.payment.availableBalance).toFixed(2);
        }
        if (user.hadSalePassword) {
            if (StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }
            let result = await this.payment.perpay(params);
            if (result && result.code !== 10000) {
                Toast.hiddenLoading()
                this.paymentResultView && this.paymentResultView.show(2, result.msg)
                return
            }

            user.updateUserData();
            console.log('result', result);
            this.setState({ 'password': '' });
            if (params.amounts === 0 && parseInt(result.code, 0) === 10000) {
                this._showPayresult(result);
                return;
            }
            this.payment.outTradeNo = result.data.outTradeNo;
            if (selectedTypes.type === paymentType.alipay) {
                const prePayStr = result.data.prePayStr;
                console.log('prePayStr', prePayStr);
                const resultStr = await PayUtil.appAliPay(prePayStr);
                console.log('resultStr', resultStr);
                // const checkStr = await this.payment.alipayCheck({outTradeNo:result.data.outTradeNo , type:paymentType.alipay})
                if (resultStr.sdkCode !== 9000) {
                    this.paymentResultView && this.paymentResultView.show(PaymentResult.fail, resultStr.msg);
                }
                return;
            }

            if (selectedTypes.type === paymentType.wechat) {
                const prePayStr = result.data.prePayStr;
                const prePay = JSON.parse(prePayStr);
                const resultStr = await PayUtil.appWXPay(prePay);
                console.log('resultStr', resultStr);
                // const checkStr = await this.payment.wechatCheck({outTradeNo:result.data.outTradeNo , type:2})
                if (resultStr.code !== 0) {
                    this.paymentResultView && this.paymentResultView.show(PaymentResult.fail, resultStr.msg);
                }
                return;
            }
        }
        else {
            this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
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
        const { selectedBalace, selectedTypes, payStore, payPromotion } = this.payment;
        if (selectedTypes && selectedTypes.type === paymentType.bank) {
            Toast.$toast('银行卡支付，暂不支持');
            return;
        }

        if (payStore) {
            if (selectedBalace) {
                if (user.hadSalePassword) {
                    if (StringUtils.isEmpty(this.state.password)) {
                        this.setState({ isShowPaymentModal: true });
                        return;
                    }
                    this.setState({ password: '' });
                }
                else {
                    this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
                }
                return;
            }
            this.payment.payStoreActoin().then(result => {
                if (result.sdkCode === 0) {
                    //刷新拼店状态
                    spellStatusModel.storeStatus = 2;
                    spellStatusModel.getUser(2);
                    this.$navigate('spellShop/shopSetting/SetShopNamePage');
                    Toast.$toast('支付成功');
                } else {
                    Toast.$toast('支付失败');
                }
            });
            return;
        }

        if (payPromotion) {
            if (selectedBalace) {
                if (user.hadSalePassword) {
                    if (StringUtils.isEmpty(this.state.password)) {
                        this.setState({ isShowPaymentModal: true });
                        return;
                    }
                    this.setState({ password: '' });
                }
                else {
                    this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
                }
                return;
            }

            this.payment.payPromotionWithId(this.state.password , this.params.packageId, this.paymentResultView).then(result => {
                if (result.sdkCode === 0) {
                    //刷新拼店状态
                    this.setState({
                        payPromotionSuccess: true
                    });
                } else {
                    // Toast.$toast('支付失败');
                    this.paymentResultView.show(2, result.message)
                }
            });
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
    //需要在当前选择的支付方式能完成支付的情况下，才保证调用该方法返回的数据有效性
    getApiRequestParams = () => {
        //对应的leftShouldPayMoney后端也会计算
        let params = {
            amounts: parseFloat(this.state.shouldPayMoney).toFixed(2),//N:第三方金额	number
            orderNum: this.state.orderNum,//N:订单号	string
            salePsw: this.state.password//Y:交易密码	string
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
        fontSize: 16, color: '#ffffff'
    }, blackText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#000000'
    }, grayText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#999999'
    },
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1
    },
    bottomStyleContainer: {
        width: 264,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottomUiText: {
        fontSize: 15,
        color: '#222222',
        marginRight: 12,
        marginLeft: 12
    },
    bottomUitext1: {
        fontSize: 15,
        color: color.red,
        marginRight: 12
    },
    cell: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: ScreenUtils.px2dp(44),
        paddingLeft: 21,
        paddingRight: 28,
        backgroundColor: color.white,
        marginTop: 10
    },
    promotionBgStyle: {
        height: 230,
        width: 250,
        borderRadius: 5,
        backgroundColor: DesignRule.white,
        alignItems: 'center'
    }
});

