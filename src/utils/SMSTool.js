import ApiUtils from '../api/network/ApiUtils';

const SMSInterface = {
    //登陆验证码
    SMSLogin: ['/sms/sendLoginMessage',{method:'get'}],
    //注册验证码
    SMSReg: ['/sms/sendRegMessage',{method:'get'}]
};
const SMSType = {
    LoginType:0,
    RegType:1
}
const SMSAPI = ApiUtils(SMSInterface);
const SMSTool = {
    /**
     *
     * @param sendType 发送类型 0 登陆验证码 1 注册验证码 如果再有其他类型再加
     * @param phoneNumber 发送手机号
     * @return promise 接口请求完成后回调的promise
     */
    sendVerificationCode: function(sendType, phoneNumber) {
        switch (sendType) {
            case SMSType.LoginType:
                return SMSAPI.SMSLogin({
                    phone: phoneNumber
                });
            case SMSType.RegType:
                return SMSAPI.SMSReg({
                    phone: phoneNumber
                });
        }
    }
};
export default SMSTool;
