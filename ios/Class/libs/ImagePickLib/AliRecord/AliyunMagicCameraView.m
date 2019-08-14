//
//  MagicCameraView.m
//  AliyunVideo
//
//  Created by Vienta on 2017/1/3.
//  Copyright (C) 2010-2017 Alibaba Group Holding Limited. All rights reserved.
//

#import "AliyunMagicCameraView.h"
//#import "AVC_ShortVideo_Config.h"
#import "AliyunIConfig.h"
#import "AlivcUIConfig.h"
#import "AlivcRecordFocusView.h"
#import "AlivcImage.h"

#define finishBtnX  (CGRectGetWidth(self.bounds) - 58 - 10)
#define AlivcOxRGB(rgbValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]

@interface AliyunMagicCameraView ()


/**
 前后摄像头切换按钮
 */
@property (nonatomic, strong) UIButton *cameraIdButton;

/**
 回删按钮
 */
@property (nonatomic, strong) UIButton *deleteButton;
/**
 选择视频btn
 **/
@property (nonatomic,strong) UIButton * selectVideoBtn;

/**
 时间显示控件
 */
@property (nonatomic, strong) UILabel *timeLabel;

/**
 手指按下录制按钮的时间
 */
@property (nonatomic, assign) double startTime;

/**
 底部显示三角形的view
 */
@property (nonatomic, strong) UIImageView *triangleImageView;

/**
 显示单击拍文字的按钮
 */
@property (nonatomic, strong) UIButton *tapButton;

/**
 显示长按拍文字的按钮
 */
@property (nonatomic, strong) UIButton *longPressButton;

/**
 时间显示控件旁边的小圆点，正在录制的时候显示
 */
@property (nonatomic, strong) UIImageView *dotImageView;


/**
 短视频拍摄界面UI配置
 */
@property (nonatomic, strong) AlivcRecordUIConfig *uiConfig;

@property (nonatomic, strong)AlivcRecordFocusView *focusView;

@property (nonatomic, assign)CFTimeInterval cameraIdButtonClickTime;

@property (nonatomic, strong) UIImageView *coverImageView;

@end

@implementation AliyunMagicCameraView

- (instancetype)initWithUIConfig:(AlivcRecordUIConfig *)uiConfig{
    self = [super initWithFrame:CGRectMake(0, 0, ScreenWidth, ScreenHeight)];
    if(self){
        _uiConfig = uiConfig;
        [AliyunIConfig config].recordType = AliyunIRecordActionTypeClick;
        [self setupSubview];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
    
        [self setupSubview];
    }
    return self;
}

/**
 添加子控件
 */
