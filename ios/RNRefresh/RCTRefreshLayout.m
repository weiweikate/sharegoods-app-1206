//
//  RCTRefreshLayout
//  RNTemplate
//
//  Created by RuanMei on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTRefreshLayout.h"
#import "RefreshLineVIew.h"
@interface RCTRefreshLayout ()

@property (nonatomic, assign) MJRefreshState preState;
@property(nonatomic, strong)RefreshLineVIew *line;
@end

@implementation RCTRefreshLayout

-(void)dealloc {
    NSLog(@"dealloc");
}

-(instancetype)init {
    self = [super init];
    if (self) {
        _preState = MJRefreshStateIdle;
      _line = [RefreshLineVIew new];
      _line.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 1);
      _line.layer.zPosition = 2;
    }
    return self;
}

- (void)setState:(MJRefreshState)state {
  if (state == MJRefreshStateRefreshing) {
    CABasicAnimation * a =[CABasicAnimation animationWithKeyPath:@"strokeStart"];
    a.fromValue = @0;
    a.toValue = @1;
    a.duration = 0.2;
    a.repeatCount = 1;
    [_line.rightLine addAnimation:a forKey:@""];
    [_line.leftLine addAnimation:a forKey:@""];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      self.line.hidden = YES;
    });
  }else if (state == MJRefreshStateIdle && self.state == MJRefreshStateRefreshing){
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      self.line.hidden = NO;
    });
  }else{
     self.line.hidden = NO;
  }
    [super setState:state];
    if (self.onChangeState) {
        if (state == MJRefreshStateIdle && (_preState == MJRefreshStateRefreshing || _preState == MJRefreshStateWillRefresh)) {
            self.onChangeState(@{@"state":@(4)}); // 结束刷新
        } else if (state == MJRefreshStateWillRefresh){
            self.onChangeState(@{@"state":@(3)}); // 正在刷新
        } else {
            self.onChangeState(@{@"state":@(state)});
        }
    }
    _preState = state;
}

-(void)scrollViewContentOffsetDidChange:(NSDictionary *)change {
    [super scrollViewContentOffsetDidChange:change];
    if (self.onChangeOffset) {
        CGPoint newPoint = [change[@"new"] CGPointValue];
        CGPoint oldPoint = [change[@"old"] CGPointValue];
        if (!CGPointEqualToPoint(newPoint, oldPoint)) {
            self.onChangeOffset(@{@"offset":@(fabs(newPoint.y))});
        }
        CGFloat y = newPoint.y;
      if (y<=0) {
        self.line.mj_y = y;
        self.line.strokeEnd = -y/self.height;
      }
    }
}

- (void)setRefreshing:(BOOL)refreshing {
    if (refreshing && self.state == MJRefreshStateIdle) {
        MJRefreshDispatchAsyncOnMainQueue({
            [self beginRefreshing];
        })
    } else if (!refreshing && (self.state == MJRefreshStateRefreshing || self.state == MJRefreshStateWillRefresh)) {
        __weak typeof(self) weakSelf = self;
        [self endRefreshingWithCompletionBlock:^{
            typeof(weakSelf) self = weakSelf;
            if (self.onChangeState) {
                self.onChangeState(@{@"state":@(MJRefreshStateIdle)});
            }
        }];
    }
}

-(void)didMoveToSuperview
{
   [super didMoveToSuperview];
    [self.superview addSubview:_line];
}

@end
