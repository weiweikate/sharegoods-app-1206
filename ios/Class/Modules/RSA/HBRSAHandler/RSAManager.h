//
//  RSAManager.h
//  crm_app_xiugou
//
//  Created by Max on 2018/11/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RSAManager : NSObject
SINGLETON_FOR_HEADER(RSAManager)

-(NSString *)signSHA1String:(NSString *)string;

-(NSString *)signMD5String:(NSString *)string;
@end

NS_ASSUME_NONNULL_END