- (void)setupSubview
{
    _cameraIdButtonClickTime =CFAbsoluteTimeGetCurrent();
    if(!_uiConfig){
        _uiConfig = [[AlivcRecordUIConfig alloc]init];
    }
    self.topView = [[UIView alloc] initWithFrame:CGRectMake(0,(IPHONEX ? 44 + 14 : 14), CGRectGetWidth(self.bounds), 44+8)];
    [self addSubview:self.topView];
    [self.topView addSubview:self.backButton];
    [self.topView addSubview:self.cameraIdButton];
    [self.topView addSubview:self.flashButton];
    self.flashButton.enabled = NO;
    [self.topView addSubview:self.countdownButton];
    [self.topView addSubview:self.finishButton];
    [self insertSubview:self.previewView atIndex:0];
    
    self.bottomView = [[UIView alloc] initWithFrame:CGRectMake(0, CGRectGetHeight(self.bounds) - 60 , CGRectGetWidth(self.bounds), 60)];
    self.bottomView.backgroundColor = [AlivcUIConfig shared].kAVCBackgroundColor;
    [self addSubview:self.bottomView];
    
    self.topView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.01];
    
    
    self.deleteButton = [[UIButton alloc] initWithFrame:CGRectMake(ScreenWidth/2-40, ScreenHeight-42 - SafeBottom, 70, 40)];
    self.deleteButton.hidden = YES;
    self.deleteButton.titleLabel.font = [UIFont systemFontOfSize:14];
    [self.deleteButton setTitle:@" 回删" forState:UIControlStateNormal];
    [self.deleteButton setImage:_uiConfig.deleteImage forState:UIControlStateNormal];
    [self.deleteButton addTarget:self action:@selector(deletePartClicked) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:self.deleteButton];
    
  
    
    self.circleBtn = [[MagicCameraPressCircleView alloc] initWithFrame:CGRectMake(ScreenWidth/2-40, ScreenHeight - 120 - SafeBottom, 75, 75)];
    [self addSubview:self.circleBtn];
    [self.circleBtn addTarget:self action:@selector(recordButtonTouchUp) forControlEvents:UIControlEventTouchUpInside];
    [self.circleBtn addTarget:self action:@selector(recordButtonTouchDown) forControlEvents:UIControlEventTouchDown];
    [self.circleBtn addTarget:self action:@selector(recordButtonTouchUpDragOutside) forControlEvents:UIControlEventTouchDragOutside];
    
    self.timeLabel = [[UILabel alloc] init];
    self.timeLabel.textAlignment = NSTextAlignmentCenter;
    self.timeLabel.frame = CGRectMake(0, 0, 60, 16);
    self.timeLabel.backgroundColor = [UIColor clearColor];
    self.timeLabel.textColor = [UIColor whiteColor];
    self.timeLabel.center = CGPointMake(ScreenWidth / 2+10, ScreenHeight - 152-SafeBottom);
    [self addSubview:self.timeLabel];
    
    self.dotImageView = [[UIImageView alloc] initWithImage:_uiConfig.dotImage];
    self.dotImageView.center = CGPointMake(ScreenWidth/2-30, self.timeLabel.center.y);
    self.dotImageView.hidden = YES;
    [self addSubview:self.dotImageView];
    
    [self addSubview:self.progressView];
    
    self.triangleImageView = [[UIImageView alloc] initWithImage:_uiConfig.triangleImage];
    self.triangleImageView.center = CGPointMake(ScreenWidth/2, ScreenHeight-8-SafeBottom);
    [self addSubview:self.triangleImageView];
    
    UIButton *tapButton = [[UIButton alloc] initWithFrame:CGRectMake(ScreenWidth/2-21, ScreenHeight-36-SafeBottom, 45, 20)];
    [tapButton setTitle:@"单击拍" forState:UIControlStateNormal];
    [tapButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [tapButton addTarget:self action:@selector(tapButtonClick) forControlEvents:UIControlEventTouchUpInside];
    tapButton.titleLabel.font = [UIFont systemFontOfSize:14];
    self.tapButton = tapButton;
    [self addSubview:tapButton];
    
    UIButton *longPressButton = [[UIButton alloc] initWithFrame:CGRectMake(ScreenWidth/2-21+72, ScreenHeight-36-SafeBottom, 45, 20)];
    [longPressButton setTitle:@"长按拍" forState:UIControlStateNormal];
    [longPressButton setTitleColor:AlivcOxRGB(0xc3c5c6) forState:UIControlStateNormal];
    [longPressButton addTarget:self action:@selector(longPressButtonClick) forControlEvents:UIControlEventTouchUpInside];
    longPressButton.titleLabel.font = [UIFont systemFontOfSize:14];
    self.longPressButton = longPressButton;
    [self addSubview:longPressButton];
  
  UIButton *selectVideoBtn = [[UIButton alloc] initWithFrame:CGRectMake(ScreenWidth/2-21+72, ScreenHeight-110-SafeBottom, 30, 30)];
  [selectVideoBtn setImage:[UIImage imageNamed:@"ali_select_video"] forState:UIControlStateNormal];
  [selectVideoBtn setTitleColor:AlivcOxRGB(0xc3c5c6) forState:UIControlStateNormal];
  [selectVideoBtn addTarget:self action:@selector(selectVideoBtnClick) forControlEvents:UIControlEventTouchUpInside];
  selectVideoBtn.titleLabel.font = [UIFont systemFontOfSize:14];
  self.selectVideoBtn = selectVideoBtn;
  [self addSubview:selectVideoBtn];
  [self setExclusiveTouchInButtons];
}

