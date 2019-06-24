//
//  SGRecordSuccessPreview.m
//  短视频录制
//
//  Created by lihaohao on 2017/5/22.
//  Copyright © 2017年 低调的魅力. All rights reserved.
//

#import "SGRecordSuccessPreview.h"
#import "UIButton+Convenience.h"
#import "IJSImageManagerController.h"
@interface SGRecordSuccessPreview(){
    float _width;
    float _distance;
}
@property (nonatomic ,strong) UIButton *cancelButton;
@property (nonatomic ,strong) UIButton *sendButton;
@property (nonatomic,strong) UIButton * editButton;
@property (nonatomic ,strong) UIImage *image;// 拍摄的图片
@property (nonatomic ,copy) NSString *videoPath; // 拍摄的视频地址
@property (nonatomic ,assign) BOOL isPhoto;// 是否是图片
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_8_4
@property (nonatomic ,strong) AVPlayerViewController *avPlayer;
#endif
@property (nonatomic ,assign) AVCaptureVideoOrientation orientation;
@property (nonatomic, strong) UIImageView * mainImageView;
@property (nonatomic,assign) BOOL isFirstLoad;
@end
@implementation SGRecordSuccessPreview

-(instancetype)init{
  if (self = [super init]) {
    self.isFirstLoad = YES;
  }
  return self;
}
-(UIImageView *)mainImageView{
  if (!_mainImageView) {
    _mainImageView=[[UIImageView alloc]init];
    _mainImageView.frame = self.bounds;
  }
  return _mainImageView;
}
- (void)setImage:(UIImage *)image videoPath:(NSString *)videoPath captureVideoOrientation:(AVCaptureVideoOrientation)orientation{
    _image = image;
    _videoPath = videoPath;
    _orientation = orientation;
    self.backgroundColor = [UIColor blackColor];
    if (_image && !videoPath) {
        _isPhoto = YES;
    }
    [self setupUI];
}
- (void)setupUI{
    if (_isPhoto) {
        [self.mainImageView setImage:_image];
        if (_orientation == AVCaptureVideoOrientationLandscapeRight || _orientation ==AVCaptureVideoOrientationLandscapeLeft) {
            self.mainImageView.contentMode = UIViewContentModeScaleAspectFit;
        }
        [self addSubview:self.mainImageView];
    } else {
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
    }
    _width = 148/2;
    _distance = 120/2;
    // 取消
    UIButton *cancelButton = [UIButton image:@"短视频_重拍" target:self action:@selector(cancel)];
    cancelButton.bounds = CGRectMake(0, 0, _width, _width);
    cancelButton.center = CGPointMake(self.center.x, self.bounds.size.height -_distance - _width/2);
    [self addSubview:cancelButton];
    _cancelButton = cancelButton;
  
  //编辑按钮
  UIButton *editButton = [UIButton image:@"短视频_重拍" target:self action:@selector(editClick)];
  [editButton setTitle:@"编辑" forState:UIControlStateNormal];
  editButton.bounds = CGRectMake(0, 0, _width, _width);
  editButton.center = CGPointMake(self.center.x, self.bounds.size.height -_distance - _width/2);
  [self addSubview:editButton];
  _editButton = editButton;
  
    // 发送
    UIButton *sendButton = [UIButton image:@"短视频_完成" target:self action:@selector(send)];
    sendButton.bounds = CGRectMake(0, 0, _width, _width);
    sendButton.center = CGPointMake(self.center.x, self.bounds.size.height - _distance - _width/2);
    [self addSubview:sendButton];
    _sendButton = sendButton;
}

-(void)LayoutSubview{
  
  
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
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_8_4
- (void)replay{
    if (_avPlayer) {
        [_avPlayer.player seekToTime:CMTimeMake(0, 1)];
        [_avPlayer.player play];
    }
}
#endif
-(void)editClick{
  __weak typeof (self) weakSelf = self;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    IJSImageManagerController *vc =[[IJSImageManagerController alloc]initWithEditImage:_image];
    [vc loadImageOnCompleteResult:^(UIImage *image, NSURL *outputPath, NSError *error) {
      [self setImage:image videoPath:nil captureVideoOrientation:_orientation];
      //    weakSelf.backImageView.image = image;
//      [self sendWithImage:image videoPath:nil];
    }];
    vc.mapImageArr = @[];
    [[self currentViewController_XG] presentViewController:vc animated:YES completion:nil];
  });
}
- (void)cancel{
    if (self.cancelBlcok) {
        self.cancelBlcok();
    }
}
- (void)send{
    if (self.sendBlock) {
        self.sendBlock(_image, _videoPath);
    }
}
- (void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    NSLog(@"%s",__func__);
}
@end
