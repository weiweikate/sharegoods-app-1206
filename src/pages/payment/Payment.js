import { observable, action, flow } from "mobx"
import PaymentApi from './PaymentApi'
import Toast from '../../utils/bridge'
import PayUtil from './PayUtil'
import user from '../../model/user'
import {track, trackEvent} from '../../utils/SensorsTrack'

export const paymentType = {
    none: 0,
    balance: 1, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5
}

export const payStatus = {
    payNo: 20804,
    payClose: 20800,
    payfail: 20002,
    payNeedThrid: 20803,
    PayError: 20806,
    paySuccess: 20807,
    payOutTime: 20808,
    payWait: 20809,
    payOut: 20801,
    payCreate: 20812,
    payThridClose: 20815,
    payBalanceChange: 20811
}

export const payStatusMsg = {
    [payStatus.payNo]: '订单未支付',
    [payStatus.payClose]: '该订单已关闭，请重拍',
    [payStatus.payfail]: '支付失败',
    [payStatus.payNeedThrid]: '平台支付成功,需要三方支付',
    [payStatus.PayError]: '订单状态异常',
    [payStatus.payOut]: '该订单已支付成功，请勿重拍'
}


export let paymentTrack = {
    orderId : '',
    orderAmount: '',
    paymentMethod: '',
    pinId: user.storeCode ? user.storeCode : ''
}

export class Payment {
    @observable orderName = ''
    @observable selctedPayType = paymentType.none
    @observable selectedBalace = false
    @observable orderNo = ''
    @observable platformOrderNo = ''
    @observable isGoToPay = false
    @observable amounts = 0

    @action resetPayment = () => {
        this.orderName = ''
        this.selctedPayType = paymentType.none
        this.selectedBalace = false
        this.isGoToPay = false
    }
    
    //选择余额支付
    @action selectBalancePayment = () => {
        this.selectedBalace = !this.selectedBalace
    }

    //选择三方支付方式
    @action selectPayTypeAction = (type) => {
        this.selctedPayType = type
    }

    //平台余额支付
    @action platformPay = flow(function * (password) {
        paymentTrack.paymentMethod = 'balance'
        let trackPoint = {...paymentTrack, paymentProgress: 'start'}
        track(trackEvent.payOrder, trackPoint)
        try {
            Toast.showLoading()
            const result = yield PaymentApi.platformPay({platformOrderNo: this.platformOrderNo, tradeNo: this.orderNo, password: password, userAmount: user.availableBalance})
            track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'success'})
            this.updateUserData()
            Toast.hiddenLoading()
            return result.data
        } catch (error) {
            if (error.code === payStatus.payBalanceChange) {
                payment.updateUserData()
            }
            Toast.hiddenLoading();
            track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'errorCause', errorCause: error.msg})
            throw error
        }
    })

    //检查订单状态
    @action checkOrderStatus = flow(function * (pOrderNo) {
         try {
            Toast.showLoading()
            const result = yield PaymentApi.check({platformOrderNo: pOrderNo ? pOrderNo : this.platformOrderNo})
            Toast.hiddenLoading()
            return result.data
        } catch (error) {
            Toast.hiddenLoading();
            throw error
        }
    })

    //支付宝支付
    @action alipay = flow(function * () {
        paymentTrack.paymentMethod = 'alipay'
        track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'start'})
        try {
            Toast.showLoading()
            const result = yield PaymentApi.alipay({platformOrderNo: this.platformOrderNo, tradeNo: this.orderNo})
            Toast.hiddenLoading();
            this.isGoToPay = true
            const resultStr = yield PayUtil.appAliPay(result.data)
            if (resultStr.sdkCode !== 9000) {
                throw new Error(resultStr.msg)
            }
            return resultStr;
        } catch(error) {
            Toast.hiddenLoading()
            track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'error', errorCause: error.msg || error.message})
            throw error
        }
    })

    //微信支付
    @action appWXPay = flow(function * () {
        paymentTrack.paymentMethod = 'wxpay'
        track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'start'})

        try {
            Toast.showLoading()
            const result = yield PaymentApi.wechatPay({platformOrderNo: this.platformOrderNo, tradeNo: this.orderNo})
            
            this.isGoToPay = true
            const payInfo = JSON.parse(result.data)
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
            
        } catch (error) {
            track(trackEvent.payOrder, {...paymentTrack, paymentProgress: 'error', errorCause: error.msg || error.message})
            Toast.hiddenLoading()
            this.payError = error
            this.isGoToPay = false
            throw error
        }
    })

    //检查订单状态
    @action checkPayStatus = flow(function * (){
        try {
            const result = yield PaymentApi.payStatus({platformOrderNo: this.platformOrderNo, payMethodCode: this.selctedPayType === paymentType.alipay ? 'alipay' : 'wxpay'})
            return result
        } catch (error) {
            throw error
        }
    })

    @action updateUserData = () => {
        user.updateUserData().then(data => {
            this.availableBalance = data.availableBalance;
        });
    }

}

export const payment = new Payment()