/**
 按钮间设置不能同时点击
 */
- (void)setExclusiveTouchInButtons{
    [self.tapButton setExclusiveTouch:YES];
    [self.countdownButton setExclusiveTouch:YES];
    [self.deleteButton setExclusiveTouch:YES];
    [self.finishButton setExclusiveTouch:YES];
    [self.cameraIdButton setExclusiveTouch:YES];
    [self.selectVideoBtn setExclusiveTouch:YES];
}
/**
选择视频按钮点击
 **/
-(void)selectVideoBtnClick{
  if(self.delegate && [self.delegate respondsToSelector:@selector(selectVideoBtnClick)]){
    [self.delegate selectVideoBtnClick];
  }
}

/**
 显示单击拍按钮的点击事件
 */
- (void)tapButtonClick{
    CGFloat y = self.tapButton.center.y;
    self.tapButton.center = CGPointMake(ScreenWidth/2, y);
    self.longPressButton.center = CGPointMake(ScreenWidth/2+72, y);
    [self.tapButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.longPressButton setTitleColor:AlivcOxRGB(0xc3c5c6) forState:UIControlStateNormal];
    [self.circleBtn setTitle:@"" forState:UIControlStateNormal];
    if (self.delegate && [self.delegate respondsToSelector:@selector(tapButtonClicked)]) {
        [self.delegate tapButtonClicked];
    }
    
}

/**
 显示长按拍按钮的点击时间
 */
- (void)longPressButtonClick{
    CGFloat y = self.tapButton.center.y;
    self.tapButton.center = CGPointMake(ScreenWidth/2-72, y);
    self.longPressButton.center = CGPointMake(ScreenWidth/2, y);
    [self.tapButton setTitleColor:AlivcOxRGB(0xc3c5c6) forState:UIControlStateNormal];
    [self.longPressButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.circleBtn setTitle:@"按住拍" forState:UIControlStateNormal];
    if (self.delegate && [self.delegate respondsToSelector:@selector(longPressButtonClicked)]) {
        [self.delegate longPressButtonClicked];
    }
}

- (void)recordButtonTouchUp {
    switch ([AliyunIConfig config].recordType) {
        case AliyunIRecordActionTypeCombination:
                if (_recording) {
                    [self endRecord];
                }
            break;
            
        case AliyunIRecordActionTypeHold:
            if (_recording) {
                
                [self endRecord];
                self.circleBtn.transform = CGAffineTransformIdentity;
                [self.circleBtn setImage:_uiConfig.videoShootImageNormal forState:UIControlStateNormal];
            }
            break;
            
        case AliyunIRecordActionTypeClick:
            if (_recording) {
                [self endRecord];
                self.circleBtn.transform = CGAffineTransformIdentity;
                [self.circleBtn setImage:_uiConfig.videoShootImageNormal forState:UIControlStateNormal];
                return;
            }else{
                self.tapButton.hidden = YES;
                self.longPressButton.hidden = YES;
                self.triangleImageView.hidden = YES;
                self.selectVideoBtn.hidden = YES;
                _recording = YES;
                _progressView.videoCount++;
                self.circleBtn.transform = CGAffineTransformScale(self.transform, 1.32, 1.32);
                [self.circleBtn setImage:_uiConfig.videoShootImageShooting forState:UIControlStateNormal];
                self.dotImageView.hidden = NO;
                [_delegate recordButtonRecordVideo];
            }
            break;
        default:
            break;
    }
    
}


