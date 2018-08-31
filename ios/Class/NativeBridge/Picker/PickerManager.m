//
//  PickerManager.m
//  jure
//
//  Created by nuomi on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "PickerManager.h"
#import "JRAddressPickView.h"

@implementation PickerManager
SINGLETON_FOR_CLASS(PickerManager)

//- (void)showPick{
//  if(!self.array || !self.array.count)return;
//  //弹出pick
//  JRAddressPickView * pickView = [[JRAddressPickView alloc]initWithFrame:CGRectZero];
//  pickView.dataArr = self.array;
//  [pickView showView];
//  pickView.sureBlock = ^(NSDictionary *selectData) {
//    
//  };
//}
-(void)showPickAndFinsh:(finshSelectBlock)finshBlock{
  if(!self.array || !self.array.count)return;
  //弹出pick
  JRAddressPickView * pickView = [[JRAddressPickView alloc]initWithFrame:CGRectZero];
  pickView.dataArr = self.array;
  [pickView showView];
  pickView.sureBlock = ^(NSDictionary *selectData) {
    if (finshBlock) {
       finshBlock(selectData);
    }
  };
}

@end
