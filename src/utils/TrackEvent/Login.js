//登录相关埋点
const LoginModular = {
    "LoginButtonClick":{
        "des":"登录按钮点击",
        "name":"LoginButtonClick",
        "params":{}
    },
    //微信登录
    "wxLoginSuccess": {
        "des": "微信登录成功埋点",
        "name": "LoginSuccess",
        "params": { "loginMethod": 1 }
    },

    "codeLoginSuccess": {
        "des": "验证码登录成功埋点",
        "name": "LoginSuccess",//  验证码登录
        "params": { "loginMethod": 2 }
    },

    "pwdLoginSuccess": {
        "des": "密码登录成功埋点",//埋点解释 可不写
        "name": "LoginSuccess",
        "params": { "loginMethod": 3 }
    },
    // 222
    "localPhoneNumLogin": {
        "des":"本机号码一键登录",
        "name":"LoginSuccess",
        "params":{ "loginMethod": 4 }
    },
    "onKeyLoginPage": {
        "des": "一键登录页面埋点",
        "name": "OnKeyLoginPage",
        "params": {}
    },

    "passLoginPage": {
        "des": "其他登录方法页面埋点",
        "name": "PassLoginPage",
        "params": {}
    },
    "codeGetVerifySMS": {
        "des": "获取手机号验证码,手机号登录",
        "name": "GetVerifySMS",
        "params": { "pagePosition": 3 }
    },
    "registGetVerifySMS": {
        "des": "获取手机号验证码,注册验证码",
        "name": "GetVerifySMS",
        "params": { "pagePosition": 2 }
    },
    "otherGetVerifySMS": {
        "des": "其他验证码",
        "name": "GetVerifySMS",
        "params": { "pagePosition": 100 }
    },

    "phoneSignUpSuccess": {
        "des": "手机号注册",
        "name": "SignUpSuccess",
        "params": {
            "signUpMethod": 2, "signUpPlatform": 1
            //signUpPhone 动态参数注册手机号
        }
    },
    "wxSignUpSuccess": {
        "des": "微信注册",
        "name": "SignUpSuccess",
        "params": {
            "signUpMethod": 1,
            "signUpPlatform": 1
        }
    }
};

export default LoginModular;
