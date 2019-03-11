//
//  TXSecurityUtils.h
//  ATAuthSDK
//
//  Created by yangli on 2018/12/6.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TXSecurityUtils : NSObject

+ (NSString *)encryptAES:(NSString *)content key:(NSString *)key;
+ (NSString *)decryptAES:(NSString *)content key:(NSString *)key;

+ (NSString *)encryptMD5:(NSString *)content;

@end

NS_ASSUME_NONNULL_END
