//
//  JRPay
//
//  Copyright © 2018年 nuomi. All rights reserved.

#import "JRPay.h"
#import <WXApi.h>
#import <AlipaySDK/AlipaySDK.h>

#define PayFail @"PayFail"

#define kStringNotEmpty(str) ([str isKindOfClass:[NSString class]] && str && str.length > 0)
#define kDictNotEmpty(objDict) ([objDict isKindOfClass:[NSDictionary class]] && objDict && objDict.count > 0)

@interface JRPay ()<WXApiDelegate>

@property (nonatomic, copy) NSString * payInfo;//支付信息参数

@property (nonatomic,copy)ResultBlock resultBlock;//支付结果回调

@end

@implementation JRPay

static JRPay *_singleton;

+ (instancetype)sharedPay{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _singleton = [[self alloc] init];
    });
    return _singleton;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _singleton = [super allocWithZone:zone];
    });
    return _singleton;
}

// 仅仅针对微信
- (instancetype)init
{
    self = [super init];
    if (self) {
      // 暂时注释会影响支付宝支付
//      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appHasComein) name:UIApplicationWillEnterForegroundNotification object:nil];
    }
    return self;
}

//程序进入前台的回调
- (void)appHasComein{
    //防止已经执行了回调,1秒后再次进行校验
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      if (self.resultBlock) {
        NSLog(@"IOS 点击了左上角的跳转 或者通过home键位  进行的回调   导致客户端无法获取到支付的回调信息");
        //ios点击左上角返回。未知支付结果"
        [self payEndWithDesc:@"支付结果未知" andPayResult:3 andOriginCode:-1 andResult:nil];
        self.resultBlock = nil;
      }
    });
}

#pragma mark - 配置基础数据
- (void)configureWechatPayKeyWith:(NSString *)appid{
    //注册微信支付  配置appid
    [WXApi registerApp:appid];
}


- (void)payWithPayMethod:(PayMethodType)type andPayInfo:(id)payInfo andComplete:(ResultBlock) resultBlock{
  
    self.resultBlock = resultBlock;
  
    if(type == AlipayMethod){
        NSString * orderString = payInfo;
        self.payInfo = payInfo;//记录当前支付信息
        if(kStringNotEmpty(orderString) == NO){
            if(self.resultBlock){
                [self payEndWithDesc:@"支付参数错误" andPayResult:2 andOriginCode:-1 andResult:nil];
            }
            return ;
        }
      [[AlipaySDK defaultService] payOrder:orderString fromScheme:self.apliayCallBackSchema?:@"jure" callback:^(NSDictionary *resultDic) {
        /*没有安装支付宝客户端,在webview里面支付的回调*/
        [self checkAliPayResult:resultDic];
      }];
    }else if (type == WXPayMothod){
      
        if(![[UIApplication sharedApplication]canOpenURL:[NSURL URLWithString:@"weixin://"]]){
          PayResutl * result = [[PayResutl alloc] init];
          result.code = 4;
          result.msg = @"请安装微信后完成支付";
          result.sdkCode = 4;
          resultBlock(result);
          [JRLoadingAndToastTool showToast:@"请安装微信后完成支付" andDelyTime:0.5];
          return ;
        }
      
      NSDictionary *result  = payInfo;
      if (kDictNotEmpty(result) == NO) {
        if(self.resultBlock){
          [self payEndWithDesc:@"支付参数错误" andPayResult:1 andOriginCode:-1 andResult:nil];
        }
        return ;
      }
      
      [self configureWechatPayKeyWith:result[@"appid"]];
      //创建微信支付结构类
      PayReq* req = [[PayReq alloc] init];
      /** 商家向财付通申请的商家id */
      req.partnerId = [result objectForKey:@"partnerid"];
      /** 预支付订单 */
      req.prepayId = [result objectForKey:@"prepayid"];
      /** 随机串，防重发 */
      req.nonceStr = [result objectForKey:@"noncestr"];
      /** 时间戳，防重发 类型是 UInt32 */
      req.timeStamp = [[result objectForKey:@"timestamp"] intValue];
      /** 商家根据财付通文档填写的数据和签名 */
      req.package = [result objectForKey:@"package"];
      /** 商家根据微信开放平台文档对数据做的签名 */
      req.sign = [result objectForKey:@"sign"];
      BOOL callWechatClientSuccess = [WXApi sendReq:req];
      if (callWechatClientSuccess == NO) {
        [self payEndWithDesc:@"无法唤起微信支付" andPayResult:2 andOriginCode:-1 andResult: nil];
      }
    }
}


