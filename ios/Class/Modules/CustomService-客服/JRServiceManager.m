//
//  JRServiceManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRServiceManager.h"
#import <QYSDK.h>
#import "JRServiceManager+Util.h"
@interface JRServiceManager()<QYConversationManagerDelegate>

@property(nonatomic,strong) QYSessionViewController *sessionVC;
@property (nonatomic,strong) JRBaseNavVC * QYNavVC;

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
-(void)initQYChat:(id)jsonData{
  
  QYUserInfo * userInfo = [self packingUserInfo:jsonData];
  [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  NSDictionary *jsonDic = jsonData;
  QYSource *source = [[QYSource alloc] init];
  source.title =  jsonDic[@"title"];
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
}

/**
 客服切换函数
 @param swichData RN传递过来的 商品/订单 信息
 */
-(void)swichGroup:(id)swichData{
  
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
  
  //1802229  专员
  //264002225  组id
  
  self.sessionVC.groupId = [jsonDic[@"groupId"] integerValue];
  self.sessionVC.staffId = [jsonDic[@"staffId"] integerValue];
  
  JRBaseNavVC *nav =[[JRBaseNavVC alloc] initWithRootViewController:self.sessionVC];
  self.sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  
//  self.sessionVC.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"链接客服" style:UIBarButtonItemStylePlain
//                                                                                     target:self action:@selector(onBack:)];
  
  [KRootVC presentViewController:nav animated:YES completion:nil];
}

- (void)onBack:(id)sender
{
  [KRootVC dismissViewControllerAnimated:self.sessionVC completion:nil];
}
-(void)sendMsg{
  QYCommodityInfo *commodityInfo = [[QYCommodityInfo alloc] init];
  commodityInfo.title = @"网易七鱼";
  commodityInfo.desc = @"网易七鱼是网易旗下一款专注于解决企业与客户沟通的客服系统产品。";
  commodityInfo.pictureUrlString = @"http://qiyukf.com/main/res/img/index/barcode.png";
  commodityInfo.urlString = @"http://qiyukf.com/";
  commodityInfo.note = @"￥10000";
  commodityInfo.show = YES;
  [self.sessionVC sendCommodityInfo:commodityInfo];
}
-(QYSessionViewController *)sessionVC{
  if (!_sessionVC) {
    _sessionVC = [[QYSDK sharedSDK]sessionViewController];
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
