//
//  ActivetyViewManager.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActivetyViewManager.h"
#import "ActiveView.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation ActivetyViewManager

RCT_EXPORT_MODULE(MrShowVideoListView)

RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(userCode, NSString)

RCT_EXPORT_VIEW_PROPERTY(onAttentionPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBack, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPressTag, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSharePress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBuy, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSeeUser, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onZanPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDownloadPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCollection, RCTBubblingEventBlock)

- (UIView *)view
{
  ActiveView *view = [[ActiveView alloc]init];
  return view;
}

@end
