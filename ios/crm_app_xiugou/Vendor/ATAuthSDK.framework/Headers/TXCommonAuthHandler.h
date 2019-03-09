//
//  TXCommonAuthHandler.h
//  ATAuthSDK
//
//  Created by yangli on 15/03/2018.

#import <Foundation/Foundation.h>

@interface TXCommonAuthHandler : NSObject

/*
 * 函数名：getVersion
 * 参数：无
 * 返回：字符串，sdk版本号
 */
+ (NSString *_Nonnull)getVersion;

/*
 * 函数名：checkGatewayVerifyEnable
 * 参数：phoneNumber，手机号码，非必传，但双sim卡时必须传入待验证的手机号码！！
 * 返回：BOOL值，YES表示网关认证所需的蜂窝数据网络已开启，NO表示未开启，只有YES才能保障后续服务
 */
+ (BOOL)checkGatewayVerifyEnable:(NSString *)phoneNumber;

/*
 * 函数名：getAccessCodeWithComplete，默认超时时间3s
 * 参数：无
 * 返回：字典形式
 *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡
 *      accessCode：预取的编码
 *      msg：文案或错误提示
 */

+ (void)getAccessCodeWithComplete:(void (^_Nullable)(NSDictionary * _Nonnull resultDic))complete;

/*
 * 函数名：getAccessCodeWithTimeout
 * 参数：timeout：接口超时时间，单位ms，默认3000ms，值为0时采用默认超时时间
 * 返回：字典形式
 *      resultCode：6666-成功，5555-超时，4444-失败，3344-参数异常，2222-无网络，1111-无SIM卡
 *      accessCode：预取的编码
 *      msg：文案或错误提示
 */

+ (void)getAccessCodeWithTimeout:(NSTimeInterval )timeout complete:(void (^_Nullable)(NSDictionary * _Nonnull resultDic))complete;

@end
