//
//  ShowDynamicViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/7/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowDynamicViewManager.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import "PagingViewController.h"
@implementation ShowDynamicViewManager
RCT_EXPORT_MODULE(ShowDynamicView)
RCT_EXPORT_VIEW_PROPERTY(userType, NSString)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onPersonItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPersonCollection, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPersonPublish, RCTBubblingEventBlock)


/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (UIView *)view
{
  return [PagingViewController new];
}


@end
