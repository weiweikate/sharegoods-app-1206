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

+ (NSURLSessionDataTask *)dowmload:(NSString *)url
                        parameters:(nullable id)parameters
                          progress:(nullable void (^)(NSProgress *downloadProgress))downloadProgress
                           success:(nullable void (^)(NSURLSessionDataTask *task, id _Nullable responseObject))success
                           failure:(nullable void (^)(NSURLSessionDataTask * _Nullable task, NSError *error))failure;
@end
