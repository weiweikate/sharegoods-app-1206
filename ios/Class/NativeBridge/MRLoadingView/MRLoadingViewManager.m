//
//  MRLoadingViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MRLoadingViewManager.h"
#import "MRLoadingView.h"
@implementation MRLoadingViewManager
RCT_EXPORT_MODULE(MRLoadingView)
- (UIView *)view
{
    MRLoadingView *view = [[MRLoadingView alloc] init];
    return view;
  }
@end
