
const   LoginModular = {
    "wxLoginSuccess":{
        "name":"LoginSuccess",
        "params":{
            "loginMethod":1
        }
    },

    "codeLoginSuccess":{
        "name":"LoginSuccess",//  验证码登录
        "params":{
            "loginMethod":2
        }
    },

    "pwdLoginSuccess": {
        "name": "LoginSuccess",
        "params": {
            "loginMethod": 3
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

//    我的模块
const MineModular = {
    //点击修改头像
    "ClickModifyAvatar":{
        "name":"ClickModifyAvatar"
    },
    //修改头像成功
    "ModifuAvatarSuccess_camera":{
        "name":"ModifuAvatarSuccess",
        "params":{
            "modificationMode":1//拍照
        }
    },

    "ModifuAvatarSuccess_photo":{
        "name":"ModifuAvatarSuccess",
        "params":{
            "modificationMode":2//相册
        }

    },
    //点击修改昵称
    "ClickModifyNickName":{
        "name":"ClickModifyNickName"
    },
    //修改昵称成功
    "ModifyNickNameSuccess":{
        "name":"ModifyNickNameSuccess"
    },
    //点击实名认证
    "ClickRealCodeentityVerify":{
        "name":"ClickRealCodeentityVerify"
    },
    //实名认证成功
    "ReadCodeentityVerifySuccss":{
        "name":"ReadCodeentityVerifySuccss"
    },

};



const event = {
    ...LoginModular,
    ...HomeModular,
    ...ShopCartModular,
    ...ProductModular,
    ...CommModular,
    ...MineModular
}




export default event;
