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
#import "TYWaveProgressView.h"
@implementation MRWaveViewManager
RCT_EXPORT_MODULE();
- (UIView *)view
{
    TYWaveProgressView *view = [[TYWaveProgressView alloc] init];
    view.numberLabel.text = @"68";
    view.numberLabel.font = [UIFont boldSystemFontOfSize:70];
    view.numberLabel.textColor = [UIColor whiteColor];
    view.explainLabel.text = @"评分";
    view.explainLabel.font = [UIFont systemFontOfSize:20];
    view.explainLabel.textColor = [UIColor whiteColor];
     waveProgressView.percent = 0.68;
    return view;
}
@end
