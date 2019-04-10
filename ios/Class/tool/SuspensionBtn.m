//
//  SuspensionBtn.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/4/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "SuspensionBtn.h"

@implementation SuspensionBtn

-(instancetype)initWithFrame:(CGRect)frame{
  if (self = [super initWithFrame:frame]) {
     [self initBtn];
  }
  return self;
}
-(instancetype)init{
  if (self = [super init]) {
    [self initBtn];
  }
  return self;
}

-(void)initBtn{
  UIPanGestureRecognizer *panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePan:)];
   [self addGestureRecognizer:panGestureRecognizer];
}
- (void) handlePan:(UIPanGestureRecognizer*) recognizer{
  CGPoint translation = [recognizer translationInView:[UIApplication sharedApplication].delegate.window.rootViewController.view];
  CGFloat centerX=recognizer.view.center.x+ translation.x;
  CGFloat thecenter=0;
  recognizer.view.center=CGPointMake(centerX,recognizer.view.center.y+ translation.y);
  [recognizer setTranslation:CGPointZero inView:self.window.rootViewController.view];
  
  if(recognizer.state==UIGestureRecognizerStateEnded|| recognizer.state==UIGestureRecognizerStateCancelled) {
    if(centerX>KScreenWidth/2) {
      thecenter=KScreenWidth-80/2;
    }else{
      thecenter=80/2;
    }
    [UIView animateWithDuration:0.3 animations:^{
      recognizer.view.center=CGPointMake(thecenter, recognizer.view.center.y+ translation.y);
    }];
  }
}

@end
