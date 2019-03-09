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
import { payment, paymentType, paymentTrack, payStatus } from './Payment'
import PaymentResultView, { PaymentResult } from './PaymentResultView'
import { track, trackEvent } from '../../utils/SensorsTrack'
const { px2dp } = ScreenUtils;

@observer
export default class ChannelPage extends BasePage {

    $navigationBarOptions = {
        title: '订单支付',
        show: true
    }

    constructor(props) {
        super(props)
        this.state = {
            orderChecking: false
        }
        this.remainMoney = this.params.remainMoney
    }

    componentDidMount() {
        AppState.addEventListener('change', (state) => this._handleAppStateChange(state));
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', (state) => this._handleAppStateChange(state));
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    }

    goToPay() {
        if (payment.selctedPayType === paymentType.alipay) {
            payment.alipay()
        } else {
            payment.appWXPay()
        }
    }

    _handleAppStateChange(state) {
        if (state !== 'active') {
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
            this.setState({ orderChecking: true });
            this.orderTime = (new Date().getTime()) / 1000;
            this._checkOrder();
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
            this.setState({ orderChecking: false })
            console.log('checkPayStatus', result, parseInt(result.data, 0) === payStatus.paySuccess)
            if (parseInt(result.data, 0) === payStatus.paySuccess) {
                track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'success' });
                this.paymentResultView.show(PaymentResult.sucess);
                payment.resetPayment()
            }
            if (result.data === payStatus.payOutTime) {
                this.paymentResultView.show(PaymentResult.warning, '订单支付超时，下单金额已原路返回');
            }
        }).catch(() => {
            this.setState({ orderChecking: false });
        });
    }

    _selectedType(type) {
      payment.selectPayTypeAction(type)
    }

    _render() {
        const { selctedPayType, name } = payment

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
            <PaymentResultView
                ref={(ref) => {
                    this.paymentResultView = ref;
                }}
                navigation={this.props.navigation}
                repay={() => this._repay()}
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

