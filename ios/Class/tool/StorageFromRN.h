//
//  StorageFromRN.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface StorageFromRN : NSObject
+(NSString *)getItem:(NSString *)key;

+(NSString *)getHost;

+(NSString *)getSG_Token;
/**
 公猫返回的key
 */
+(NSString *)getGongMao;
@end

NS_ASSUME_NONNULL_END
