//
//  ShopCartCell.m
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ShopCartCell.h"

@implementation ShopCartCell


-(instancetype)initWithFrame:(CGRect)frame{
  if(self = [super initWithFrame:frame]){
    
//    [self startAnimation];
    [self setBackgroundColor:[UIColor lightGrayColor]];
    self.clipsToBounds = YES;
    self.layer.cornerRadius = 10;
  }
  return self;
}
-(void)setIsBeginAnimation:(BOOL)isBeginAnimation{
  if (_isBeginAnimation != isBeginAnimation) {
    _isBeginAnimation = isBeginAnimation;
//     [self startAnimation];
  }
}

-(void)setItemData:(NSDictionary *)itemData{
  NSLog(@"itemData ----- %@",itemData);
}
-(void)startAnimation{
  self.transform = CGAffineTransformScale(self.transform,0.6 ,0.6);
  self.alpha = 0.2;
//  self.width = self.width / 2;
//  self.height = self.height/2;
//  [UIView animateWithDuration:0.3 animations:^{
//     self.transform = CGAffineTransformIdentity;
////    self.width = self.width * 2;
////    self.height = self.height * 2;
//  }];
  [UIView animateWithDuration:0.5
                        delay:0.1
       usingSpringWithDamping:0.4
        initialSpringVelocity:0
                      options:UIViewAnimationOptionCurveEaseOut
                   animations:^{
                     self.transform = CGAffineTransformIdentity;
                      self.alpha = 1;
                   } completion:^(BOOL finished) {

                   }];
}
- (void)layoutSubviews{
  NSLog(@"%lf",self.frame.size.height);
  if (self.isBeginAnimation) {
    [self startAnimation];
    _isBeginAnimation = false;
  }
}

@end
