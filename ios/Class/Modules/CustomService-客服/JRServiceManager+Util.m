//
//  JRServiceManager+Util.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/26.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "JRServiceManager+Util.h"

@implementation JRServiceManager (Util)

/**
 组装七鱼用户信息函数

 @param jsonData RN端传递过来的json对象
 @return 返回QYUserInfo 对象
 */
-(QYUserInfo *)packingUserInfo:(id)jsonData{
  
  NSDictionary *jsonDic = jsonData;
  
  QYUserInfo *userInfo = [[QYUserInfo alloc] init];
  userInfo.userId = jsonDic[@"userId"];
  NSMutableArray *array = [NSMutableArray new];
  
  NSMutableDictionary *dictRealName = [NSMutableDictionary new];
  [dictRealName setObject:@"real_name" forKey:@"key"];
  [dictRealName setObject:jsonDic[@"nickName"]?jsonDic[@"nickName"]:@"" forKey:@"value"];
  [array addObject:dictRealName];
  
  NSMutableDictionary *dictMobilePhone = [NSMutableDictionary new];
  [dictMobilePhone setObject:@"mobile_phone" forKey:@"key"];
  [dictMobilePhone setObject:jsonDic[@"phoneNum"]?jsonDic[@"phoneNum"]:@"" forKey:@"value"];
  [dictMobilePhone setObject:@(NO) forKey:@"hidden"];
  [array addObject:dictMobilePhone];
  
  NSMutableDictionary *dictavatar = [NSMutableDictionary new];
  [dictavatar setObject:@"avatar" forKey:@"key"];
  [dictavatar setObject:jsonDic[@"userIcon"]?jsonDic[@"userIcon"]:@"" forKey:@"value"];
  [array addObject:dictavatar];
  
  NSMutableDictionary *dictphoneNum = [NSMutableDictionary new];
  [dictphoneNum setObject:@"phoneNum" forKey:@"key"];
  [dictphoneNum setObject:jsonDic[@"phoneNum"]?jsonDic[@"phoneNum"]:@"" forKey:@"value"];
  [array addObject:dictphoneNum];
  
  NSMutableDictionary *dictSystemVersion = [NSMutableDictionary new];
  [dictSystemVersion setObject:@"systemVersion" forKey:@"key"];
  [dictSystemVersion setObject:jsonDic[@"systemVersion"]?jsonDic[@"systemVersion"]:@"" forKey:@"value"];
  [array addObject:dictSystemVersion];
  
  NSMutableDictionary *appVersion = [NSMutableDictionary new];
  [appVersion setObject:@"appVersion" forKey:@"key"];
  [appVersion setObject:kAppVersion forKey:@"value"];
  [array addObject:dictSystemVersion];
  
  NSData *data = [NSJSONSerialization dataWithJSONObject:array
                                                 options:0
                                                   error:nil];
  
  if (data) {
    userInfo.data = [[NSString alloc] initWithData:data
                                          encoding:NSUTF8StringEncoding];
  }else{
    userInfo.data = nil;
  }
  
  return userInfo;
}

@end
