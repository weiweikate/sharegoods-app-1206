//
//  JRServiceManager+Util.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/26.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "JRServiceManager+Util.h"

#define sendBtnTitl @"发送宝贝"




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


/**
 组装消息类
 chatType = 0;
 data =     {
 desc = "\U7f51\U6613\U4e03\U9c7c\U662f\U7f51\U6613\U65d7\U4e0b\U4e00\U6b3e\U4e13\U6ce8\U4e8e\U89e3\U51b3\U4f01\U4e1a\U4e0e\U5ba2\U6237\U6c9f\U901a\U7684\U5ba2\U670d\U7cfb\U7edf\U4ea7\U54c1\U3002";
 note = "\Uffe510000";
 pictureUrlString = "http://qiyukf.com/main/res/img/index/barcode.png";
 title = "\U7f51\U6613\U4e03\U9c7c";
 urlString = "http://qiyukf.com/";
 };
 shopId = gys111;

 @param chatData RN方面传过来的数据，数据结构如上
 @return 返回发送的消息实体
 */
-(QYCommodityInfo *)getCommodityMsgWithData:(id)swichData{
  NSDictionary * chatData = swichData;
  NSDictionary * infoData = chatData[@"data"];
  if (infoData && infoData.allKeys.count == 0) {
    return nil;
  }
  
  QYCommodityInfo *commodityInfo = [[QYCommodityInfo alloc] init];
  if ([chatData[@"chatType"] integerValue] == BEGIN_FROM_OTHER) {
    commodityInfo.title = infoData[@"title"];
    commodityInfo.desc = infoData[@"desc"];
    commodityInfo.pictureUrlString = infoData[@"pictureUrlString"];
    commodityInfo.urlString = infoData[@"urlString"];
    commodityInfo.note = infoData[@"note"];
    commodityInfo.show = YES;
    commodityInfo.actionText = sendBtnTitl;
    commodityInfo.actionTextColor = [UIColor redColor];
    commodityInfo.sendByUser = YES;
  }else if([chatData[@"chatType"] integerValue] == BEGIN_FROM_PRODUCT){
    commodityInfo.title = infoData[@"title"];
    commodityInfo.desc = infoData[@"desc"];
    commodityInfo.pictureUrlString = infoData[@"pictureUrlString"];
    commodityInfo.urlString = infoData[@"urlString"];
    commodityInfo.note = infoData[@"note"];
    commodityInfo.show = YES;
    commodityInfo.actionText = sendBtnTitl;
    commodityInfo.actionTextColor = [UIColor redColor];
    commodityInfo.sendByUser = YES;
  }else if ([chatData[@"chatType"] integerValue] == BEGIN_FROM_ORDER){
    commodityInfo.title = infoData[@"title"];
    commodityInfo.desc = infoData[@"desc"];
    commodityInfo.pictureUrlString = infoData[@"pictureUrlString"];
    commodityInfo.urlString = infoData[@"urlString"];
    commodityInfo.note = infoData[@"note"];
    commodityInfo.show = YES;
    commodityInfo.actionText = sendBtnTitl;
    commodityInfo.actionTextColor = [UIColor redColor];
    commodityInfo.sendByUser = YES;
  }else if([chatData[@"chatType"] integerValue] == BEGIN_FROM_MESSAGE){
    commodityInfo = nil;
  }
  return commodityInfo;
}

@end
