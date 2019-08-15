//
//  HYFVideoPreviewView.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "HYFVideoPreviewView.h"
#import <MediaPlayer/MediaPlayer.h>
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>
#import "UIButton+Convenience.h"

@interface HYFVideoPreviewView ()
{
  float _width;
  float _distance;
}

@property (nonatomic ,strong) UIButton *cancelButton;
@property (nonatomic ,strong) UIButton *sendButton;
@property (nonatomic,strong) UIButton * editButton;
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_8_4
@property (nonatomic ,strong) AVPlayerViewController *avPlayer;
#endif

@end

@implementation HYFVideoPreviewView

-(instancetype)initWithVideoPath:(NSString *)videoPath{
  if (self = [super init]) {
     _videoPath = videoPath;
     _isFirstLoad = YES;
    [self setupUI];
  }
  return self;
}

- (void)setupUI{
#if __IPHONE_OS_VERSION_MAX_ALLOWED < __IPHONE_9_0
    MPMoviePlayerController *mpPlayer = [[MPMoviePlayerController alloc]initWithContentURL:[NSURL fileURLWithPath:_videoPath]];
    mpPlayer.view.frame = self.bounds;
    mpPlayer.controlStyle = MPMovieControlStyleNone;
    mpPlayer.movieSourceType = MPMovieSourceTypeFile;
    mpPlayer.repeatMode = MPMovieRepeatModeOne;
    [mpPlayer prepareToPlay];
    [mpPlayer play];
    [self addSubview:mpPlayer.view];
#else
    AVPlayerViewController *avPlayer = [[AVPlayerViewController alloc]init];
    avPlayer.view.frame = self.bounds;
    avPlayer.showsPlaybackControls = NO;
    avPlayer.videoGravity = AVLayerVideoGravityResizeAspect;
    avPlayer.player = [AVPlayer playerWithURL:[NSURL fileURLWithPath:_videoPath]];
    [avPlayer.player play];
    [self addSubview:avPlayer.view];
    _avPlayer = avPlayer;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(replay) name:AVPlayerItemDidPlayToEndTimeNotification object:nil];
#endif
  _width = 148/2;
  _distance = 120/2;
  // 取消
  UIButton *cancelButton = [UIButton image:@"record_cancel" target:self action:@selector(btnClick:)];
  cancelButton.bounds = CGRectMake(0, 0, _width, _width);
  cancelButton.tag = 0;
  cancelButton.center = CGPointMake(self.center.x, self.bounds.size.height -_distance - _width/2);
  [self addSubview:cancelButton];
  _cancelButton = cancelButton;
  
  //编辑按钮
  UIButton *editButton = [UIButton image:@"edit_img_bg" target:self action:@selector(btnClick:)];
  editButton.bounds = CGRectMake(0, 0, _width, _width);
  editButton.center = CGPointMake(self.center.x, self.bounds.size.height -_distance - _width/2);
  editButton.hidden = YES;
  editButton.tag = 2;
  [self addSubview:editButton];
  _editButton = editButton;
  
  // 发送
  UIButton *sendButton = [UIButton image:@"record_finsh_bg" target:self action:@selector(btnClick:)];
  sendButton.bounds = CGRectMake(0, 0, _width, _width);
  sendButton.center = CGPointMake(self.center.x, self.bounds.size.height - _distance - _width/2);
  sendButton.tag = 1;
  [self addSubview:sendButton];
  _sendButton = sendButton;
}
-(void)layoutSubviews{
  [super layoutSubviews];
  NSLog(@"预览图");
  if (self.isFirstLoad) {
    self.isFirstLoad = NO;
    [UIView animateWithDuration:0.25 animations:^{
      _cancelButton.bounds = CGRectMake(0, 0, _width, _width);
      _cancelButton.center = CGPointMake(self.bounds.size.width / 4, self.bounds.size.height -_distance - _width/2);
      _sendButton.bounds = CGRectMake(0, 0, _width, _width);
      _sendButton.center = CGPointMake(self.bounds.size.width / 4 * 3, self.bounds.size.height - _distance - _width/2);
      _editButton.bounds =CGRectMake(0, 0, _width, _width);
      _editButton.center = CGPointMake(self.bounds.size.width / 4 * 2, self.bounds.size.height - _distance - _width/2);
    }];
  }else{
    _cancelButton.bounds = CGRectMake(0, 0, _width, _width);
    _cancelButton.center = CGPointMake(self.bounds.size.width / 4, self.bounds.size.height -_distance - _width/2);
    _sendButton.bounds = CGRectMake(0, 0, _width, _width);
    _sendButton.center = CGPointMake(self.bounds.size.width / 4 * 3, self.bounds.size.height - _distance - _width/2);
    _editButton.bounds =CGRectMake(0, 0, _width, _width);
    _editButton.center = CGPointMake(self.bounds.size.width / 4 * 2, self.bounds.size.height - _distance - _width/2);
  }
}
-(void)btnClick:(UIButton *)btn{
  if (self.delegate && [self.delegate respondsToSelector:@selector(preViewBtnClick:)]) {
    [self.delegate preViewBtnClick:btn.tag];
  }
}
- (void)replay{
  if (_avPlayer) {
    [_avPlayer.player seekToTime:CMTimeMake(0, 1)];
    [_avPlayer.player play];
  }
}
@end