#pragma mark - 支付宝支付后的回调
- (void)checkAliPayResult:(NSDictionary *)result{
	
    if ([result[@"resultStatus"] integerValue] == 9000){
		
      [self payEndWithDesc:@"支付成功" andPayResult:0 andOriginCode:9000 andResult:result];
    
    } else if([result[@"resultStatus"] integerValue] == 4000){
        
        [self payEndWithDesc:@"订单支付失败" andPayResult:1 andOriginCode:4000 andResult:result];
        
    }else if([result[@"resultStatus"] integerValue] == 5000){
      
      [self payEndWithDesc:@"支付请求重复" andPayResult:1 andOriginCode:5000 andResult:result];
      
    }else if ([result[@"resultStatus"] integerValue] == 6001) {
        
        [self payEndWithDesc:@"支付取消" andPayResult:1 andOriginCode:6001 andResult:result];
        
    }else if([result[@"resultStatus"] integerValue] == 6002){
        
        [self payEndWithDesc:@"网络连接出错" andPayResult:1 andOriginCode:6002 andResult:result];
        
    }else if([result[@"resultStatus"] integerValue] == 6004){
      
      [self payEndWithDesc:@"支付结果未知" andPayResult:1 andOriginCode:6004 andResult:result];
      
    }else if([result[@"resultStatus"] integerValue] == 8000){
        
        [self payEndWithDesc:@"正在处理中，请查询商户订单列表中订单的支付状态" andPayResult:1 andOriginCode:8000 andResult:result];
      
    } else {
      
       [self payEndWithDesc:@"支付结果未知" andPayResult:1 andOriginCode:[result[@"resultStatus"] integerValue] andResult:result];
      
    }
}



//回调给外部支付结果
- (void)payEndWithDesc:(NSString *)resultDesc andPayResult:(NSInteger)resultCode andOriginCode:(NSInteger)originCode andResult:(NSDictionary *)resultDict{
    if(self.resultBlock){
      PayResutl * result = [[PayResutl alloc] init];
      result.code = resultCode;
      result.msg = resultDesc;
      result.sdkCode = originCode;
      result.aliPayResult = resultDict;
      self.resultBlock(result);
      self.resultBlock = nil;
    }
}



//处理支付回调
- (void)handleOpenUrl:(NSURL *)openUrl{
    if ([openUrl.host isEqualToString:@"safepay"]) {
        //跳转支付宝钱包进行支付，处理支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:openUrl standbyCallback:^(NSDictionary *resultDic) {
            [self checkAliPayResult:resultDic];
        }];
    }else{
        [WXApi handleOpenURL:openUrl delegate:self];
	}
}

#pragma mark - WXApiDelegate 微信支付后的回调处理
- (void)onResp:(BaseResp *)resp {
    if([resp isKindOfClass:[PayResp class]]){
      PayResp * result = (PayResp *)resp;
      if(result.errCode == WXSuccess){
        [self payEndWithDesc:@"支付成功" andPayResult:0 andOriginCode:result.errCode andResult:nil];
      }else if(result.errCode == WXErrCodeUserCancel){
        [self payEndWithDesc:@"支付取消" andPayResult:1 andOriginCode:result.errCode andResult:nil];
      } else {
        [self payEndWithDesc:@"支付未知错误" andPayResult:1 andOriginCode:result.errCode andResult:nil];
      }
    }
}


@end


@implementation PayResutl


@end



