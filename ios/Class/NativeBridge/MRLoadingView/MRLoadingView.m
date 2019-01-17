//
//  MRLoadingView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MRLoadingView.h"
@interface MRLoadingView()
  @property(nonatomic, strong)UIActivityIndicatorView * indicatorView;
@end
@implementation MRLoadingView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
  
  - (instancetype)init
  {
    self = [super init];
    if (self) {
      [self setUpSubView];
    }
    return self;
  }
  
  - (void)setUpSubView{
    self.indicatorView = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    self.indicatorView.tintColor = [UIColor whiteColor];
    [self.indicatorView startAnimating];
    [self addSubview:self.indicatorView];
//    self.indicatorView.frame = CGRectMake(10, 10, 50, 50);
  }
  
  - (void)layoutSubviews{
    [super layoutSubviews];
    self.indicatorView.center = CGPointMake(self.width/2.0, self.height/2.0);
    self.indicatorView.bounds = CGRectMake(0, 0, self.width/7.0*5, self.height/7.0*5);
  }

@end
