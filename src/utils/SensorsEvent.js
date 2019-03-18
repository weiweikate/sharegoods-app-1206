const LoginModular = {
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
        "des": '获取手机号验证码,手机号登录',
        "name": "GetVerifySMS",
        "params": { "pagePosition": 3 }
    },
    "registGetVerifySMS": {
        "des": '获取手机号验证码,注册验证码',
        "name": "GetVerifySMS",
        "params": { "pagePosition": 2 }
    },
    "otherGetVerifySMS": {
        "des": '其他验证码',
        "name": "GetVerifySMS",
        "params": { "pagePosition": 100 }
    },
    "phoneSignUpSuccess": {
        "des": '手机号注册',
        "name": "SignUpSuccess",
        "params": {
            "signUpMethod": 2, "signUpPlatform": 1
            //signUpPhone 动态参数注册手机号
        }
    },
    "wxSignUpSuccess": {
        "des": '微信注册',
        "name": "SignUpSuccess",
        "params": {
            "signUpMethod": 1,
            "signUpPlatform": 1
        }
    }
};
//    home 模块
const HomeModular = {};
//    购物车 模块
const ShopCartModular = {};
//    产品详情模块
const ProductModular = {};
//    秀场模块
const ShowModular = {
    "ShowBannerRecommandClick":{
        "des":'秀场banner推荐图展示',
        "name":"ShowBannerRecommandClick",
        "params":{}
    },
    "ShowBannerClick":{
        "des":'秀场banner推荐图点击',
        "name":"ShowBannerClick",
        "params":{}
    },
    "WatchXiuChang":{
        "des":'浏览秀场-精选热门/最新秀场',
        "name":"WatchXiuChang",
        "params":{}
    },
    "XiuChangDetails":{
        "des":'秀场文章详情查看',
        "name":"XiuChangDetails",
        "params":{}
    },
    "ArticleShare":{
        "des":'文章分享',
        "name":"ArticleShare",
        "params":{}
    },
    "CollectingArticle":{
        "des":'文章收藏',
        "name":"CollectingArticle",
        "params":{}
    },
    "CancelArticleCollection":{
        "des":'文章取消收藏',
        "name":"CancelArticleCollection",
        "params":{}
    },
}
//    签到模块
const SignUpModular = {
    "SignUpFeedback":{
        "des":'签到成功反馈',
        "name":"SignUpFeedback",
        "params":{}
    },
}


//     消息模块
const MessageModular = {
    "ViewMyMessage":{
        "des":'查看-信息通知',
        "name":"ViewMyMessage",
        "params":{}
    },
    "ViewNotice":{
        "des":'查看通知',
        "name":"ViewNotice",
        "params":{}
    },
    "ViewNoticeContent":{
        "des":'查看通知详细信息',
        "name":"ViewNoticeContent",
        "params":{}
    },
    "ViewMessage":{
        "des":'查看消息',
        "name":"ViewMessage",
        "params":{}
    },
    "ViewMessageContent":{
        "des":'查看消息内详细信息',
        "name":"ViewMessageContent",
        "params":{}
    },
    "ViewPinMessage":{
        "des":'查看拼店消息',
        "name":"ViewMessage",
        "params":{}
    },
    "ViewPinMessageContent":{
        "des":'查看拼店内详细信息',
        "name":"ViewPinMessageContent",
        "params":{}
    }
}

//    公用模块
const   CommModular = {

};
const OrderModular = {
    "SubmitOrder":{
        "des":"提交订单",
        "name":"SubmitOrder",//  提交订单
        "params":{
            "loginMethod":3
        }
    },
    "ViewMyOrder":{
        "des":'查看-我的订单',
        "name":"ViewMyOrder",
        "params":{}
    },
};

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
    "ViewPersonalInfo":{
        "des":'查看个人资料',
        "name":"ViewPersonalInfo",
        "params":{}
    },
    "ViewLevelInterest":{
        "des":'查看等级权益',
        "name":"ViewLevelInterest",
        "params":{}
    },
    "ViewHowTo":{
        "des":'点击查看“如何玩转秀购”',
        "name":"ViewHowTo",
        "params":{}
    },
    "ViewAccountBalance":{
        "des":'点击查看账户余额',
        "name":"ViewAccountBalance",
        "params":{}
    },
    "ViewShowDou":{
        "des":'点击查看秀豆',
        "name":"ViewShowDou",
        "params":{}
    },
    "ViewWaitToRecord":{
        "des":'点击查看待入帐',
        "name":"ViewWaitToRecord",
        "params":{}
    },
    "ViewCoupon":{
        "des":'点击查看优惠券',
        "name":"ViewCoupon",
        "params":{}
    },
    "ViewMyInfos":{
        "des":'点击查看我的资料',
        "name":"ViewMyInfos",
        "params":{}
    },
    "ViewMyPinCollection":{
        "des":'点击查看收藏店铺',
        "name":"ViewMyPinCollection",
        "params":{}
    },
    "ViewMyXiuCollection":{
        "des":'点击查看秀场收藏',
        "name":"ViewMyXiuCollection",
        "params":{}
    },
    "ViewMyFans":{
        "des":'点击查看我的秀迷',
        "name":"ViewMyFans",
        "params":{}
    },
    "ViewMyAdviser":{
        "des":'点击查看服务顾问',
        "name":"ViewMyAdviser",
        "params":{}
    },
    "ClickCustomerService":{
        "des":'点击帮助与客服',
        "name":"ClickCustomerService",
        "params":{}
    },
    "ClickContactCustomerService":{
        "des":'点击联系客服',
        "name":"ClickContactCustomerService",
        "params":{}
    }
};




const event = {
    ...LoginModular,
    ...HomeModular,
    ...ShopCartModular,
    ...ProductModular,
    ...CommModular,
    ...ShowModular,
    ...SignUpModular,
    ...OrderModular,
    ...MessageModular,
    ...MineModular

};



export default event;
