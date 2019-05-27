//
//  NSString+UrlAddParams.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (UrlAddParams)
-(NSString *)urlAddCompnentForValue:(NSString *)value key:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
