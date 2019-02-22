//
//  ShowGroundViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowGroundViewManager.h"
#import "ShowGroundView.h"
@implementation ShowGroundViewManager
RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_MODULE(ShowGroundView)
- (UIView *)view
{
  ShowGroundView *view = [[ShowGroundView alloc] init];
  return view;
}

@end
