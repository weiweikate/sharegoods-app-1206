//
//  RecommendedManager.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedManager.h"
#import "RecommendedView.h"

@implementation RecommendedManager

RCT_EXPORT_MODULE(ShowRecommendView)


RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onImgPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onZanPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDownloadPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSharePress, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onStartScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEndScroll, RCTBubblingEventBlock)

- (UIView *)view
{
  RecommendedView *view = [[RecommendedView alloc]init];
  return view;
}
@end
