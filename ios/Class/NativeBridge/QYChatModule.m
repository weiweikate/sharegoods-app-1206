//
//  JRServiceModule.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "QYChatModule.h"

@implementation QYChatModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(qiYUChat:(id)josnData){
  dispatch_async(dispatch_get_main_queue(), ^{
    [[JRServiceManager sharedInstance]qiYUChat:josnData];
  });
}
//RCT_EXPORT_METHOD(startServiceWithGroupId:(int64_t)groupId andStaffId:(int64_t)staffId andTitle:(NSString *)title){
//        dispatch_async(dispatch_get_main_queue(), ^{
//          [[JRServiceManager sharedInstance]startServiceWithGroupId:groupId andStaffId:staffId andTitle:title];
//        });
//}
@end