- (void)recordButtonTouchDown {
    _startTime = CFAbsoluteTimeGetCurrent();
    
    NSLog(@"  YY----%f---%zd", _startTime,[AliyunIConfig config].recordType);
    
    switch ([AliyunIConfig config].recordType) {
        case AliyunIRecordActionTypeCombination:
            if (_recording) {
                [self endRecord];
                return;
            }else{
                _recording = YES;
            }
            break;
        case AliyunIRecordActionTypeHold:
            
            if (_recording == NO) {
                _recording = YES;
                self.tapButton.hidden = YES;
                self.longPressButton.hidden = YES;
                self.triangleImageView.hidden = YES;
                self.selectVideoBtn.hidden = YES;
                self.circleBtn.transform = CGAffineTransformScale(self.transform, 1.32, 1.32);
                [self.circleBtn setImage:_uiConfig.videoShootImageLongPressing forState:UIControlStateNormal];
                [self.circleBtn setTitle:@"" forState:UIControlStateNormal];
                _progressView.videoCount++;
                self.dotImageView.hidden = NO;
                [_delegate recordButtonRecordVideo];
            }
            
            break;
            
        case AliyunIRecordActionTypeClick:
            
            break;
        default:
            break;
    }
}

- (void)recordButtonTouchUpDragOutside{
    if ([AliyunIConfig config].recordType == AliyunIRecordActionTypeHold) {
        [self endRecord];
        self.circleBtn.transform = CGAffineTransformIdentity;
        [self.circleBtn setImage:_uiConfig.videoShootImageNormal forState:UIControlStateNormal];
    }
}

/**
 结束录制
 */
- (void)endRecord{
    if (!_recording) {
        return;
    }
    _startTime = 0;
    _recording = NO;
    [_delegate recordButtonPauseVideo];
    _progressView.showBlink = NO;
     [self destroy];
    _deleteButton.enabled = YES;
   
    if ([AliyunIConfig config].recordOnePart) {
        if (_delegate) {
            [_delegate recordButtonFinishVideo];
        }
    }
    self.countdownButton.enabled = YES;
    if (self.progressView.videoCount > 0 ) {
        self.deleteButton.hidden = NO;
    }
    self.dotImageView.hidden = YES;
}


- (void)recordingPercent:(CGFloat)percent
{
    [self.progressView updateProgress:percent];
    if(_recording){
        int d = percent;
        int m = d / 60;
        int s = d % 60;
        self.timeLabel.text = [NSString stringWithFormat:@"%02d:%02d",m,s];
    }
    
    if(percent == 0){
        [self.progressView reset];
        self.deleteButton.hidden = YES;
        self.triangleImageView.hidden = NO;
        self.tapButton.hidden = NO;
        self.longPressButton.hidden = NO;
      self.selectVideoBtn.hidden = NO;
        self.timeLabel.text = @"";
    }
}

- (void)destroy
{
    self.timeLabel.text = @"";
    self.dotImageView.hidden = YES;
}

- (void)setHide:(BOOL)hide {
    self.deleteButton.hidden = hide;
    self.topView.hidden = hide;
}

- (void)setBottomHide:(BOOL)hide{
    _bottomHide = hide;
    self.circleBtn.hidden = hide;
    if(self.progressView.videoCount){
        self.triangleImageView.hidden = YES;
        self.longPressButton.hidden = YES;
        self.tapButton.hidden = YES;
      self.selectVideoBtn.hidden = YES;
        self.deleteButton.hidden = NO;
    }else{
        self.triangleImageView.hidden = hide;
        self.longPressButton.hidden = hide;
        self.tapButton.hidden = hide;
      self.selectVideoBtn.hidden = hide;
        self.deleteButton.hidden = YES;
        if ([AliyunIConfig config].recordType == AliyunIRecordActionTypeHold) {
            [self.circleBtn setTitle:@"按住拍" forState:UIControlStateNormal];
        }
    }
    
}

- (void)setRealVideoCount:(NSInteger)realVideoCount{
    if (realVideoCount) {
        self.triangleImageView.hidden = YES;
        self.longPressButton.hidden = YES;
        self.tapButton.hidden = YES;
        self.deleteButton.hidden = NO;
      self.selectVideoBtn.hidden = YES;
    }else{
        self.triangleImageView.hidden = NO;
        self.longPressButton.hidden = NO;
        self.tapButton.hidden = NO;
      self.selectVideoBtn.hidden = NO;
        self.deleteButton.hidden = YES;
    }
}
-(void)setMaxDuration:(CGFloat)maxDuration{
    _maxDuration = maxDuration;
    self.progressView.maxDuration = maxDuration;
}

