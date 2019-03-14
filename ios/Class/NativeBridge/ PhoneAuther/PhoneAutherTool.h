//
//  PhoneAutherTool.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PhoneAutherTool : NSObject

+(BOOL)isCanPhoneAuthen;

+(void)startPhoneAutherWithPhoneNum:(NSString *)phoneNum andFinshBlock:(void (^)(NSDictionary * resultDic))finshBlock;
@end

NS_ASSUME_NONNULL_END
