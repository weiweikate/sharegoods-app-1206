//
//  MRWaveViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MRWaveViewManager.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "MRWaveView.h"
@implementation MRWaveViewManager
RCT_EXPORT_MODULE(MRWaveView)
RCT_EXPORT_VIEW_PROPERTY(waveColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(waveLightColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(waveBackgroundColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(progressValue, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(topTitleColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(topTitleSize, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(topTitle, NSString)
- (UIView *)view
{
    MRWaveView *view = [[MRWaveView alloc] init];
     return view;
}
@end
