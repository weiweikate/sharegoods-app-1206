import ApiUtils from '../api/network/ApiUtils';
import { TrackApi } from './SensorsTrack'

const SMSInterface = {
    // 登陆验证码
    SMSLogin: ['/sms/sendLoginMessage', { method: 'get', isRSA: true }],
    // 注册验证码
    SMSReg: ['/sms/sendRegMessage', { method: 'get', isRSA: true }],
    // 旧手机验证码
    SMSOldPhone: ['/sms/sendAuldPhoneMessage', { method: 'get', isRSA: true }],
    // 新手机号验证码
    SMSNewPhone: ['/sms/sendNewPhoneMessage', { method: 'get', isRSA: true }],
    // 第一次设置交易密码验证码
    SMSSalePhone: ['/sms/sendTransactionMessage', { method: 'get', isRSA: true }],
    //忘记登录密码
    SMSForgetLoginPassword: ['/sms/sendForgetLoginPasswordMessage', { method: 'get', isRSA: true }],
    // 设置交易密码手机验证验证码
    SMSSetSalePhone: ['/sms/sendTransPasswordMessage', { method: 'get', isRSA: true }],
    // 忘记交易密码手机验证验证码
    SMSForgetSalePhone: ['/sms/sendForgetTransPasswordMessage', { method: 'get', isRSA: true }]
};

const SMSAPI = ApiUtils(SMSInterface);
const SMSTool = {

    SMSType: {
        LoginType: 0,
        RegType: 1,
        OldPhoneType: 2,
        NewPhoneType: 3,
        SalePwdType: 4,
        SetSaleType: 5,
        ForgetSaleType: 6,
        ForgetPasswordType: 7,
        setLoginPW: 8,
    },
    /**
     *
     * @param sendType 发送类型 0 登陆验证码 1 注册验证码 如果再有其他类型再加
     * @param phoneNumber 发送手机号
     * @return promise 接口请求完成后回调的promise
     */
    sendVerificationCode: function(sendType, phoneNumber) {
        switch (sendType) {
            case this.SMSType.LoginType:
                TrackApi.codeGetVerifySMS();
                return SMSAPI.SMSLogin({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.RegType:
                TrackApi.registGetVerifySMS()
                return SMSAPI.SMSReg({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.OldPhoneType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSOldPhone({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.NewPhoneType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSNewPhone({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.SalePwdType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSSalePhone({
                    phone: phoneNumber
                });
                break;

            case this.SMSType.SetSaleType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSSetSalePhone({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.ForgetSaleType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSForgetSalePhone({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.ForgetPasswordType:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSForgetLoginPassword({
                    phone: phoneNumber
                });
                break;
            case this.SMSType.setLoginPW:
                TrackApi.otherGetVerifySMS()
                return SMSAPI.SMSForgetLoginPassword({
                    phone: phoneNumber
                });
                break;
            default:
                break;
        }
    }
};
export default SMSTool;
