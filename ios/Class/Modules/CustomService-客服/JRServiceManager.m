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

@property (nonatomic,strong) SuspensionBtn *suspensionBtn ;
@property (nonatomic,strong) SuspensionBtn * changeToSupplierBtn;

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
-(SuspensionBtn *)suspensionBtn{
  if(!_suspensionBtn){
    _suspensionBtn = [[SuspensionBtn alloc]initWithFrame:CGRectMake(0, KScreenHeight/2, 100, 40)];
    [_suspensionBtn setBackgroundImage:[UIImage imageNamed:@"rgongkf_icon"] forState:UIControlStateNormal];
    [_suspensionBtn addTarget:self action:@selector(changeToPlatformAction:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _suspensionBtn;
}
-(SuspensionBtn *)changeToSupplierBtn{
  if(!_changeToSupplierBtn){
    _changeToSupplierBtn = [[SuspensionBtn alloc]initWithFrame:CGRectMake(0, KScreenHeight/2, 100, 40)];
    [_changeToSupplierBtn setBackgroundImage:[UIImage imageNamed:@"SupplierBtn"] forState:UIControlStateNormal];
    [_changeToSupplierBtn addTarget:self action:@selector(changeToSupplierAction:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _changeToSupplierBtn;
}
-(void)changeToSupplierAction:(UIButton *)btn{
  if (self.preShopId && self.preShopId.length > 0) {
    [self.changeToSupplierBtn removeFromSuperview];
    [[UIApplication sharedApplication].delegate.window addSubview:self.suspensionBtn];
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
    [self.changeToSupplierBtn removeFromSuperview];
  }
}
//切换到平台客服
-(void)changeToPlatformAction:(UIButton *)btn{
  //暂存上个供应商数据
  [self.suspensionBtn removeFromSuperview];
  [[UIApplication sharedApplication].delegate.window addSubview:self.changeToSupplierBtn];
  self.preShopId = self.dataDic[@"shopId"];
  self.preTitle = self.dataDic[@"title"];
  self.preChatType = (NSInteger)self.dataDic[@"chatType"];
  
  [KRootVC dismissViewControllerAnimated:NO completion:^{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [self swichGroup:@{
                         @"title":@"平台客服",
                         @"shopId":@"",
                         @"chatType":@(BEGIN_FROM_OTHER),
                         @"data":self.dataDic[@"data"]
                         }];
    });
  }];
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
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  NSInteger allUnReadCount =  [[[QYSDK sharedSDK]conversationManager]allUnreadCount];
  [self.sessionListDic setObject:@(allUnReadCount) forKey:all_unread_count];
  NSArray * sessionList =  [[[QYSDK sharedSDK]conversationManager]getSessionList];
  [self postNoti:sessionList];
}

-(void)initActionConfig{
  QYCustomActionConfig  * actionConfig = [[QYSDK sharedSDK] customActionConfig];
  actionConfig.linkClickBlock = ^(NSString *linkAddress) {
    if (self.currentChatType == BEGIN_FROM_ORDER ||
        self.currentChatType == BEGIN_FROM_PRODUCT) {
      [self onBack:nil];
    }else{
      
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
  //暂存客服来源类型
  if ([chatInfo[@"chatType"] integerValue] == BEGIN_FROM_OTHER) {
    sessionVC.shopId=@"hzmrwlyxgs";
    [self.suspensionBtn removeFromSuperview];
  }else if([chatInfo[@"chatType"] integerValue] == BEGIN_FROM_PRODUCT){
    if (![chatInfo[@"shopId"] isEqualToString:@"hzmrwlyxgs"]) {
      [ [UIApplication sharedApplication].keyWindow addSubview:self.suspensionBtn];
    }
  }else if ([chatInfo[@"chatType"] integerValue] == BEGIN_FROM_ORDER){
    if (![chatInfo[@"shopId"] isEqualToString:@"hzmrwlyxgs"]) {
       [ [UIApplication sharedApplication].keyWindow addSubview:self.suspensionBtn];
    }
  }else{
    if (((NSString *)chatInfo[@"shopId"]).length > 0 ) {
      //存在供应商id说明链接的不是平台客服
    }else{
      
    }
  }
   self.currentChatType = [chatInfo[@"chatType"] integerValue];
  sessionVC.sessionTitle = chatInfo[@"title"];
  sessionVC.shopId = ((NSString *)chatInfo[@"shopId"]).length > 0 ?chatInfo[@"shopId"]:@"";
  //重置一下供应商的域名
  if ([chatInfo[@"chatType"] integerValue] == BEGIN_FROM_OTHER) {
    sessionVC.shopId= suspensionId;
  }
  sessionVC.commodityInfo = [self getCommodityMsgWithData:swichData];
  sessionVC.groupId = 0;
  sessionVC.staffId = 0;
  
  QYSource *source = [[QYSource alloc] init];
  source.title = chatInfo[@"title"];
  sessionVC.source = source;
  
  sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  JRBaseNavVC *nav = [[JRBaseNavVC alloc]initWithRootViewController:sessionVC];
  
  [KRootVC presentViewController:nav animated:NO completion:^{
    
  }];
}

-(void)changeKefu:(SuspensionButton *)btn{
  NSLog(@"aaaa");
  
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
  [self.suspensionBtn removeFromSuperview];
  self.suspensionBtn.centerY = KScreenHeight/2;
  [self.changeToSupplierBtn removeFromSuperview];
  self.changeToSupplierBtn.centerY = KScreenHeight/2;
  
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
    NSDictionary * session =  @{
                                @"hasTrashWords":@(sessionInfo.hasTrashWords),
                                @"lastMessageText":sessionInfo.lastMessageText,
                                @"lastMessageType":@(sessionInfo.lastMessageType),
                                @"unreadCount":@(sessionInfo.unreadCount),
                                @"status":@(sessionInfo.status),
                                @"lastMessageTimeStamp":@(lastTime),
                                @"shopId":sessionInfo.shopId,
                                @"avatarImageUrlString":sessionInfo.avatarImageUrlString,
                                @"sessionName":sessionInfo.sessionName,
                                };
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
