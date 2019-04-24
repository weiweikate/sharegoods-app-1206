//
//  TXCommonAuthHandler.h
//  ATAuthSDK
//
//  Created by yangli on 15/03/2018.

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "TXCustomModel.h"

@interface TXCommonAuthHandler : NSObject

/*
 * 函数名：sharedInstance
 * 参数：无
 * 返回：单例
 */
+ (instancetype _Nonnull )sharedInstance;

/*
 * 函数名：getVersion
 * 参数：无
 * 返回：字符串，sdk版本号
 */
- (NSString *_Nonnull)getVersion;

/*
 * 函数名：checkGatewayVerifyEnable
 * 参数：phoneNumber，手机号码，非必传，号码认证且双sim卡时必须传入待验证的手机号码！！，一键登录时设置为nil即可
 * 返回：BOOL值，YES表示网关认证所需的蜂窝数据网络已开启，NO表示未开启，只有YES才能保障后续服务
 */
- (BOOL)checkGatewayVerifyEnable:(NSString *_Nullable)phoneNumber;

/*
 * 函数名：getAuthTokenWithComplete，默认超时时间3.0s
 * 参数：无
 * 返回：字典形式
 *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡
 *      token：号码认证token
 *      msg：文案或错误提示
 */

- (void)getAuthTokenWithComplete:(void (^_Nullable)(NSDictionary * _Nonnull resultDic))complete;

/*
 * 函数名：getAuthTokenWithTimeout
 * 参数：timeout：接口超时时间，单位s，默认3.0s，值为0.0时采用默认超时时间
 * 返回：字典形式
 *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡
 *      token：号码认证token
 *      msg：文案或错误提示
 */

- (void)getAuthTokenWithTimeout:(NSTimeInterval )timeout complete:(void (^_Nullable)(NSDictionary * _Nonnull resultDic))complete;

/*
 * 函数名：getLoginTokenWithTimeout
 * 参数：
   vc：当前vc容器，用于一键登录授权页面切换
   model：自定义授权页面选项，可为nil，采用默认的授权页面
   timeout：接口超时时间，单位s，默认3.0s，值为0.0时采用默认超时时间
 * 返回：字典形式
 *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡，6668-登录按钮事件，6669-切换账号事件
 *      token：一键登录token
 *      msg：文案或错误提示
 */

- (void)getLoginTokenWithController:(UIViewController *_Nonnull)vc model:(TXCustomModel *_Nullable)model timeout:(NSTimeInterval )timeout complete:(void (^_Nullable)(NSDictionary * _Nonnull resultDic))complete;

@end
