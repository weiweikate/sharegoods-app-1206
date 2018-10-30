import React, {Component} from 'react'
import {Modal,View,  StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
import ScreenUtils from '../../utils/ScreenUtils';
const { px2dp } = ScreenUtil
import { NavigationActions } from 'react-navigation'
import failImg from './res/fail.png'
import successImg from './res/success.png'

export const PaymentResult = {
    sucess: 1,
    fail:2
}

export default class PaymentResultView extends Component {
    state = {
        modalVisible: false,
        resultText: '',
        result: 0,
        message: ''
    }
    _goToHome() {
        const {navigation} = this.props
        this.dismiss()
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        navigation.dispatch(resetAction)
    }
    _goToOrder() {
        this.dismiss()
        this.props.navigation.navigate('order/order/MyOrdersListPage',{index:2})
    }
    show(result, message) {
        this.setState({
            modalVisible: true,
            resultText: result === PaymentResult.sucess ? '支付成功' : '支付失败',
            result: result,
            message: message
        })
    }
    dismiss() {
        this.setState({modalVisible: false, message: ''})
    }
    render() {
        const {resultText, result, message} = this.state

        console.log('PaymentResultView message', message)
      return (
        <Modal
        style={styles.container}
        animationType="fade"
        visible={this.state.modalVisible}
        transparent={true}
        onRequestClose={() => {

        }}>
            <TouchableWithoutFeedback style={styles.container} onPress={()=>this.dismiss()}>
            <View style={styles.container}>
            <View style={styles.content}>
                <Image style={styles.image} source={result === PaymentResult.sucess ? successImg : failImg}/>
                <Text style={styles.text}>{resultText}</Text>
                {
                    message
                    ?
                    <Text style={styles.message}>{message}</Text>
                    :
                    null
                }
                <View style={{flex: 1}}/>
                {
                    result === PaymentResult.sucess
                    ?
                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.button} onPress={()=>this._goToHome()}>
                            <Text style={styles.buttonText}>返回首页</Text>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={styles.button} onPress={()=>{this._goToOrder()}}>
                            <Text style={styles.buttonText}>查看订单</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.button} onPress={()=>this.dismiss()}>
                            <Text style={styles.buttonText}>重新支付</Text>
                        </TouchableOpacity>
                    </View>
                }

            </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
      )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        width: px2dp(250),
        height: px2dp(205),
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        alignItems: 'center'
    },
    text: {
        color: '#666',
        fontSize: px2dp(15),
        marginTop: px2dp(10)
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30),
        marginBottom: px2dp(20),
        marginLeft: px2dp(24),
        marginRight: px2dp(24),
        justifyContent: 'center'
    },
    button: {
        height: px2dp(30),
        width: px2dp(90),
        borderRadius: px2dp(5),
        borderColor: '#D51243',
        borderWidth: ScreenUtils.onePixel,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#D51243',
        fontSize: px2dp(12)
    },
    image: {
        marginTop: px2dp(21)
    },
    message: {
        color: '#999',
        fontSize: px2dp(13),
        marginTop: px2dp(10)
    }
})
