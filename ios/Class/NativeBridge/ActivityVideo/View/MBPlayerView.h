//
//  MBPlayerView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@protocol MBPlayerViewDelegate<NSObject>

- (void)playerViewDidPrepareToShowVideo;
- (void)resetStatus;
@end

@interface MBPlayerView : UIView

@property (nonatomic, weak) id<MBPlayerViewDelegate> playDelegate;

@property (nonatomic, strong) AVPlayer *player;
@property (nonatomic, copy) NSString *urlString;
@property (nonatomic, assign) BOOL isPlaying;

- (instancetype)initWithFrame:(CGRect)frame;
-(void)tapAction;

@end
