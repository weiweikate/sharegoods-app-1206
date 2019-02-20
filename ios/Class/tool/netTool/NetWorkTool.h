//
//  NetWorkTool.h
//  MessageModel
//
//  Created by 胡超 on 2018/9/15.
//  Copyright © 2018年 胡超. All rights reserved.
///  模拟网络请求

#import <Foundation/Foundation.h>
#import "XG_Api.h"
typedef void (^SuccessBlock)(id result);
typedef void (^AFErrorBlock)(NSString *msg, NSInteger code);
@interface NetWorkTool : NSObject

+ (void)requestWithURL:(NSString *)url
            params:(NSDictionary *)parmas
               toModel:(Class) modelClass
           success:(SuccessBlock)successBlock
           failure:(AFErrorBlock)errorBlock
       showLoading:(NSString *)showLoading;
@end
