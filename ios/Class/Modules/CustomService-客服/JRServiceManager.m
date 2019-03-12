//
//  JRServiceManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRServiceManager.h"
#import <QYSDK.h>
@interface JRServiceManager()<QYConversationManagerDelegate>

@property(nonatomic,strong) QYSessionViewController *sessionVC;

@end

@implementation JRServiceManager
SINGLETON_FOR_CLASS(JRServiceManager)

-(void)qiYULogout{
  [[QYSDK sharedSDK]logout:nil];
}
/**
 * groupId:0,
 * staffId:0,
 * title:'七鱼金融',
 * userId:用户id
 * userIcon:用户头像,
 * phoneNum:用户手机号,
 * nickName:用户名称,
 * device:手机型号
 * systemVersion:手机系统版本
 */
-(void)qiYUChat:(id)josnData{
  NSDictionary *jsonDic = josnData;
  QYSource *source = [[QYSource alloc] init];
  source.title =  jsonDic[@"title"];
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
  self.sessionVC.sessionTitle = jsonDic[@"title"];
  self.sessionVC.source = source;
  
  self.sessionVC.groupId = [jsonDic[@"groupId"] integerValue];
  self.sessionVC.staffId = [jsonDic[@"staffId"] integerValue];
  
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
  }
  
  [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  JRBaseNavVC *nav =[[JRBaseNavVC alloc] initWithRootViewController:self.sessionVC];
  self.sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  [KRootVC presentViewController:nav animated:YES completion:nil];
}
-(void)startServiceWithGroupId:(int64_t)groupId andStaffId:(int64_t)staffId andTitle:(NSString *)title{
  QYSource *source = [[QYSource alloc] init];
  source.title =  title;
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
  self.sessionVC.sessionTitle = title;
  self.sessionVC.source = source;
  
  self.sessionVC.groupId = groupId;
  self.sessionVC.groupId = staffId;
  
  JRBaseNavVC *nav =[[JRBaseNavVC alloc] initWithRootViewController:self.sessionVC];
  self.sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  [KRootVC presentViewController:nav animated:YES completion:nil];
}
- (void)onBack:(id)sender
{
  [KRootVC dismissViewControllerAnimated:self.sessionVC completion:nil];
}
-(QYSessionViewController *)sessionVC{
  if (!_sessionVC) {
    _sessionVC = [[QYSDK sharedSDK]sessionViewController];
    _sessionVC.groupId = 0;
    _sessionVC.staffId = 0;
  }
  return _sessionVC;
}
-(void)onCleanCache{
  [[QYSDK sharedSDK] cleanResourceCacheWithBlock:nil];
}
#pragma QYConversationManagerDelegate
/**
 *  会话未读数变化
 *
 *  @param count 未读数
 */
- (void)onUnreadCountChanged:(NSInteger)count{
}
/**
 *  会话列表变化；非平台电商用户，只有一个会话项，平台电商用户，有多个会话项
 */
- (void)onSessionListChanged:(NSArray<QYSessionInfo*> *)sessionList{
}
/**
 *  收到消息
 */
- (void)onReceiveMessage:(QYMessageInfo *)message{
  
}
-(NSString *)arrToJsonString:(NSArray *)arr{
    NSData *data = [NSJSONSerialization dataWithJSONObject:self
                                                   options:NSJSONReadingMutableLeaves | NSJSONReadingAllowFragments
                                                     error:nil];
    
    if (data == nil) {
      return nil;
    }
    NSString *string = [[NSString alloc] initWithData:data
                                             encoding:NSUTF8StringEncoding];
    return string;
}

@end
