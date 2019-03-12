import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    AppState,
    ActivityIndicator
} from 'react-native';
import res from './res'
import BasePage from '../../BasePage';
import { observer } from 'mobx-react/native';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';
import { payment, paymentType, paymentTrack, payStatus, payStatusMsg } from './Payment'
import PaymentResultView, { PaymentResult } from './PaymentResultView'
import { track, trackEvent } from '../../utils/SensorsTrack'
const { px2dp } = ScreenUtils;
import Toast from '../../utils/bridge'
import { NavigationActions } from 'react-navigation';

@observer
export default class ChannelPage extends BasePage {

    $navigationBarOptions = {
        title: '订单支付',
        show: true
    }

    state = {
        orderChecking: false,
        showResult: false,
        payResult: PaymentResult.none,
        payMsg: ''
    }

    constructor(props) {
        super(props)
        this.remainMoney = this.params.remainMoney
        let orderProduct = this.params.orderProductList && this.params.orderProductList[0];
        let name = orderProduct && orderProduct.productName
        if (name) {
            payment.name = name
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    }

    goToPay() {

        if (payment.selctedPayType === paymentType.none) {
            Toast.$toast('请选择支付方式')
            return
        }

        payment.checkOrderStatus().then(result => {
            console.log('checkOrderStatus', result)
            if (result.code === payStatus.payNo) {
                if (payment.selctedPayType === paymentType.alipay) {
                    payment.alipay().catch(err => {
                         Toast.$toast(err.message)
                         payment.resetPayment()
                         this._goToOrder()
                    })
                }
                
                if (payment.selctedPayType === paymentType.wechat){
                    payment.appWXPay().catch(err => {
                        Toast.$toast(err.message)
                        payment.resetPayment()
                        this._goToOrder()
                    })
                }
            } else if (result.code === payStatus.payNeedThrid) {
                this.$navigate('payment/ChannelPage', {remainMoney: Math.floor(result.thirdPayAmount * 100) / 100})
            } else if (result.code === payStatus.payOut) {
                Toast.$toast(payStatusMsg[result.code])
                this._goToOrder(2)
            } else {
                Toast.$toast(payStatusMsg[result.code])
            }
        }).catch(err => {
            Toast.$toast(err.msg)
        })
        
    }

    _handleAppStateChange = (nextAppState) =>{
        if (nextAppState !== 'active') {
            return
        }
        const { selctedPayType } = payment;
        if (this.state.orderChecking === true) {
            return;
        }
        if (payment.isGoToPay === false) {
            return;
        }
        if (payment.platformOrderNo && selctedPayType !== paymentType.none) {
            payment.isGoToPay = false
            this.orderTime = (new Date().getTime()) / 1000;
            this._checkOrder();
            this.setState({orderChecking: true})
        }
    }

    _checkOrder() {
        let time = (new Date().getTime()) / 1000;
        track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'checking' });
        if (time - this.orderTime > 10) {
            track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'checkOut' });
            return;
        }
        payment.checkPayStatus().then(result => {
            if (result.data === payStatus.payWait) {
                setTimeout(() => {
                    this._checkOrder();
                }, 1000);
                return;
            }
            let isSuccess = parseInt(result.data, 0) === payStatus.paySuccess
            if (isSuccess) {
                this.setState({
                    showResult: true,
                    orderChecking: false,
                    payResult: PaymentResult.sucess
                })
                track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'success' });
                payment.resetPayment()
            } else if (result.data === payStatus.payOutTime) {
                this.setState({
                    showPwd: false,
                    showResult: true,
                    payResult: PaymentResult.warning,
                    payMsg: '订单支付超时，下单金额已原路返回'
                })
                payment.resetPayment()
            }
        }).catch(() => {
            this.setState({ orderChecking: false });
        });
    }

    _goToOrder(index) {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'order/order/MyOrdersListPage',
            params: { index: index ? index : 1 }
        });
        this.props.navigation.dispatch(replace);
    }


    _selectedType(type) {
      payment.selectPayTypeAction(type)
    }

    _closeResultView() {
        this.setState({
            showResult: false,
            payResult: PaymentResult.none,
            payMsg: ''
        })
        payment.resetPayment()
    }

    _render() {
        const { selctedPayType, name } = payment
        const { showResult, payResult, payMsg, orderChecking } = this.state

        return <View style={styles.container}>
            <View style={styles.content}>
            <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1}>订单名称：{name}</Text>
            </View>
            </View>
            <View style={styles.needView}>
            <Text style={styles.need}>支付金额</Text>
            <Text style={styles.amount}>￥{this.remainMoney  ? this.remainMoney  : payment.amounts}</Text>
            </View>
            <View style={styles.channelView}>
            <TouchableWithoutFeedback onPress={()=> this._selectedType(paymentType.wechat)}>
              <View style={styles.row}>
                <Image style={styles.icon} source={res.wechat}/>
                <Text style={styles.text}>微信支付</Text>
                <View style={{flex: 1}}/>
                <Image style={styles.iconCheck} source={selctedPayType === paymentType.wechat ? res.check : res.uncheck}/>
              </View>
            </TouchableWithoutFeedback>
              <View style={styles.line}/>
            <TouchableWithoutFeedback onPress={()=> this._selectedType(paymentType.alipay)}>
              <View style={styles.row}>
                <Image style={styles.icon} source={res.alipay}/>
                <Text style={styles.text}>支付宝支付</Text>
                <View style={{flex: 1}}/>
                <Image style={styles.iconCheck} source={selctedPayType === paymentType.alipay  ? res.check : res.uncheck}/>
              </View>
            </TouchableWithoutFeedback>
            </View>
            <View style={{flex: 1}}/>
            <TouchableWithoutFeedback onPress={() => {this.goToPay()}}>
            <View style={styles.payBtn}>
                <Text style={styles.payText}>去支付</Text>
            </View>
            </TouchableWithoutFeedback>
            {
                showResult
                ?
                <PaymentResultView
                    navigation={this.props.navigation}
                    payResult={payResult}
                    payMsg={payMsg}
                    closeResultView={()=>{this._closeResultView()}}
                />
                :
                null
            }
            
            {
                orderChecking
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
        height: px2dp(50),
        backgroundColor: whiteBg,
        borderRadius: 5
    },
    channelView: {
      height: px2dp(100),
      marginLeft: px2dp(15),
      marginRight: px2dp(15),
      backgroundColor: whiteBg,
      borderRadius: 5
    },
    icon: {
      width: px2dp(24),
      height: px2dp(24),
      marginRight: px2dp(10)
    },
    row: {
        height: px2dp(50),
        flexDirection: 'row',
        paddingRight: px2dp(15),
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
    iconCheck: {
      width: px2dp(20),
      height: px2dp(20)
    },
    need: {
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
        height: px2dp(110),
        alignItems: 'center',
        justifyContent: 'center'
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
        borderRadius: px2dp(10)
    },
    loadingText: {
        color: '#fff',
        fontSize: px2dp(13)
    },
    loadingSpace: {
        height: px2dp(27)
    }
});

