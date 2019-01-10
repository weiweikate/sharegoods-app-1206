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
//#define ImageStr @"https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/ad_index/sgad.png"
#define ImageStr @"https://testcdn.sharegoodsmall.com/sharegoods/resource/sg/images/ad_index/sgad.png"
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
//    self.shapeLayer2 = [CAShapeLayer new];
//    _shapeLayer2.lineWidth = 3;
//    _shapeLayer2.strokeColor = [[UIColor colorWithHexString:@"aaaaaa"]colorWithAlphaComponent:0.5] .CGColor;
//    _shapeLayer2.fillColor = [UIColor clearColor].CGColor;
//    _shapeLayer2.strokeStart = 0;
//    _shapeLayer2.strokeEnd = 1;
//    [self.layer addSublayer:_shapeLayer2];
    
    self.shapeLayer = [CAShapeLayer new];
//    _shapeLayer.lineWidth = 3;
//    _shapeLayer.strokeColor = [UIColor redColor].CGColor;
//    _shapeLayer.fillColor = [UIColor clearColor].CGColor;
//    _shapeLayer.strokeStart = 0;
//    _shapeLayer.strokeEnd = 1;
//    [self.layer addSublayer:_shapeLayer];
    
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
//  CABasicAnimation *an = [CABasicAnimation animationWithKeyPath:@"strokeEnd"];
//  an.fromValue = @1;
//  an.toValue = @0;
//  an.duration = self.num;
//  an.fillMode = kCAFillModeForwards;
//  an.removedOnCompletion = NO;
//  [self.shapeLayer addAnimation:an forKey:nil];
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
//  self.shapeLayer.frame = self.bounds;
//  self.shapeLayer2.frame = self.bounds;
  self.label.frame = self.bounds;;
//  UIBezierPath *path = [UIBezierPath new];
//  //  [path moveToPoint:CGPointMake(self.width/2.0, 2)];
//  [path addArcWithCenter:CGPointMake(self.width/2.0, self.height/2.0) radius:self.width/2.0-2 startAngle:M_PI_2*3 endAngle:M_PI_2*3+0.0001  clockwise:NO];
//  _shapeLayer.path = path.CGPath;
//  self.shapeLayer2.path = path.CGPath;
}
@end
@interface AdView()
@property (nonatomic, strong)UIImageView *launchImgView;
@property (nonatomic, strong)UIImageView *adImgView;
@property (nonatomic, strong)UIImageView *logoImgView;
@property (nonatomic, strong)TimerView *timerView;
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


- (void)loadAd
{
  YYWebImageManager * imageManager =  [YYWebImageManager sharedManager];
  imageManager.cache.diskCache.ageLimit = 60*60*24;
  
  YYWebImageOperation* operation = [ imageManager requestImageWithURL:[NSURL URLWithString:ImageStr] options:YYWebImageOptionUseNSURLCache | YYWebImageOptionIgnoreFailedURL  progress:^(NSInteger receivedSize, NSInteger expectedSize) {
    
  } transform:^UIImage * _Nullable(UIImage * _Nonnull image, NSURL * _Nonnull url) {
    return image;
  } completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (image) {//开始广告播放
        self.adImgView.image = image;
        self.logoImgView.image = [UIImage imageNamed:@"default_logo"];
        self.timerView.hidden = NO;
        [self.timerView start];
        [self.launchImgView removeFromSuperview];
      }else{//无广告
        self.isPlayAd = YES;
      }
    });
  }];
  
  [self performSelectorWithArgs:@selector(cancelOperation:) afterDelay:3,operation];
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
  
  CGFloat imageHeight = self.width*1140/750.0;
  _adImgView.frame = CGRectMake(0, 0, self.width, imageHeight);
  _logoImgView.bounds = CGRectMake(0, 0, 200/2, 150/2);
  _logoImgView.center = CGPointMake(self.width/2.0, (self.height+imageHeight)/2.0);
  _adImgView.subviews.firstObject.frame = CGRectMake(self.width - 30, imageHeight - 20, 30, 20);
  _timerView.bounds = CGRectMake(0, 0, 60, 30);
  _timerView.center = CGPointMake(self.width - 30 - 15, kStatusBarHeight + 15);
  
}

- (UIImageView*)adImgView
{
  if (!_adImgView) {
    _adImgView = [UIImageView new];
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
