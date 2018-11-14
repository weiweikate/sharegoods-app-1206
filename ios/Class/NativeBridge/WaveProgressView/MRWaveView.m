//
//  MRWaveView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MRWaveView.h"
#import "TYWaterWaveView.h"
@interface MRWaveView()
@property(nonatomic, strong)TYWaterWaveView * waveView;
@property(nonatomic, strong)UILabel * label;
@end
@implementation MRWaveView

- (void)startWave
{
  [_waveView startWave];

}

- (void)stopWave
{
  [_waveView stopWave];
}

- (void)resetWave
{
  [_waveView reset];
}

- (void)dealloc{
  [self stopWave];
}

- (instancetype)initWithFrame:(CGRect)frame{
  if (self = [super initWithFrame:frame]) {
    _waveView = [[TYWaterWaveView alloc]initWithFrame:frame];
    _label = [UILabel new];
    _label.textAlignment = 1;
//    [_label sizeToFit];
    [self startWave];
    [self addSubview:_waveView];
    [self addSubview:_label];
    self.clipsToBounds = YES;
  }
  return self;
}

- (void)layoutSubviews{
  _waveView.frame = self.bounds;
  self.layer.cornerRadius = MIN(self.width/2.0, self.height/2.0);
  _label.frame = CGRectMake(0, self.bounds.size.height/6, self.bounds.size.width, _topTitleSize);
//  _label.center = CGPointMake(self.center.x, self.height/6 + _label.height/2);
}

- (void)setWaveColor:(NSNumber *)waveColor
{
  _waveColor = waveColor;
  
  _waveView.firstWaveColor = [self getColor:[NSString stringWithFormat:@"%x",[waveColor intValue]]];
  
}

- (void)setWaveLightColor:(NSNumber *)waveLightColor
{
  _waveLightColor = waveLightColor;
  _waveView.secondWaveColor = [self getColor:[NSString stringWithFormat:@"%x",[waveLightColor intValue]]];
  
}

- (void)setProgressValue:(NSInteger)progressValue
{
  _progressValue = progressValue;
  _waveView.percent = progressValue / 100.0;
}

- (void)setWaveBackgroundColor:(NSNumber *)waveBackgroundColor
{
  _waveBackgroundColor = waveBackgroundColor;
   self.backgroundColor = [self getColor:[NSString stringWithFormat:@"%x",[waveBackgroundColor intValue]]];
}

- (UIColor *)getColor:(NSString *)colorStr
{
  NSString * a = [colorStr substringWithRange:NSMakeRange(0, 2)];
  NSString * r = [colorStr substringWithRange:NSMakeRange(2, 2)];
  NSString * g = [colorStr substringWithRange:NSMakeRange(4, 2)];
  NSString * b = [colorStr substringWithRange:NSMakeRange(6, 2)];
  
  CGFloat a1 = [self numberWithHexString:a] / 255.0;
  CGFloat r1 = [self numberWithHexString:r] / 255.0;
  CGFloat g1 = [self numberWithHexString:g] / 255.0;
  CGFloat b1 = [self numberWithHexString:b] / 255.0;
  
  return [UIColor colorWithRed:r1 green:g1 blue:b1 alpha:a1];
}

- (NSInteger)numberWithHexString:(NSString *)hexString{
  
  const char *hexChar = [hexString cStringUsingEncoding:NSUTF8StringEncoding];
  
  int hexNumber;
  
  sscanf(hexChar, "%x", &hexNumber);
  
  return (NSInteger)hexNumber;
}

- (void) setTopTitle:(NSString *)topTitle{
  _topTitle = topTitle;
  _label.text = topTitle;
}


- (void)setTopTitleSize:(NSInteger)topTitleSize
{
  _topTitleSize = topTitleSize;
  _label.font = [UIFont systemFontOfSize:topTitleSize];
}
- (void)setTopTitleColor:(NSNumber *)topTitleColor
{
  _topTitleColor = topTitleColor;
  _label.textColor =  [self getColor:[NSString stringWithFormat:@"%x",[topTitleColor intValue]]];
}


@end
