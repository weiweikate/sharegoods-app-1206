//
//  JRServiceManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRServiceManager.h"
#import <QYSDK.h>
#import <QYPOPSDK.h>
#import "JRServiceManager+Util.h"
#import "JRServiceBridge.h"

#define all_unread_count @"unreadCount"
#define sessionListData  @"sessionListData"

@interface JRServiceManager()<QYConversationManagerDelegate>

@property(nonatomic,strong) QYSessionViewController *sessionVC;
@property (nonatomic,strong) JRBaseNavVC * QYNavVC;

@property (nonatomic,strong) NSMutableDictionary * sessionListDic;

@end

@implementation JRServiceManager
SINGLETON_FOR_CLASS(JRServiceManager)

-(void)qiYULogout{
  [[QYSDK sharedSDK]logout:nil];
}


-(NSMutableDictionary *)sessionListDic{
  if (!_sessionListDic) {
    _sessionListDic = [NSMutableDictionary new];
  }
  return _sessionListDic;
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
-(void)initQYChat:(id)jsonData{
  QYUserInfo * userInfo = [self packingUserInfo:jsonData];
  [[QYSDK sharedSDK] setUserInfo:userInfo];
     QYSource *source = [[QYSource alloc] init];
     source.title =  @"秀购客服";
//     source.urlString = @"https://8.163.com/";
     self.sessionVC.source = source;
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
}

/**
 客服切换函数
 @param swichData RN传递过来的 商品/订单 信息
 */
-(void)swichGroup:(id)swichData{
   NSDictionary * chatInfo = swichData;
  
  QYSessionViewController * sessionVC = [[QYSDK sharedSDK] sessionViewController];
  sessionVC.shopId = chatInfo[@"shopId"];
  sessionVC.commodityInfo = [self getCommodityMsgWithData:swichData];
  sessionVC.autoSendInRobot = YES;//机器人模式下同样发送
  
  sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  JRBaseNavVC *nav = [[JRBaseNavVC alloc]initWithRootViewController:sessionVC];
  [KRootVC presentViewController:nav animated:YES completion:^{
    
  }];
}


//device = "iPhone X";
//groupId = 0;
//nickName = "\U80e1\U7389\U5cf0";
//phoneNum = 18768435263;
//staffId = 0;
//systemVersion = "12.1";
//title = "\U79c0\U8d2d\U5ba2\U670d";
//userIcon = "https://cdn.sharegoodsmall.com/sharegoods/8f1c8726c7864dbb9fa30f3c5dfd4914.png";
//userId = 1495323;

-(void)qiYUChat:(id)josnData{

   QYUserInfo * userInfo = [self packingUserInfo:josnData];
   [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  NSDictionary *jsonDic = josnData;
  QYSource *source = [[QYSource alloc] init];
  source.title =  jsonDic[@"title"];
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
  self.sessionVC.sessionTitle = jsonDic[@"title"];
  self.sessionVC.source = source;
  
  self.sessionVC.groupId = [jsonDic[@"groupId"] integerValue];
  self.sessionVC.staffId = [jsonDic[@"staffId"] integerValue];
  
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

-(void)onCleanCache{
  [[QYSDK sharedSDK] cleanResourceCacheWithBlock:nil];
}
#pragma QYConversationManagerDelegate
/**
 *  会话未读数变化
 *  @param count 未读数
 */
- (void)onUnreadCountChanged:(NSInteger)count{
  [self.sessionListDic setObject:@(count) forKey:all_unread_count];
}
/**
 *  会话列表变化；非平台电商用户，只有一个会话项，平台电商用户，有多个会话项
 */
- (void)onSessionListChanged:(NSArray<QYSessionInfo*> *)sessionList{
//  NSLog(@"%@",sessionList);
  //将所有回话列表进行组装并传递给原生
  NSMutableArray * sessionListDataArr = [NSMutableArray array];
  
  for (NSInteger index = 0 ; index < sessionList.count; index++) {
    QYSessionInfo * sessionInfo = sessionList[index];
    NSDictionary * session =  @{
                                @"hasTrashWords":@(sessionInfo.hasTrashWords),
                                @"lastMessageText":sessionInfo.lastMessageText,
                                @"lastMessageType":@(sessionInfo.lastMessageType),
                                @"unreadCount":@(sessionInfo.unreadCount),
                                @"status":@(sessionInfo.status),
                                @"lastMessageTimeStamp":@(sessionInfo.lastMessageTimeStamp),
                                @"shopId":sessionInfo.shopId,
                                @"avatarImageUrlString":sessionInfo.avatarImageUrlString,
                                @"sessionName":sessionInfo.sessionName,
                                };
    [sessionListDataArr addObject:session];
  }
  
  [self.sessionListDic setObject:sessionListDataArr forKey:sessionListData];
  
  dispatch_async(dispatch_get_main_queue(), ^{
   [[NSNotificationCenter defaultCenter]postNotificationName:QY_MSG_CHANGE object:self.sessionListDic];
  });
  
}
///**
// *  收到消息
// */
//- (void)onReceiveMessage:(QYMessageInfo *)message{
//
//}
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
