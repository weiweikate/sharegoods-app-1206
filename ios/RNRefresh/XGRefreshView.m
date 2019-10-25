//
//  XGRefreshView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/9/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "XGRefreshView.h"
#import "RefreshLineVIew.h"
#import <Lottie/Lottie.h>

#define px2d [UIScreen mainScreen].bounds.size.width/375.0
@interface XGRefreshView ()

@property (nonatomic, assign) MJRefreshState preState;
@property(nonatomic, strong)RefreshLineVIew *line;
@property(nonatomic, strong)LOTAnimationView *anView;
@property(nonatomic, strong)UILabel *stateLb;
@end

@implementation XGRefreshView

-(void)dealloc {
    NSLog(@"dealloc");
}

-(instancetype)init {
    self = [super init];
    if (self) {
      _preState = MJRefreshStateIdle;
      self.frame = CGRectMake(0, 0, KScreenWidth, 90*px2d);
      _line = [RefreshLineVIew new];
      _line.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 1);
      _line.layer.zPosition = 2;
      
      _anView = [LOTAnimationView animationNamed:@"pullnoline.json" inBundle:[NSBundle mainBundle]];
      _anView.frame = CGRectMake(0, 0, KScreenWidth, 55*px2d);
      _anView.autoReverseAnimation = NO;
      [self addSubview:_anView];
      
      _stateLb = [UILabel new];
      _stateLb.text = @"下拉刷新";
      _stateLb.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
       _stateLb.font = [UIFont systemFontOfSize:11];
      _stateLb.frame = CGRectMake(0, 55*px2d, KScreenWidth, 20*px2d);
      _stateLb.textAlignment = 1;
        [self addSubview:_stateLb];
    }
    return self;
}

- (void)setState:(MJRefreshState)state {
    [super setState:state];

        if (state == MJRefreshStateIdle && (_preState == MJRefreshStateRefreshing || _preState == MJRefreshStateWillRefresh)) {
           // 结束刷新
               dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                  self.line.hidden = NO;
                  _stateLb.text = @"下拉刷新";
                });
           _stateLb.text = @"刷新完成";
        } else if (state == MJRefreshStateRefreshing){
          _stateLb.text = @"正在刷新...";
            self.line.hidden = NO;
            CABasicAnimation * a =[CABasicAnimation animationWithKeyPath:@"strokeStart"];
             a.fromValue = @0;
             a.toValue = @1;
             a.duration = 0.2;
             a.repeatCount = 1;
             [_line.rightLine addAnimation:a forKey:@""];
             [_line.leftLine addAnimation:a forKey:@""];
             dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.19 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
               self.line.hidden = YES;
             });
          [_anView playFromProgress:0
              toProgress:1
          withCompletion:nil];
        } else if(state == MJRefreshStatePulling){
         self.line.hidden = NO;
           _stateLb.text = @"松开刷新";
        }else{
          self.line.hidden = NO;
           _stateLb.text = @"下拉刷新";
        }
    
    _preState = state;
}

-(void)scrollViewContentOffsetDidChange:(NSDictionary *)change {
    [super scrollViewContentOffsetDidChange:change];
        CGPoint newPoint = [change[@"new"] CGPointValue];
      //  CGPoint oldPoint = [change[@"old"] CGPointValue];
     
        CGFloat y = newPoint.y;
      if (y<=0) {
        self.line.mj_y = y;
        self.line.strokeEnd = -y/self.height;
      }
    }


-(void)didMoveToSuperview
{
   [super didMoveToSuperview];
   [self.superview addSubview:_line];
}

@end
