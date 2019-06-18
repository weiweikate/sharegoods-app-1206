//
//  AdView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/4.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "AdView.h"
#import "UIImage+Util.h"
#import "AppDelegate.h"
#import "StorageFromRN.h"
#import "NSDictionary+Util.h"
#import "GongMaoVC.h"
#define bg @"/app/start_adv_bg.png"
#define ad @"/app/start_adv.png"
#define Nums 3

@interface TimerView: UIView
@property(nonatomic, assign)NSInteger num;
-(instancetype)initWithNum:(NSInteger)num;
-(void)start;
-(void)stop;
@property(nonatomic, strong)CAShapeLayer *shapeLayer;
@property(nonatomic, strong)CAShapeLayer *shapeLayer2;
@property(nonatomic, strong)UILabel *label;
@property(nonatomic, copy)void(^finishBlock)();
@end
@implementation TimerView
-(instancetype)initWithNum:(NSInteger)num
{
  if (self = [super init]) {
    self.num = num;

    self.shapeLayer = [CAShapeLayer new];

    self.label = [UILabel new];
    [self addSubview:self.label];
    self.label.textAlignment = 1;
    self.label.layer.cornerRadius = 15;
    self.label.textColor = [UIColor whiteColor];
    self.label.font = [UIFont systemFontOfSize:10];
    self.label.backgroundColor = [[UIColor colorWithHexString:@"000000"]colorWithAlphaComponent:0.2];
    //    self.label.layer.borderWidth = 2;
    self.label.clipsToBounds = YES;
    self.label.text = [NSString stringWithFormat:@"跳过%lds",num];

  }
  return self;
}
-(void)start{

  NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(handleTimer:) userInfo:nil repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
  [timer fire];
}

- (void)handleTimer:(NSTimer *)timer
{
  self.num --;
  self.label.text = [NSString stringWithFormat:@"跳过%lds",self.num];
  if (self.num > 0) {

  }else{
    [timer invalidate];
    timer = nil;
    self.finishBlock();
  }
}
-(void)stop{

}

- (void)layoutSubviews
{
  [super layoutSubviews];
  self.label.frame = self.bounds;
}
@end
@interface AdView()
@property (nonatomic, strong)UIImageView *bgView;
@property (nonatomic, strong)UIImageView *launchImgView;
@property (nonatomic, strong)UIImageView *adImgView;
@property (nonatomic, strong)UIImageView *logoImgView;
@property (nonatomic, strong)TimerView *timerView;

@property (nonatomic, strong)UIImage *adImg;
@property (nonatomic, strong)UIImage *bgImg;
@property(nonatomic, strong)NSString *linkTypeCode;
@property(nonatomic, assign)BOOL tap;
@end
@implementation AdView

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect {
 // Drawing code
 }
 */

- (instancetype)init
{
  if (self = [super init]) {
    UIImageView *imgView = [UIImageView new];
    self.backgroundColor = [UIColor whiteColor];
    imgView.image = [UIImage getLaunchImage];
    [self addSubview:imgView];
    self.launchImgView = imgView;
    [self loadAd];
  }
  return self;
}

+ (void)preImage{
  NSDictionary *data = [[NSUserDefaults standardUserDefaults] objectForKey:@"sg_ad"];
  NSString * bgPath = data[@"image"];
  NSString * imagePath = data[@"assistantImage"];
  if (bgPath) {
    [self loadImage:bgPath];
  }
  if (imagePath) {
    [self loadImage:imagePath];
  }
}


- (void)loadAd
{
  NSDictionary *data = [[NSUserDefaults standardUserDefaults] objectForKey:@"sg_ad"];
  NSString * bgPath = data[@"image"];
  NSString * imagePath = data[@"assistantImage"];
  _linkTypeCode = data[@"linkTypeCode"];
  if (!data || !bgPath) {
    self.isPlayAd = YES;
    return;
  }

  UIImage* tmp = nil;

  if (imagePath) {
    tmp =  [[YYWebImageManager sharedManager].cache getImageForKey:imagePath];
    self.adImg = tmp;
  }
  tmp = [[YYWebImageManager sharedManager].cache getImageForKey:bgPath];
  if (tmp) {
    self.bgImg = tmp;
  }else{
    //无广告
    self.isPlayAd = YES;
    return;
  }

}

+ (void)loadImage:(NSString *)str{
  YYWebImageManager * imageManager =  [YYWebImageManager sharedManager];
  imageManager.cache.diskCache.ageLimit = 60*60*24*7;
  [imageManager requestImageWithURL:[NSURL URLWithString:str] options:  YYWebImageOptionIgnoreFailedURL | YYWebImageOptionIgnoreDiskCache  progress:^(NSInteger receivedSize, NSInteger expectedSize) {

  } transform:^UIImage * _Nullable(UIImage * _Nonnull image, NSURL * _Nonnull url) {
    return image;
  } completion:nil];

}

