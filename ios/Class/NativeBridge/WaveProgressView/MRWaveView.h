//
//  MRWaveView.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface MRWaveView : UIView
@property(nonatomic, copy)NSString *topTitle;
@property(nonatomic, copy)NSNumber *waveBackgroundColor;
@property(nonatomic, copy)NSNumber *waveColor;
@property(nonatomic, copy)NSNumber *waveLightColor;
@property(nonatomic, copy)NSNumber *topTitleColor;
@property(nonatomic, assign)NSInteger topTitleSize;
@property(nonatomic, assign)NSInteger progressValue;
@end

NS_ASSUME_NONNULL_END
