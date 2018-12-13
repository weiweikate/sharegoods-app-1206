import { observable, action, flow } from "mobx"
import PaymentApi from './PaymentApi'
import Toast from '../../utils/bridge'
import PayUtil from './PayUtil'
import user from '../../model/user'
import resource from './res';
const balanceImg = resource.balance;
const bankImg = resource.bank;
const wechatImg = resource.wechat;
const alipayImg = resource.alipay;

export const paymentType = {
    balance: 1, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5
}

export class Payment {
    @observable paySuccessFul = false
    @observable availableBalance = 0
    @observable balancePayment = {
        type: paymentType.balance,
        name: '余额支付',
        icon: balanceImg,
        hasBalance: true
    }
    @observable isGoToPay = false
    @observable orderNo = ''
    @observable amount = 0
    @observable payError = ''
    @observable paymentList = [
        {
            type: paymentType.section,
            name: '第三方支付'
        },
        {
            type: paymentType.bank,
            name: '银行卡支付',
            icon: bankImg,
            hasBalance: false,
            isEnable: false
        },
        {
            type: paymentType.wechat,
            name: '微信支付',
            icon: wechatImg,
            hasBalance: false,
            isEnable: true
        },
        {
            type: paymentType.alipay,
            name: '支付宝支付',
            icon: alipayImg,
            hasBalance: false,
            isEnable: true
        }
    ]
    @observable selectedTypes = null
    @observable selectedBalace = false
    @action selectBalancePayment = () => {
        this.selectedBalace = !this.selectedBalace
    }
    @action selectPaymentType = (data) => {
        if (this.selectedTypes && data.type === this.selectedTypes.type) {
            this.selectedTypes = null
        } else {
            this.selectedTypes = data
        }
    }
    @action clearPaymentType = () => {
        this.selectedTypes = null
    }

    @action updateUserData = () => {
        user.updateUserData().then(data => {
            this.availableBalance = data.availableBalance;
        });
    }

    //余额支付
    @action balancePay = flow(function * (password, ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.balance({orderNo: this.orderNo, salePswd: password})
            this.updateUserData()
            Toast.hiddenLoading()
            return result
        } catch (error) {
            Toast.hiddenLoading();
            console.log('PaymentResultView',error)
            ref && ref.show(2, error.msg)
            return error
        }
    })

    //支付宝支付
    @action alipay = flow(function * (ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.alipay({orderNo: this.orderNo})
            Toast.hiddenLoading();
            if (result && result.code === 10000) {
                this.isGoToPay = true
                const resultStr = yield PayUtil.appAliPay(result.data.payInfo)
                console.log('alipay result str', resultStr)
                if (resultStr.sdkCode !== 9000) {
                    throw new Error(resultStr.msg)
                }
                return resultStr;
            } else {
                Toast.$toast(result.msg)
                return ''
            }
        } catch(error) {
            this.payError = error
            ref && ref.show(2, error.msg || error.message)
            return error
        }
    })

    //微信支付
    @action appWXPay = flow(function * (ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.wachatpay({orderNo: this.orderNo})

            if (result && result.code === 10000) {
                if (!result.data) {
                    throw new Error('支付异常')
                }
                if (!result.data.payInfo) {
                    throw new Error('支付异常')
                }
                this.isGoToPay = true
                const payInfo = JSON.parse(result.data.payInfo)
                Toast.hiddenLoading()
                payInfo.partnerid = payInfo.mchId
                payInfo.timestamp = payInfo.timeStamp
                payInfo.prepayid = payInfo.prepayId
                payInfo.sign = payInfo.paySign
                payInfo.noncestr = payInfo.nonceStr
                payInfo.appid = payInfo.appId
                const resultStr = yield PayUtil.appWXPay(payInfo);
                console.log(JSON.stringify(resultStr));
                if (parseInt(resultStr.code, 0) !== 0) {
                    // ref && ref.show(2, resultStr.msg)
                    throw new Error(resultStr.msg)
                }
                return resultStr
            } else {
                Toast.$toast(result.msg);
                return
            }

        } catch (error) {
            Toast.hiddenLoading()
            this.payError = error
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

    //支付宝+平台
    @action ailpayAndBalance = flow(function * (password, ref) {
        try {
            const result = yield PaymentApi.alipayAndBalance({orderNo: this.orderNo, salePsw: password})
            if (result && result.code === 10000) {
                const resultStr = yield PayUtil.appAliPay(result.data.payInfo)
                if (resultStr.sdkCode !== 9000) {
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading();
                return resultStr;
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg)
                return ''
            }
        } catch (error) {
            Toast.hiddenLoading()
            this.payError = error
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

    @action openWechat = (payInfo) => {
        payInfo.partnerid = payInfo.mchId
        payInfo.timestamp = payInfo.timeStamp
        payInfo.prepayid = payInfo.prepayId
        payInfo.sign = payInfo.paySign
        payInfo.noncestr = payInfo.nonceStr
        payInfo.appid = payInfo.appId
        return PayUtil.appWXPay(payInfo);
    }

     //微信+平台
     @action wechatAndBalance = flow(function * (password, ref) {
        try {
            Toast.showLoading()
            const result = yield PaymentApi.wachatpay({orderNo: this.orderNo, salePsw: password})
            if (result && result.code === 10000) {
                const payInfo = JSON.parse(result.data.payInfo)
                const resultStr = yield this.openWechat(payInfo)
                if (parseInt(resultStr.code, 0) !== 0) {
                    Toast.hiddenLoading()
                    throw new Error(resultStr.msg)
                }
                Toast.hiddenLoading()
                return resultStr
            } else {
                Toast.hiddenLoading()
                Toast.$toast(result.msg);
                return
            }

        } catch (error) {
            Toast.hiddenLoading()
            this.payError = error
            ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

    @action checkPayStatus = flow(function * (){
        try {
            if (this.payError) {
                throw new Error('支付失败')
            }
            const result = yield PaymentApi.payStatus({platformOrderNo: this.orderNo})
            if (result && result.code === 10000) {
                return result.data
            } else {
                return
            }
        } catch (error) {
            // ref && ref.show(2, error.msg || error.message)
            console.log(error)
            this.payError = ''
            return error
        }
    })

    //关闭订单
    @action closeOrder = flow(function*(){
        try {
            let result = yield PaymentApi.closeWeChatorder({outTradeNo: this.orderNo})
            if (result && result.code === 10000) {
                return result.data
            } else {
                return
            }
        } catch (error) {
            // ref && ref.show(2, error.msg || error.message)
            console.log(error)
        }
    })

}
