//
//  JRPay 飓热支付模块
//
//  Copyright © 2018年 nuomi. All rights reserved.
/*
 集成说明：
 微信文档：https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=1417694084&token=&lang=zh_CN
 微信开放平台新增了微信模块用户统计功能，便于开发者统计微信功能模块的用户使用和活跃情况。开发者需要在工程中链接上:SystemConfiguration.framework, libz.dylib, libsqlite3.0.dylib, libc++.dylib, Security.framework, CoreTelephony.framework, CFNetwork.framework，
 
 支付宝文档：https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7629140.0.0.9j59HG&treeId=204&articleId=105295&docType=1
 支付宝请求参数：https://docs.open.alipay.com/204/105465/
 支付宝返回参数：https://docs.open.alipay.com/204/105301/
 支付宝常见错误码 version:15.5.0  motify:2017.10.24
   原始错误码  原始错误语义
 a.4000	订单支付失败
 b.5000	重复请求
 c.6001	用户中途取消
 d.6002	网络连接出错
 e.6004	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 f.8000	正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 g.9000	订单支付成功
 h.其它	其它支付错误
 
  原始错误码  原始错误语义
 a.4000  订单支付失败
 b.5000  重复请求
 c.6001  用户中途取消
 d.6002  网络连接出错
 e.6004  支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 f.8000  正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 g.9000  订单支付成功
 h.其它  其它支付错误
 
 支付流程总结：
 1.支付宝支付时,当前设备如果没有安装支付宝客户端,则通过支付宝webView进行支付的。相关回调结果，直接在回调函数里面出现。
 2.微信支付时，当前设备如果没有安装客户端，则无法进行微信支付。需要提醒用户下载微信
 3.微信支付结果，只能在openurl函数里面获取
 4.如果是跳转到支付宝客户端支付，支付结果也只能在openurl函数里面获取
 5.支付宝支付成功以后，会自动跳回到本应用，如果apliayCallBackSchema 设置成功的情况下。
 6.如果apliayCallBackSchema设置错误，或者支付宝支付成功，但尚未自动跳转到本应用时，用户直接点击支付宝应用左上角回到本应用时，亦或者微信支付同样的操作时，都无法获知本支付是否支付成功。
 */


#import <Foundation/Foundation.h>

@class PayResutl;
//支付方式
typedef NS_ENUM(NSInteger, PayMethodType) {
    AlipayMethod, //支付宝支付
    WXPayMothod   //微信支付
};
typedef void(^ResultBlock)(PayResutl * payResutl);


@interface JRPay : NSObject

//设置支付宝支付后的回跳本应用的Schema
@property (nonatomic, copy) NSString * apliayCallBackSchema;

//单例
+ (instancetype)sharedPay;

//配置微信支付必须的key
- (void)configureWechatPayKeyWith:(NSString *)appid;

/**
 *  发起支付
 *  @param type        支付方式
 *  @param payInfo     支付参数信息,支付宝传入字符串,微信传入字典
 *  @param resultBlock 支付结果的回调
 *  isPayOK  支付是否成功
 *  resultDesc  支付结果的描述信息,多用于失败或成功后的提示语句
 */
- (void)payWithPayMethod:(PayMethodType)type andPayInfo:(id)payInfo andComplete:(ResultBlock) resultBlock;

//处理支付后的回调信息
- (void)handleOpenUrl:(NSURL *)openUrl;

@end


@interface PayResutl : NSObject

@property (nonatomic, assign) NSInteger code;   //支付结果码（可枚举）
@property (nonatomic, assign) NSInteger sdkCode;//sdk返回的支付结果码 对应各个支付平台
@property (nonatomic, copy) NSString * msg;     //支付结果描述（已经过内部转义）
@property (nonatomic, strong) NSDictionary * aliPayResult;     //支付结果

@end