- (void)requestImageWithPath: (NSString *)str
                  completion:(YYWebImageCompletionBlock)completion
{
  YYWebImageManager * imageManager =  [YYWebImageManager sharedManager];
  imageManager.cache.diskCache.ageLimit = 60*60*24*7;
  YYWebImageOperation* operation = [imageManager requestImageWithURL:[NSURL URLWithString:str] options:  YYWebImageOptionIgnoreFailedURL  progress:^(NSInteger receivedSize, NSInteger expectedSize) {

  } transform:^UIImage * _Nullable(UIImage * _Nonnull image, NSURL * _Nonnull url) {
    return image;
  } completion:completion];

  [self performSelectorWithArgs:@selector(cancelOperation:) afterDelay:1,operation];
}

- (void)cancelOperation:(YYWebImageOperation*)operation
{
  [operation cancel];
}



- (void)addToWindow{
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [delegate.window addSubview:self];
  self.frame = delegate.window.bounds;
}

- (void)setAdImg:(UIImage *)adImg
{
  _adImg = adImg;
}

- (void)setBgImg:(UIImage *)bgImg
{
  _bgImg = bgImg;
  [self showAd];
}

- (void)showAd{
  if (_bgImg) {
    //开始广告播放
    self.bgView.image = _bgImg;
    self.adImgView.image = _adImg;
    self.logoImgView.image = [UIImage imageNamed:@"default_logo"];
    self.timerView.hidden = NO;
    [self.timerView start];
    [self.launchImgView removeFromSuperview];
  }
}
- (void)setIsLoadJS:(BOOL)isLoadJS
{
  _isLoadJS = isLoadJS;
  [self removeFromWindow];
}

- (void)setIsPlayAd:(BOOL)isPlayAd
{
  _isPlayAd = isPlayAd;
  [self removeFromWindow];
}
- (void)removeFromWindow{
  if (self.isLoadJS && self.isPlayAd) {
    [UIView animateWithDuration:1.5 animations:^{
      self.alpha = 0;
      self.transform = CGAffineTransformScale(CGAffineTransformIdentity, 1.1, 1.1);
    } completion:^(BOOL finished) {
      //      [self removeFromSuperview];
    }];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [self removeFromSuperview];
    });
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  self.launchImgView.frame = self.bounds;

  CGFloat imageHeight = self.height - 100 -19 - 23;
  _bgView.frame = CGRectMake(0, 0, self.width, imageHeight);
  _adImgView.frame = CGRectMake(0, 0, self.width, imageHeight);
  _logoImgView.bounds = CGRectMake(0, 0, 200/2, 150/2);
  _logoImgView.center = CGPointMake(self.width/2.0,self.height - 50 - 19);
  _adImgView.subviews.firstObject.frame = CGRectMake(self.width - 30, imageHeight - 20, 30, 20);
  _timerView.bounds = CGRectMake(0, 0, 60, 30);
  _timerView.center = CGPointMake(self.width - 30 - 15, kStatusBarHeight + 15);

}

- (UIImageView*)adImgView
{
  if (!_adImgView) {
    _adImgView = [UIImageView new];
    _adImgView.contentMode = UIViewContentModeScaleAspectFit;
    _adImgView.userInteractionEnabled = YES;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(AdTap)];
    [_adImgView addGestureRecognizer:tap];
    [self addSubview:_adImgView];
    UILabel *label = [UILabel new];
    label.textAlignment = 1;
    label.font = [UIFont systemFontOfSize:10];
    label.textColor = [UIColor whiteColor];
    label.backgroundColor = [[UIColor colorWithHexString:@"000000"] colorWithAlphaComponent:0.3];
    label.text = @"广告";
    [_adImgView addSubview:label];
  }
  return _adImgView;
}

- (void)AdTap
{
  self.isPlayAd = YES;
  [self removeFromWindow];
  if (_linkTypeCode && _linkTypeCode.length > 0 && !_tap) {
    _tap = YES;
    [[NSNotificationCenter defaultCenter] postNotificationName:@"EventToRN" object:@{@"uri": _linkTypeCode}];
  }
}

- (UIImageView *)bgView
{
  if (!_bgView) {
    _bgView = [UIImageView new];
    _bgView.clipsToBounds = YES;
    _bgView.contentMode = UIViewContentModeScaleAspectFill;
    [self addSubview:_bgView];
  }
  return _bgView;
}

- (UIImageView *)logoImgView
{
  if (!_logoImgView) {
    _logoImgView = [UIImageView new];
    _logoImgView.layer.cornerRadius = 5;
    _logoImgView.clipsToBounds = YES;
    [self addSubview:_logoImgView];
  }
  return _logoImgView;
}

- (TimerView *)timerView
{
  if (!_timerView) {
    _timerView = [[TimerView alloc]initWithNum: Nums];
    __weak typeof(self) weakself = self;
    _timerView.finishBlock = ^{
      weakself.isPlayAd=YES;
      [weakself removeFromWindow];
    };
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(skip)];
    [_timerView addGestureRecognizer:tap];
    [self addSubview:_timerView];
  }
  return _timerView;
}

- (void)skip
{
  self.isPlayAd = YES;
}
@end
