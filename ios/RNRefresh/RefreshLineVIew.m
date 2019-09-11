//
//  RefreshLineVIew.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/9/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RefreshLineVIew.h"

@implementation RefreshLineVIew
-(instancetype)init{
  if (self = [super init]) {
    _leftLine = [CAShapeLayer new];
    _leftLine.strokeStart = 0;
    _leftLine.strokeEnd = 0;
    [self.layer addSublayer:_leftLine];
    _leftLine.strokeColor = [UIColor colorWithHexString:@"FF0050"].CGColor;
    
    _rightLine = [CAShapeLayer new];
    _rightLine.strokeStart = 0;
    _rightLine.strokeEnd = 0;
    [self.layer addSublayer:_rightLine];
    _rightLine.strokeColor = [UIColor colorWithHexString:@"FF0050"].CGColor;
  
  }
  return self;
}

-(void)layoutSubviews
{
  [super layoutSubviews];
  _leftLine.frame = CGRectMake(0, 0, self.width/2.0, self.height);
  UIBezierPath *path = [UIBezierPath new];
  [path moveToPoint:CGPointMake(0, self.height/2.0)];
  [path addLineToPoint:CGPointMake(self.width/2.0, self.height/2.0)];
  _leftLine.path = path.CGPath;
  _leftLine.lineWidth = self.height;
  
  _rightLine.frame = CGRectMake(self.width/2.0, 0, self.width/2.0, self.height);
  path = [UIBezierPath new];
  [path moveToPoint:CGPointMake(self.width/2.0, self.height/2.0)];
  [path addLineToPoint:CGPointMake(0, self.height/2.0)];
  _rightLine.path = path.CGPath;
  _rightLine.lineWidth = self.height;
}

- (void)setStrokeStart:(CGFloat)strokeStart{
  _strokeStart = strokeStart;
  _leftLine.strokeStart = strokeStart;
  _rightLine.strokeStart = strokeStart;
}

- (void)setStrokeEnd:(CGFloat)strokeEnd
{
  _strokeEnd = strokeEnd;
  _leftLine.strokeEnd = strokeEnd;
  _rightLine.strokeEnd = strokeEnd;
}


@end
