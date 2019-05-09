//
//  ActivetyViewManager.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActivetyViewManager.h"
#import "ActiveView.h"

@implementation ActivetyViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onStartScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEndScroll, RCTBubblingEventBlock)

- (UIView *)view
{
  ActiveView *view = [[ActiveView alloc]init];
  return view;
}

@end
