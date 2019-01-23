//
//  NSDictionary+Util.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSDictionary (Util)
+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString;
@end

NS_ASSUME_NONNULL_END
