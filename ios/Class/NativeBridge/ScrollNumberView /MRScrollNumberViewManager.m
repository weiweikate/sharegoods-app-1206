//
//  MRScrollNumberViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/11/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MRScrollNumberViewManager.h"
#import "MRScrollNumberView.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
@implementation MRScrollNumberViewManager
RCT_EXPORT_MODULE(MrScrollNumberView)
RCT_EXPORT_VIEW_PROPERTY(data, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(fontSize, NSInteger)

- (UIView *)view
{
     MRScrollNumberView *view = [[MRScrollNumberView alloc] init];
     return view;
}
@end