-(void)setMinDuration:(CGFloat)minDuration{
    _minDuration = minDuration;
    self.progressView.minDuration = minDuration;
}

#pragma mark - Getter -
- (UIButton *)backButton
{
    if (!_backButton) {
        _backButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _backButton.backgroundColor = [UIColor clearColor];
        _backButton.frame = CGRectMake(0, 8, 44, 44);
        [_backButton setImage:_uiConfig.backImage forState:UIControlStateNormal];
        [_backButton addTarget:self action:@selector(backButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backButton;
}

- (UIButton *)finishButton
{
    if (!_finishButton) {
        _finishButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _finishButton.backgroundColor = [UIColor clearColor];
    
        _finishButton.frame = CGRectMake(finishBtnX, 16, 58, 27);
        _finishButton.hidden = NO;
        [_finishButton setTitle:@"下一步" forState:UIControlStateNormal];
        _finishButton.titleLabel.font = [UIFont systemFontOfSize:13];
        [_finishButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal]; 
        _finishButton.enabled = NO;
        UIColor *bgColor_disable = [UIColor colorWithRed:0/255.0 green:0/255.0 blue:0/255.0 alpha:0.34];
        [_finishButton setBackgroundColor:bgColor_disable];
        [_finishButton addTarget:self action:@selector(finishButtonClicked) forControlEvents:UIControlEventTouchUpInside];
        _finishButton.layer.cornerRadius = 2;
        
    }
    return _finishButton;
}

- (UIButton *)cameraIdButton
{
    if (!_cameraIdButton) {
        _cameraIdButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _cameraIdButton.backgroundColor = [UIColor clearColor];
        _cameraIdButton.frame = CGRectMake(finishBtnX - 44 - 36, 8, 44, 44);
        [_cameraIdButton setImage:_uiConfig.switchCameraImage forState:UIControlStateNormal];
        [_cameraIdButton addTarget:self action:@selector(cameraIdButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _cameraIdButton;
}


- (UIButton *)flashButton
{
    if (!_flashButton) {
        _flashButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _flashButton.backgroundColor = [UIColor clearColor];
        _flashButton.frame = CGRectMake(finishBtnX - 44 - 36 - 44 - 20, 8, 44, 44);
        _flashButton.hidden = NO;
        [_flashButton setImage:_uiConfig.ligheImageUnable forState:UIControlStateNormal];
        [_flashButton addTarget:self action:@selector(flashButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _flashButton;
}



-(UIButton *)countdownButton {
    if (!_countdownButton) {
        _countdownButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _countdownButton.backgroundColor = [UIColor clearColor];
        _countdownButton.frame = CGRectMake(finishBtnX - 44 - 36 - 44 - 20 - 44 - 20, 8, 44, 44);
        [_countdownButton setImage:_uiConfig.countdownImage forState:UIControlStateNormal];
        [_countdownButton addTarget:self action:@selector(timerButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        
    }
    return _countdownButton;
}

- (QUProgressView *)progressView {
    if (!_progressView) {
        _progressView = [[QUProgressView alloc] initWithFrame:CGRectMake(10, IPHONEX ? 43 : 5, CGRectGetWidth(self.bounds) - 20, 4)];
        _progressView.showBlink = NO;
        _progressView.showNoticePoint = YES;
        _progressView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.01];
        _progressView.layer.cornerRadius = 2;
        _progressView.layer.masksToBounds = YES;
    }
    return _progressView;
}

- (UIView *)previewView{
    if (!_previewView) {
        _previewView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, ScreenWidth, ScreenHeight)];
    }
    return _previewView;
}

-(AlivcRecordFocusView *)focusView{
    if (!_focusView) {
        CGFloat size = 150;
        _focusView =[[AlivcRecordFocusView alloc]initWithFrame:CGRectMake(0, 0, size, size)];
        _focusView.animation =YES;
        [self.previewView addSubview:_focusView];
    }
    return _focusView;
}

-(void)refreshFocusPointWithPoint:(CGPoint)point{
    self.focusView.center = point;
    [self.previewView bringSubviewToFront:self.focusView];
}

- (void)resetRecordButtonUI{
    self.circleBtn.transform = CGAffineTransformIdentity;
    [self.circleBtn setImage:_uiConfig.videoShootImageNormal forState:UIControlStateNormal];
    self.dotImageView.hidden = YES;
    if([AliyunIConfig config].recordType == AliyunIRecordActionTypeClick){
        [self.circleBtn setTitle:@"" forState:UIControlStateNormal];
    }else if([AliyunIConfig config].recordType == AliyunIRecordActionTypeHold){
        if (!self.progressView.videoCount) {
            [self.circleBtn setTitle:@"按住拍" forState:UIControlStateNormal];
        }
        
    }
}

/**
 返回按钮的点击事件

 @param sender 返回按钮
 */
- (void)backButtonClicked:(id)sender
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(backButtonClicked)]) {
        [self.delegate backButtonClicked];
    }
}


/**
 闪光灯按钮的点击事件

 @param sender 闪光灯按钮
 */
- (void)flashButtonClicked:(id)sender
{
    UIButton *button = (UIButton *)sender;
    if (self.delegate && [self.delegate respondsToSelector:@selector(flashButtonClicked)]) {
        NSString *imageName = [self.delegate flashButtonClicked];
        [button setImage:[AlivcImage imageNamed:imageName] forState:0];
    }
}


/**
 前置、后置摄像头切换按钮的点击事件

 @param sender 前置、后置摄像头切换按钮
 */
- (void)cameraIdButtonClicked:(id)sender
{
    if (CFAbsoluteTimeGetCurrent()-_cameraIdButtonClickTime >1.2) {//限制连续点击时间间隔不能小于1s
//        NSLog(@"=============>切换摄像头");
        _cameraIdButtonClickTime =CFAbsoluteTimeGetCurrent();
        if (self.delegate && [self.delegate respondsToSelector:@selector(cameraIdButtonClicked)]) {
            [self.delegate cameraIdButtonClicked];
        }
    }
}


/**
 定时器按钮的点击事件

 @param sender 定时器按钮
 */
- (void)timerButtonClicked:(id)sender{
    if (self.delegate && [self.delegate respondsToSelector:@selector(timerButtonClicked)]) {
        [self.delegate timerButtonClicked];
        self.triangleImageView.hidden = YES;
        self.tapButton.hidden = YES;
        self.longPressButton.hidden = YES;
        self.selectVideoBtn.hidden = YES;
        self.timeLabel.text = @"";
    }
    self.countdownButton.enabled = NO;
}


/**
 音乐按钮的点击事件

 @param sender 音乐按钮
 */
- (void)musicButtonClicked:(id)sender
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(musicButtonClicked)]) {
        [self.delegate musicButtonClicked];
    }
}

- (void)filterButtonClicked:(id)sender {
    if (self.delegate && [self.delegate respondsToSelector:@selector(filterButtonClicked)]) {
        [self.delegate filterButtonClicked];
    }
}
/**
 回删按钮的点击事件
 */
- (void)deletePartClicked {
    if ([self.delegate respondsToSelector:@selector(deleteButtonClicked)]) {
        [self.delegate deleteButtonClicked];
    }
}


/**
 完成按钮的点击事件
 */
- (void)finishButtonClicked {
    if ([self.delegate respondsToSelector:@selector(finishButtonClicked)]) {
        [self.delegate finishButtonClicked];
    }
}

- (void)enableFinishButton:(BOOL)enable {
    self.finishButton.enabled = enable;
    if (enable) {
        UIColor *bgColor_enable =  [UIColor colorWithRed:252/255.0 green:68/255.0 blue:72/255.0 alpha:1/1.0];
        self.finishButton.backgroundColor = bgColor_enable;
    } else {
        UIColor *bgColor_disable = [UIColor colorWithRed:0/255.0 green:0/255.0 blue:0/255.0 alpha:0.34];
        self.finishButton.backgroundColor = bgColor_disable;
    }
}

@end
