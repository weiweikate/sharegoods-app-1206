//
//  NetWorkTool.m
//  MessageModel
//
//  Created by 胡超 on 2018/9/15.
//  Copyright © 2018年 胡超. All rights reserved.
//

#import "NetWorkTool.h"
#import <AFNetworking.h>
#import "MBProgressHUD+PD.h"
#import "StorageFromRN.h"
#import <YYKit.h>
#import "NSDictionary+Util.h"
#import "BGKeychainTool.h"

#define kTimeOutInterval 10

@implementation NetWorkTool
+(AFHTTPSessionManager *)manager{
    static AFHTTPSessionManager *manager;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        manager=[AFHTTPSessionManager manager];
        manager.responseSerializer.acceptableContentTypes =[NSSet setWithObjects:@"application/json",@"text/json",@"text/javascript",@"text/html",@"text/plain",nil];
        
        [manager.requestSerializer willChangeValueForKey:@"timeoutInterval"];
        
        manager.requestSerializer.timeoutInterval = kTimeOutInterval;
        
        [manager.requestSerializer didChangeValueForKey:@"timeoutInterval"];
      
      NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
      // app版本
      NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
      NSString *systemVersion = [UIDevice currentDevice].systemVersion;
      manager.requestSerializer = [AFJSONRequestSerializer serializer];
      
      [manager.requestSerializer setValue:@"appstore"
                       forHTTPHeaderField:@"channel"];
      
      [manager.requestSerializer setValue:[NSString stringWithFormat:@"ios%@",systemVersion]
                       forHTTPHeaderField:@"platform"];
      
      [manager.requestSerializer setValue:app_Version
                       forHTTPHeaderField:@"version"];
      
      [manager.requestSerializer setValue:@"SIGNATURE"
                       forHTTPHeaderField:@"Security-Policy"];
      
      [manager.requestSerializer setValue:[BGKeychainTool getDeviceIDInKeychain]
                       forHTTPHeaderField:@"device"];
      
    });
    
    return manager;
    
}

+ (void)requestWithURL:(NSString *)url
                params:(NSDictionary *)parmas
               toModel:(Class) modelClass
               success:(SuccessBlock)successBlock
               failure:(AFErrorBlock)errorBlock
           showLoading:(NSString *)showLoading
{
  NSString * path = [StorageFromRN getHost];
  [[self manager].requestSerializer setValue:@"" forHTTPHeaderField:@"sg-token"];
    NSArray<NSString *> * arr = [url componentsSeparatedByString:@"@"];
    NSString * URL = [NSString stringWithFormat:@"%@%@",path,arr.firstObject];
    if ([[arr.lastObject uppercaseString] isEqualToString:@"GET"]) {
        [self GETWithURL:URL params:parmas toModel:modelClass success:successBlock failure:errorBlock showLoading:showLoading];
    }else{
        [self POSTWithURL:URL params:parmas toModel:modelClass success:successBlock failure:errorBlock showLoading:showLoading];
    }
}

+ (void)GETWithURL:(NSString *)url
            params:(NSDictionary *)parmas
           toModel:(Class) modelClass
           success:(SuccessBlock)successBlock
           failure:(AFErrorBlock)errorBlock
       showLoading:(NSString *)showLoading
{
    MBProgressHUD *hub = nil;
    if (showLoading) {
        hub = [MBProgressHUD showMessage:showLoading];
    }
 [[NetWorkTool manager] GET:url parameters:parmas progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (showLoading) {
            [hub hideAnimated:YES];
        }
        NSInteger code = [responseObject[@"code"] integerValue];
        switch (code) {
            case 10000:
            { ///成功就返回结果
                id model = nil;
                id data = responseObject[@"data"];
                 NSLog(@"请求结果：\n%@",data);
                if (modelClass != nil) {
                    if ([data isKindOfClass:[NSArray class]]) {
                        model = [NSArray modelArrayWithClass:modelClass json:data];
                    }else{
                        model = [modelClass modelWithJSON:data];
                    }
                  successBlock(model);
                }else{
                  successBlock(data);
                }
                break;
            }
//            case -2:
//            { ///用户信息失效
//                 NSLog(@"请求结果：\n用户信息失效");
//                errorBlock(responseObject[@"msg"], code);
//                break;
//            }

            default:///其他情况返回error
                NSLog(@"请求结果：\n%@",responseObject[@"msg"]);
                errorBlock(responseObject[@"msg"], code);
                break;
        }

    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (showLoading) {
            [hub hideAnimated:YES];
        }
        errorBlock(@"网络链接异常，请检查您的网络", 1);
    }];
}


+ (void)POSTWithURL:(NSString *)url
            params:(NSDictionary *)parmas
           toModel:(Class) modelClass
           success:(SuccessBlock)successBlock
           failure:(AFErrorBlock)errorBlock
       showLoading:(NSString *)showLoading
{
    MBProgressHUD *hub = nil;
    if (showLoading) {
        hub = [MBProgressHUD showMessage:showLoading];
    }
    [[NetWorkTool manager] POST:url parameters:parmas progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (showLoading) {
            [hub hideAnimated:YES];
        }
        NSInteger code = [responseObject[@"code"] integerValue];
        NSLog(@"================%@请求=====================\n\n%@\n\n",url,parmas);
        switch (code) {
            case 10000:
            { ///成功就返回结果
                id model = nil;
                id data = responseObject[@"data"];
                NSLog(@"请求结果：\n%@",data);
                if (modelClass != nil) {
                    if ([data isKindOfClass:[NSArray class]]) {
                        model = [NSArray modelArrayWithClass:modelClass json:data];
                    }else{
                        model = [modelClass modelWithJSON:data];
                    }
                    successBlock(model);
                }else{
                    successBlock(data);
                }
                break;
            }
//            case -2:
//            { ///用户信息失效
//                 NSLog(@"请求结果：\n用户信息失效");
//                errorBlock(responseObject[@"msg"], code);
//                break;
//            }
                
            default:///其他情况返回error
                NSLog(@"请求结果：\n%@",responseObject[@"msg"]);
                errorBlock(responseObject[@"msg"], code);
                break;
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (showLoading) {
            [hub hideAnimated:YES];
        }
        errorBlock(@"网络链接异常，请检查您的网络", 1);
    }];
}

@end
