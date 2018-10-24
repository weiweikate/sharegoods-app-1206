import { observable, action, flow } from "mobx"
import PaymentApi from './PaymentApi'
import user from '../../model/user'
import balanceImg from './res/balance.png'
import bankImg from './res/bank.png'
import wechatImg from './res/wechat.png'
import alipayImg from './res/alipay.png'
import Toast from '../../utils/bridge'
import PayUtil from './PayUtil'

export const paymentType = {
    balance: 1, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5
}

export class Payment {
    @observable availableBalance = user.availableBalance ? user.availableBalance : 0
    @observable balancePayment = {
        type: paymentType.balance,
        name: '余额支付',
        icon: balanceImg,
        hasBalance: true
    }
    //是否支付店铺保证金
    @observable payStore = false
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
    //余额支付
    balancePay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.balance
            params.balance = params.amounts
            params.amounts = 0
            const res = yield this.perpay(params)
            const outTradeNo = res.data.outTradeNo
            const checkRes = yield this.checkPayStatus({outTradeNo: outTradeNo})
            Toast.hiddenLoading()
            return checkRes
        } catch (error) {
            Toast.hiddenLoading();
            Toast.$toast(error.msg);
            console.log(error)
        }
    })

    //预支付
    perpay  = flow(function * (params) {
        try {
            const res = yield PaymentApi.prePay(params)
            return res
        } catch (error) {
            Toast.$toast(error.msg);
            console.log(error)
        }
    })

    //检查是否支付成功
    checkPayStatus = flow(function * (params) {
        try {
            const res = yield PaymentApi.continueToPay(params)
            return res
        } catch (error) {
            console.log(error)
        }
    })

    //支付宝支付
    alipay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.alipay
            params.balance = 0
            params.amounts = params.amounts
            // params
            const preStr = yield this.perpay(params)
            const prePayStr = preStr.data.prePayStr
            const resultStr = yield PayUtil.appAliPay(prePayStr)
            Toast.hiddenLoading();
            return {resultStr, preStr}
        } catch (error) {
            Toast.showLoading()
            console.log(error)
        }
    })

    //微信支付
    appWXPay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.wechat
            params.balance = 0
            params.amounts = params.amounts
            const preStr = yield this.perpay(params)
            const prePay = JSON.parse(preStr.data.prePayStr)
            const resultStr = yield PayUtil.appWXPay(prePay)
            if (parseInt(resultStr.sdkCode, 0) !== 0) {
                Toast.$toast(resultStr.msg)
                Toast.hiddenLoading()
                return
            }

            Toast.hiddenLoading()
            return {resultStr, preStr}
        } catch (error) {
            Toast.showLoading()
            console.log(error)
        }
    })

    //店铺保证金
    @action
    payStoreActoin = () => {
        let type = (this.selectedBalace ? 1 : 0)
        if (this.selectedTypes) {
            type += this.selectedTypes.type
        }
        Toast.showLoading()

        console.log('payStoreActoin', type)

        return PaymentApi.storePayment({type: type}).then(result => {
            if (!this.selectedTypes && parseInt(result.code, 0) === 10000) {
                Toast.hiddenLoading()
                result.sdkCode = 0
                return Promise.resolve(result)
            }

            if (parseInt(result.code, 0) === 10000) {
                if (this.paymentType.type === paymentType.wechat) {
                    PayUtil.appWXPay(result.data).then(resultStr => {
                        Toast.hiddenLoading()
                        if (parseInt(resultStr.sdkCode, 0) !== 0) {
                            return Promise.reject(resultStr)
                        }
                        return Promise.resolve(resultStr)
                    })
                } else {
                    PayUtil.appAliPay(result.data).then(resultStr => {
                        Toast.hiddenLoading()
                        if (parseInt(resultStr.code, 0) !== 0) {
                            return Promise.reject(resultStr)
                        }
                        result.sdkCode = 0
                        return Promise.resolve(resultStr)
                    })
                }
            }
            Toast.hiddenLoading()
            return Promise.reject(result)
        }).catch(error => {
            console.log('payStoreActoin error', error)
            Toast.$toast(error.msg)
            Toast.hiddenLoading()
        })
    }
}
