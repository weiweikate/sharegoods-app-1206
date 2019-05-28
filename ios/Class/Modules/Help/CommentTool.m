//
//  CommentTool.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/5/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CommentTool.h"
#import "NSObject+Util.h"

#define LASTCOMMENT_TIME_STAMP @"LASTCOMMENT_TIME_STAMP"
#define COMMENT_INTERVAL  @"COMMENT_INTERVAL"  //评论间隔天数

@implementation CommentTool

SINGLETON_FOR_CLASS(CommentTool)

-(void)checkIsCanComment{
//  [self showAlter];
//  return;
  
   NSString *savedTimeStamp = [[NSUserDefaults standardUserDefaults] objectForKey:LASTCOMMENT_TIME_STAMP];
   NSString *commentInterval = [[NSUserDefaults standardUserDefaults]objectForKey:COMMENT_INTERVAL];
  if (savedTimeStamp && commentInterval ) {
    NSInteger savedTimeStamp_integer = [savedTimeStamp integerValue];
    NSInteger commentInterval_integer = [commentInterval integerValue];
    NSLog(@"保存的时间戳%ld,保存的时间间隔%ld",savedTimeStamp_integer,commentInterval_integer);
    if ((savedTimeStamp_integer + commentInterval_integer * 24 * 60) < [[self getNowTimeStamp] integerValue]) {
      //超过间隔时间可以弹出评论
      [self showAlter];
      [[NSUserDefaults standardUserDefaults]setObject:[self getNowTimeStamp] forKey:LASTCOMMENT_TIME_STAMP];
    }
  }else{
    //第一次没有
    [[NSUserDefaults standardUserDefaults]setObject:[self getNowTimeStamp] forKey:LASTCOMMENT_TIME_STAMP];
    [self saveNewTimeInterval:0];
  }
}

-(void)showAlter{
  UIAlertController *alterController = [UIAlertController alertControllerWithTitle:@"温馨提示"
                                                                           message:@"亲爱的秀宝宝您已经用了一段时间小秀了，可否来个好评~"
                                                                    preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"没时间"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) { }];
  
  UIAlertAction *actionSubmit = [UIAlertAction actionWithTitle:@"好嘞"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                         [self goToAppStore];
                                                       }];
  
  [alterController addAction:actionCancel];
  [alterController addAction:actionSubmit];
  [self.currentViewController_XG presentViewController:alterController animated:YES completion:^{}];
  
}
-(void)goToAppStore{
  //itms-apps://itunes.apple.com/cn/app/id1439275146?mt=8&action=write-review
  NSString *itunesurl = @"itms-apps://itunes.apple.com/cn/app/id1439275146?mt=8&action=write-review";
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:itunesurl]];
}
-(void)saveNewTimeInterval:(NSInteger)timeInterval{
  if (timeInterval && timeInterval <= 0) {
    [[NSUserDefaults standardUserDefaults]setObject:@"2" forKey:COMMENT_INTERVAL];
    [[NSUserDefaults standardUserDefaults]synchronize];
  }else{
    if (timeInterval >= 32) {
       [[NSUserDefaults standardUserDefaults]setObject:@"32" forKey:COMMENT_INTERVAL];
      [[NSUserDefaults standardUserDefaults]synchronize];
    }else{
      NSString * newTimeInterval = [NSString stringWithFormat:@"%ld",timeInterval * 2];
      [[NSUserDefaults standardUserDefaults]setObject:newTimeInterval forKey:COMMENT_INTERVAL];
      [[NSUserDefaults standardUserDefaults]synchronize];
    }
  }
}
-(NSString *)getNowTimeStamp{
  
  NSDate *datenow = [NSDate date];//现在时间,你可以输出来看下是什么格式
  
  NSString *timeSp = [NSString stringWithFormat:@"%ld", (long)[datenow timeIntervalSince1970]];
  
  return timeSp;
  
}

@end
