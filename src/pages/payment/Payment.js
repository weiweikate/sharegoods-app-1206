import { observable, action, flow } from "mobx";
import PaymentApi from "./PaymentApi";
import Toast from "../../utils/bridge";
import PayUtil from "./PayUtil";
import user from "../../model/user";
import { track, trackEvent } from "../../utils/SensorsTrack";


export const paymentType = {
    none: 0,
    balance: 1, //余额支付
    // balance: 2, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5,  //
    coupon: 17, //优惠券支付
    zeroPay:0
};


export const payStatus = {
    // payNo: 20804,
    // paySuccess: 20807,
    // payClose: 20800,
    // payfail: 20002,
    // payNeedThrid: 3,
    payNo: 0, //待支付
    payClose: 5,//取消或已关闭
    payfail: 2,//支付失败
    paySuccess: 1,//支付成功
    payNeedThrid: 3,//预支付成功
    PayError: 20806,
    payOutTime: 20808,
    payWait: 20809,
    // payOut: 20801,
    payOut: 1,
    payCreate: 20812,
    payThridClose: 20815,
    payBalanceChange: 20811
};

export const payStatusMsg = {
    [payStatus.payNo]: "订单未支付",
    [payStatus.payClose]: "该订单已关闭，请重拍",
    [payStatus.payfail]: "支付失败",
    [payStatus.payNeedThrid]: "平台支付成功,需要三方支付",
    [payStatus.PayError]: "订单状态异常",
    [payStatus.payOut]: "该订单已支付成功，请勿重拍"
};


export let paymentTrack = {
    orderId: "",
    orderAmount: "",
    paymentMethod: "",
    pinId: user.storeCode ? user.storeCode : ""
};

export class Payment {
    @observable orderName = "";
    @observable selctedPayType = paymentType.none;
    @observable selectedBalace = false;
    @observable orderNo = "";
    @observable platformOrderNo = "";
    @observable isGoToPay = false;
    @observable amounts = 0;
    //后期更改支付时需要的收单号
    @observable fundsTradingNo = "";
    @observable bizType = 0;
    @observable modeType = 0;
    @observable oneCoupon = 0;//一元劵使用个数

    @action resetPayment = () => {
        this.orderName = "";
        this.selctedPayType = paymentType.none;
        this.selectedBalace = false;
        this.isGoToPay = false;
        this.fundsTradingNo = "";
        this.bizType = 0;
        this.modeType = 0;
        this.oneCoupon = 0;
    };

    //选择余额支付
    @action selectBalancePayment = () => {
        this.selectedBalace = !this.selectedBalace;
    };

    //选择三方支付方式
    @action selectPayTypeAction = (type) => {
        this.selctedPayType = type;
    };

