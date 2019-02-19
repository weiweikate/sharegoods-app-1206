import React, { Component } from 'react';
import {  View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import Modal from '../../comm/components/CommModal';
const { px2dp } = ScreenUtil;
import { NavigationActions } from 'react-navigation';
const successImg = res.button.tongyon_icon_check_green;
import DesignRule from '../../constants/DesignRule';
import {MRText as Text} from '../../components/ui'
import res from './res';
const failImg = res.fail;
const warningImg = res.warning;
export const PaymentResult = {
    sucess: 1,
    fail: 2,
    warning: 3,
};
export default class PaymentResultView extends Component {
    state = {
        modalVisible: false,
        resultText: '',
        result: 0,
        message: ''
    };

    _goToHome() {
        const { navigation } = this.props;
        this.dismiss();
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        navigation.dispatch(resetAction);
    }

    _goToOrder() {
        this.dismiss();
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'order/order/MyOrdersListPage',
            params: { index: 2 , orderNo:this.props.payment.orderNo}
        });
        this.props.navigation.dispatch(replace);
    }

    show(result, message) {

        let msg = ''
        if (result === PaymentResult.sucess) {
            msg = '支付成功'
        } else if (result === PaymentResult.fail) {
            msg = '支付失败'
        }

        this.setState({
            modalVisible: true,
            resultText: msg,
            result: result,
            message: message
        });
        this.props.payment.isShowResult = true
        this.props.payment.paySuccessFul = result === PaymentResult.sucess
    }

    dismiss() {
        this.setState({ modalVisible: false, message: '' });
        this.props.repay()
        this.props.payment.isShowResult = false
    }

    render() {
        const { resultText, result, message } = this.state;

        let img = successImg
        if (result === PaymentResult.sucess) {
            img = successImg
        } else if (result === PaymentResult.fail) {
            img = failImg
        } else {
            img = warningImg
        }

        console.log('PaymentResultView message', message);
        return (
            <Modal
                focusable={false}
                style={styles.container}
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({modalVisible:false})
                }}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Image style={styles.image}
                                source={img}/>
                        {
                            resultText
                            ?
                            <Text allowFontScaling={false}  style={styles.text}>{resultText}</Text>
                            :
                            null
                        }
                        {
                            message
                                ?
                                <Text allowFontScaling={false}  style={styles.message}>{message}</Text>
                                :
                                null
                        }
                        <View style={{ flex: 1 }}/>
                        {
                            result === PaymentResult.sucess || result === PaymentResult.warning
                                ?
                                <View style={styles.bottom}>
                                    <TouchableOpacity style={styles.button} onPress={() => this._goToHome()}>
                                        <Text allowFontScaling={false}  style={styles.buttonText}>返回首页</Text>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}/>
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        this._goToOrder();
                                    }}>
                                        <Text allowFontScaling={false}  style={styles.buttonText}>立即晒单</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.bottom}>
                                    <TouchableOpacity style={styles.button} onPress={() => this.dismiss()}>
                                        <Text allowFontScaling={false}  style={styles.buttonText}>重新支付</Text>
                                    </TouchableOpacity>
                                </View>
                        }

                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        width:ScreenUtils.width
    },
    content: {
        width: px2dp(250),
        height: px2dp(205),
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        alignItems: 'center'
    },
    text: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(15),
        marginTop: px2dp(10)
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30),
        marginBottom: px2dp(15),
        marginLeft: px2dp(24),
        marginRight: px2dp(24),
        justifyContent: 'center'
    },
    button: {
        height: px2dp(30),
        width: px2dp(90),
        borderRadius: px2dp(5),
        borderColor: DesignRule.mainColor,
        borderWidth: ScreenUtils.onePixel,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: DesignRule.mainColor,
        fontSize: px2dp(12)
    },
    image: {
        marginTop: px2dp(21)
    },
    message: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginTop: px2dp(10)
    }
});
