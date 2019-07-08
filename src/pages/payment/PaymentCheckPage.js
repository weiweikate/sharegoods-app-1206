import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import BasePage from '../../BasePage';
import { payment, paymentTrack, payStatus } from './Payment';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import { track, TrackApi, trackEvent } from '../../utils/SensorsTrack';
import { PaymentResult } from './PaymentResultPage';
import RouterMap, { replaceRoute } from '../../navigation/RouterMap';

const { px2dp } = ScreenUtils;


export default class PaymentCheckPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            msg: ' 支付返回结果等待中...'
        };
        payment.checking = true;
        //埋点
        TrackApi.ViewOrderPayPage({ orderPayType: 1, orderPayResultPageType: 0 });
    }

    $navigationBarOptions = {
        title: '支付订单'
    };

    componentWillUnmount() {
        payment.checking = false;

    }

    componentDidMount() {
        this.orderTime = (new Date().getTime()) / 1000;
        this._checkStatues();
    }

    _render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderWaitView()}
            </View>
        );
    }

    _renderWaitView = () => {
        return (
            <View style={styles.waitBgViewStyle}>
                <View style={styles.waitContentTopView}>
                    <Image style={styles.waitContentTopImage} source={res.pay_check_statue}/>
                    <Text style={styles.waitContentTopText}>
                        支付返回结果等待中...
                    </Text>
                </View>
                <View style={styles.waitContentBottomView}>
                    <Text style={styles.waitContentBottomTip}>
                        温馨提示
                    </Text>
                    <Text style={styles.waitContentBottomWaitingText}>
                        结果返回前，请不要重复支付
                    </Text>
                </View>
            </View>
        );
    };
    /**
     * 轮询订单状态
     * @private
     */
    _checkStatues = () => {
        let time = (new Date().getTime()) / 1000;
        track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'checking' });
        if (time - this.orderTime > 5) {
            track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: 'checkOut' });
            if (payment.checking) {
                this._goToOrder(1);
                replaceRoute(RouterMap.PaymentResultPage,{ payResult: PaymentResult.timeout, payMsg: '订单支付超时，下单金额已原路退回' })
            }
            payment.resetPayment();
            return;
        }
        const { bizType } = payment;
        payment.checkPayStatus().then(result => {
            console.log(result);
            let resultData = result.data;
            if (parseInt(resultData.status) === payStatus.paySuccess) {
                if (bizType !== 1) {
                    replaceRoute(RouterMap.PaymentFinshPage, { payResult: PaymentResult.success });
                } else {
                    replaceRoute(RouterMap.AddCapacitySuccessPage, { payResult: PaymentResult.success });
                }
                payment.resetPayment();
                TrackApi.orderPayResultPage({ isPaySuccess: true });
            } else if (parseInt(resultData.status) === payStatus.payClose) {
                const { bizType } = payment;
                if (bizType !== 1) {
                    replaceRoute(RouterMap.PaymentResultPage, { payResult: PaymentResult.fail, payMsg: '支付关闭' });
                } else {
                    this._goToOrder();
                }
                payment.resetPayment();
                TrackApi.ViewOrderPayPage({ orderPayType: 3 });
            } else {
                setTimeout(() => {
                    this._checkStatues();
                }, 1000);
            }
        }).catch(err => {


        });
    };

    _goToOrder(index) {
        const { bizType } = payment;
        if (bizType === 1) {
            this.props.navigation.dispatch({
                key: this.props.navigation.state.key,
                type: 'ReplacePayScreen',
                routeName: RouterMap.AddCapacityHistoryPage
            });
        } else {
            this.props.navigation.dispatch({
                key: this.props.navigation.state.key,
                type: 'ReplacePayScreen',
                routeName: 'order/order/MyOrdersListPage',
                params: { index: index ? index : 1 }
            });
        }
    }

}

const styles = StyleSheet.create({
    waitBgViewStyle: {
        flex: 1,
        marginTop: -2,
        backgroundColor: DesignRule.bgColor
    },
    waitContentTopView: { alignItems: 'center', justifyContent: 'center', marginTop: px2dp(137) },
    waitContentTopImage: { height: px2dp(72), width: px2dp(72) },
    waitContentTopText: { marginTop: px2dp(22), fontSize: px2dp(13), color: DesignRule.textColor_instruction },
    waitContentBottomView: { marginTop: px2dp(150), alignItems: 'center', justifyContent: 'center' },
    waitContentBottomTip: { color: DesignRule.mainColor, fontSize: px2dp(13) },
    waitContentBottomWaitingText: { marginTop: px2dp(5), color: DesignRule.textColor_instruction, fontSize: px2dp(13) }
});
