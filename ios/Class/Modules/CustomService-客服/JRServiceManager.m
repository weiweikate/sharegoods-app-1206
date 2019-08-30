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
#import <SandBoxPreviewTool/SuspensionButton.h>
#import "SuspensionBtn.h"
#import "NetWorkTool.h"

#define all_unread_count @"unreadCount"
#define sessionListData  @"sessionListData"
#define suspensionId  @"hzmrwlyxgs"


@interface JRServiceManager()<QYConversationManagerDelegate>

@property (nonatomic,strong) NSDictionary * dataDic;
@property(nonatomic,strong) QYSessionViewController *sessionVC;
@property (nonatomic,strong) JRBaseNavVC * QYNavVC;

@property (nonatomic,strong) NSMutableDictionary * sessionListDic;

//当前视图弹出来源类型
@property (nonatomic,assign)  CHAT_TYPE currentChatType;
//
@property (nonatomic,copy) NSString * preShopId;
@property (nonatomic,copy) NSString * preTitle;
@property (nonatomic,assign) CHAT_TYPE  preChatType;
@property (nonatomic,assign) BOOL  isVip;

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

-(void)changeToSupplierAction:(UIButton *)btn{
  if (self.preShopId && self.preShopId.length > 0) {
    NSMutableDictionary *dic = [self.dataDic mutableCopy];
    dic[@"title"] = self.preTitle;
    dic[@"shopId"] = self.preShopId;
    [KRootVC dismissViewControllerAnimated:NO completion:^{
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self swichGroup:@{
                           @"title":self.preTitle,
                           @"shopId":self.preShopId,
                           @"chatType":@(self.preChatType),
                           @"data":@{}
                           }];
      });
    }];
  }else{
    [JRLoadingAndToastTool showToast:@"暂不可直接切换到供应商客服~可在我的页面客服发起" andDelyTime:1];
  }
}

-(void)connetMerchant:(NSString *)code
{
  if (!code) {
    return;
  }
  __block JRServiceManager* weakSelf = self;
  [NetWorkTool requestWithURL:ChatApi_ShopInfoBySupplierCode params:@{@"supplierCode": code} toModel:nil success:^(NSDictionary* result) {
    if (result[@"shopId"]&& ![result[@"shopId"] isEqualToString:suspensionId]) {
      weakSelf.preTitle = result[@"title"] ? result[@"title"]: @"商家";
      weakSelf.preShopId = result[@"shopId"];
      [self changeToSupplierAction:nil];
    }
  } failure:^(NSString *msg, NSInteger code) {
    
  } showLoading:@""];
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
  [self initActionConfig];
  QYUserInfo * userInfo = [self packingUserInfo:jsonData];
  self.isVip = [jsonData[@"isVip"] boolValue] ?YES:NO;

  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  NSInteger allUnReadCount =  [[[QYSDK sharedSDK]conversationManager]allUnreadCount];
  [self.sessionListDic setObject:@(allUnReadCount) forKey:all_unread_count];
  NSArray * sessionList =  [[[QYSDK sharedSDK]conversationManager]getSessionList];
  [self postNoti:sessionList];
}

-(void)initActionConfig{
  QYCustomActionConfig  * actionConfig = [[QYSDK sharedSDK] customActionConfig];
  actionConfig.eventClickBlock = ^(NSString *eventName, NSString *eventData, NSString *messageId) {
    if ([eventName isEqualToString:@"QYEventNameTapCommodityInfo"]) {
      NSDictionary *urlData;
      if ([eventData containsString:@"http"]) {
        urlData = @{@"card_type":@(PRODUCT_CARD), @"linkUrl":eventData};
      }else{
        urlData = @{@"card_type":@(ORDER_CARD), @"linkUrl":eventData};
      }
      [self onBack:nil];
      [[NSNotificationCenter defaultCenter]postNotificationName:QY_CARD_CLICK object:urlData];
    }else if ([eventName isEqualToString:@"QYEventNameTapLabelLink"]){
      if ([eventData containsString:@"h5.sharegoodsmall.com/product"] && [eventData containsString:@"http"])
      {
          NSDictionary *urlData = @{@"card_type":@(PRODUCT_CARD), @"linkUrl":eventData};
        [self onBack:nil];
         [[NSNotificationCenter defaultCenter]postNotificationName:QY_CARD_CLICK object:urlData];
      }else if([eventData containsString:@"http"]){
        NSDictionary * urlData = @{@"card_type":@(LINK_CLICK),@"linkUrl":eventData};
        [self onBack:nil];
        [[NSNotificationCenter defaultCenter]postNotificationName:QY_CARD_CLICK object:urlData];
      }
    }
  };
}

/**
 客服切换函数
 @param swichData RN传递过来的 商品/订单 信息
 */
-(void)swichGroup:(id)swichData{
   NSDictionary * chatInfo = swichData;
   self.dataDic = chatInfo;//暂存来的数据
  QYSessionViewController * sessionVC = [[QYSDK sharedSDK] sessionViewController];
  
  sessionVC.vipLevel = self.isVip?11:0;
  
  self.currentChatType = [chatInfo[@"chatType"] integerValue];
  sessionVC.sessionTitle = chatInfo[@"title"];
  sessionVC.shopId = ((NSString *)chatInfo[@"shopId"]).length > 0 ?chatInfo[@"shopId"]:suspensionId;
  //重置一下供应商的域名
  if ([chatInfo[@"chatType"] integerValue] == BEGIN_FROM_OTHER) {
    sessionVC.shopId= suspensionId;
  }
  sessionVC.commodityInfo = [self getCommodityMsgWithData:swichData];
  sessionVC.groupId = 0;
  sessionVC.staffId = 0;
  
  QYSource *source = [[QYSource alloc] init];
  source.title = chatInfo[@"title"];
  sessionVC.sessionTitle = chatInfo[@"title"];
  sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  JRBaseNavVC *nav = [[JRBaseNavVC alloc]initWithRootViewController:sessionVC];
  
  [KRootVC presentViewController:nav animated:NO completion:^{
    
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
  [self postNoti:sessionList];
}
//组装数据并发送通知
-(void)postNoti:(NSArray *)sessionList{
  //将所有回话列表进行组装并传递给原生
  NSMutableArray * sessionListDataArr = [NSMutableArray array];
  
  for (NSInteger index = 0 ; index < sessionList.count; index++) {
    QYSessionInfo * sessionInfo = sessionList[index];
    long long lastTime = (long long)sessionInfo.lastMessageTimeStamp;
    NSMutableDictionary *session = [NSMutableDictionary dictionary];
    [session setValue:@(sessionInfo.hasTrashWords) forKey:@"hasTrashWords"];
    [session setValue:sessionInfo.lastMessageText forKey:@"lastMessageText"];
    [session setValue:@(sessionInfo.lastMessageType) forKey:@"lastMessageType"];
    [session setValue:@(sessionInfo.unreadCount) forKey:@"unreadCount"];
    [session setValue:@(sessionInfo.status) forKey:@"status"];
    [session setValue:@(lastTime) forKey:@"lastMessageTimeStamp"];
    [session setValue:sessionInfo.shopId forKey:@"shopId"];
    [session setValue:sessionInfo.avatarImageUrlString forKey:@"avatarImageUrlString"];
    [session setValue:sessionInfo.sessionName forKey:@"sessionName"];
    NSLog(@"%@",session);
    [sessionListDataArr addObject:session];
  }
  
  [self.sessionListDic setObject:sessionListDataArr forKey:sessionListData];

  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter]postNotificationName:QY_MSG_CHANGE object:self.sessionListDic];
  });
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