    /**
     * 平台支付
     * password 支付密码
     * fundsTradingNo 收单号
     * detailList 支付明细
     * "detail":[
     {
     "payType":2,
      "payAmount":10.00
     },
     {
    "payType":4,
     "payAmount":2.01
    }
     ]
     * remark 备注信息
     */
    @action platformPay = flow(function* (password, fundsTradingNo, detailList, remark = "") {
        paymentTrack.paymentMethod = "balance";
        let trackPoint = { ...paymentTrack, paymentProgress: "start" };
        track(trackEvent.payOrder, trackPoint);
        try {
            Toast.showLoading();
            let payParams = {
                password: password,
                fundsTradingNo: fundsTradingNo ? fundsTradingNo : this.fundsTradingNo,
                detail: detailList,
                remark: remark
            };
            const result = yield PaymentApi.platformPay(payParams);
            this.updateUserData();
            Toast.hiddenLoading();
            track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "success" });
            return result.data;
        } catch (error) {
            if (error.code === payStatus.payBalanceChange) {
                payment.updateUserData();
            }
            Toast.hiddenLoading();
            track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "errorCause", errorCause: error.msg });
            throw error;
        }
    });

    //检查订单状态
    @action checkOrderStatus = flow(function* (pOrderNo, bizType = 0, modeType = 0, payAmount, tradeDesc = "APP支付") {
        try {
            Toast.showLoading();
            let checkParams = {
                // platformOrderNo: pOrderNo ? pOrderNo : this.platformOrderNo
                outTradeNo: pOrderNo ? pOrderNo : this.platformOrderNo,//外部订单号
                bizType: bizType,//业务类型.0:普通订单;1:拼店扩容;
                modeType: modeType,//结算模式.0:正常流程结算;1:立即结算.例如:拼店扩容应该是立即结算;普通商品交易应该是普通结算
                payAmount: payAmount,
                tradeDesc: tradeDesc
            };
            console.log("checkParams" + checkParams);
            const result = yield PaymentApi.check(checkParams);
            Toast.hiddenLoading();
            // 将下单号保存起来
            this.fundsTradingNo = result.data && result.data.fundsTradingNo || "";
            //外部订单号
            this.platformOrderNo = result.data && result.data.outTradeNo;

            return result.data;
        } catch (error) {
            Toast.hiddenLoading();
            throw error;
        }
    });

    //支付宝支付
    @action alipay = flow(function* (payResult) {
        paymentTrack.paymentMethod = "alipay";
        track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "start" });
        try {
            // Toast.showLoading();
            // const result = yield PaymentApi.alipay({ platformOrderNo: this.platformOrderNo, tradeNo: this.orderNo });
            // Toast.hiddenLoading();
            this.isGoToPay = true;
            const resultStr = yield PayUtil.appAliPay(payResult);
            console.log(resultStr);
            if (resultStr.sdkCode !== 9000) {
                throw new Error(resultStr.msg);
            }
            return resultStr;
        } catch (error) {
            Toast.hiddenLoading();
            track(trackEvent.payOrder, {
                ...paymentTrack,
                paymentProgress: "error",
                errorCause: error.msg || error.message
            });
            throw error;
        }
    });

    //微信支付
    @action appWXPay = flow(function* (result) {
        paymentTrack.paymentMethod = "wxpay";
        track(trackEvent.payOrder, { ...paymentTrack, paymentProgress: "start" });

        try {
            Toast.showLoading();
            // const result = yield PaymentApi.wechatPay({ platformOrderNo: this.platformOrderNo, tradeNo: this.orderNo });
            this.isGoToPay = true;
            const payInfo = JSON.parse(result);
            Toast.hiddenLoading();
            payInfo.partnerid = payInfo.mchId;
            payInfo.timestamp = payInfo.timeStamp;
            payInfo.prepayid = payInfo.prepayId;
            payInfo.sign = payInfo.paySign;
            payInfo.noncestr = payInfo.nonceStr;
            payInfo.appid = payInfo.appId;
            const resultStr = yield PayUtil.appWXPay(payInfo);
            console.log(JSON.stringify(resultStr));
            if (parseInt(resultStr.code, 0) !== 0) {
                // ref && ref.show(2, resultStr.msg)
                throw new Error(resultStr.msg);
            }
            return resultStr;

        } catch (error) {
            track(trackEvent.payOrder, {
                ...paymentTrack,
                paymentProgress: "error",
                errorCause: error.msg || error.message
            });
            Toast.hiddenLoading();
            this.payError = error;
            this.isGoToPay = false;
            throw error;
        }
    });

    //检查订单状态
    @action checkPayStatus = flow(function* () {
        try {
            // const result = yield PaymentApi.payStatus({
            //     platformOrderNo: this.platformOrderNo,
            //     payMethodCode: this.selctedPayType === paymentType.alipay ? "alipay" : "wxpay"
            // });
            const result = yield PaymentApi.payStatus({
                fundsTradingNo: this.fundsTradingNo,
                bizType: this.bizType,
                outTradeNo: this.outTradeNo
            });
            return result;
        } catch (error) {
            throw error;
        }
    });

    @action updateUserData = () => {
        user.updateUserData().then(data => {
            this.availableBalance = data.availableBalance;
        });
    };

}

export const payment = new Payment();
