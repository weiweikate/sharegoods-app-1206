//
//  AdView.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/4.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface AdView : UIView
@property (nonatomic, assign) BOOL isPlayAd;//yes 无广告 或者 广告播放完。  no 有广告没有播放完
@property (nonatomic, assign) BOOL isLoadJS;// js 已经加载完成

- (void)addToWindow;
//- (void)removeFromWindow;
@end

NS_ASSUME_NONNULL_END
