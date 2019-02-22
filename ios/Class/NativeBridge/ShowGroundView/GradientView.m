//
//  GradientView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/22.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "GradientView.h"

@implementation GradientView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)layoutSubviews
{
  [super layoutSubviews];
  self.gradientLayer.frame = self.bounds;
}

- (CAGradientLayer *)gradientLayer
{
  if (!_gradientLayer) {
    _gradientLayer = [CAGradientLayer new];
    [self.layer addSublayer:_gradientLayer];
  }
  return _gradientLayer;
}

//- (void)setColors:(NSArray *)colors
//{
//  _colors = colors;
//  self.gradientLayer.colors = colors;
//}
//
//- (void)setLocations:(NSArray<NSNumber *> *)locations
//{
//  _locations = locations;
//  self.gradientLayer.locations = locations;
//}

@end
