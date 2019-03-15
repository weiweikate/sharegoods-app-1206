
const LoginModular = {
    //微信登录
    "wxLoginSuccess":{
        "des":"微信登录成功埋点",
        "name":"LoginSuccess",
        "params":{
            "loginMethod":1
        }
    },

    "codeLoginSuccess":{
        "des":"验证码登录成功埋点",
        "name":"LoginSuccess",//  验证码登录
        "params":{
            "loginMethod":2
        }
    },

    "pwdLoginSuccess":{
        "des":"密码登录成功埋点",//埋点解释 可不写
        "name":"LoginSuccess",
        "params":{
            "loginMethod":3
        }

    }
};
//    home 模块
const  HomeModular = {

};
//    购物车 模块
const   ShopCartModular = {

};
//    产品详情模块
const   ProductModular = {

};

//    公用模块
const   CommModular = {

}



const event = {
    ...LoginModular,
    ...HomeModular,
    ...ShopCartModular,
    ...ProductModular,
    ...CommModular,
}




export default event;
