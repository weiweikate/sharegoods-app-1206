//
//  WelcomeView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/12/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WelcomeView.h"
@class WelcomePageControl;
@interface WelcomeView()<UIScrollViewDelegate>
@property(nonatomic, assign)NSInteger currentIndex;
@property(nonatomic, strong)UIScrollView *scrollView;
@property(nonatomic, strong)WelcomePageControl *pageControl;
@end

@implementation WelcomeView
- (instancetype)initWithData:(NSArray *)data
{
  if (self = [super init]) {
    self.backgroundColor = [UIColor whiteColor];
    self.scrollView = [UIScrollView new];
    self.scrollView.showsHorizontalScrollIndicator = NO;
    self.scrollView.pagingEnabled = YES;
    self.scrollView.delegate = self;
    self.scrollView.frame = CGRectMake(0, 0, KScreenWidth, KScreenHeight);
    [self addSubview:self.scrollView];
    _pageControl = [[WelcomePageControl alloc]initWithNumber:data.count];
    [self addSubview:_pageControl];
    _pageControl.center = CGPointMake(KScreenWidth / 2.0, KScreenHeight-5- (kStatusBarHeight == 44 ? 34 : 0) - 30);
    self.currentIndex = 0;
    self.data = data;
  }
  return self;
}

- (void)setData:(NSArray *)data
{
  _data = data;
   [self.scrollView removeAllSubviews];
  for (int i = 0; i < data.count; i++) {
    UIImageView * imgView = [UIImageView new];
    imgView.image = [UIImage imageNamed:data[i]];
    imgView.tag = 100 + i;
    [self.scrollView addSubview:imgView];
    imgView.frame = CGRectMake(KScreenWidth * i, 0, KScreenWidth, KScreenHeight);
    UIImageView *imgView2 = [[UIImageView alloc]initWithImage:[UIImage imageNamed:[NSString stringWithFormat:@"welcome%d", i+1]]];
    imgView2.contentMode = UIViewContentModeScaleAspectFit;
    [imgView addSubview:imgView2];
    imgView2.frame = imgView.bounds;
    
    if (i+1 == data.count) {
      imgView.userInteractionEnabled = YES;
      imgView2.userInteractionEnabled = YES;
      
      UIButton *btn = [UIButton new];
      [btn addTarget:self action:@selector(tap) forControlEvents:UIControlEventTouchUpInside];
      [btn setTitle:@"立即开启" forState:0];
      [btn setTitleColor:[UIColor colorWithHexString:@"f00050"] forState:0];
      btn.backgroundColor = [UIColor whiteColor];
      btn.titleLabel.font = [UIFont systemFontOfSize:14];
      btn.layer.cornerRadius= 15;
      btn.clipsToBounds = YES;
      [imgView2 addSubview:btn];
      btn.bounds = CGRectMake(0, 0, 120, 35);
      btn.center = CGPointMake(KScreenWidth / 2.0, KScreenHeight - 17.5 - (kStatusBarHeight == 44 ? 34 : 0) - 60);
    }
  }
  self.scrollView.contentSize = CGSizeMake(KScreenWidth * data.count, KScreenHeight);
}

- (void)tap{
  [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"isNotFrist"];
  [UIView animateWithDuration:1.5 animations:^{
    self.alpha = 0;
    self.transform = CGAffineTransformScale(CGAffineTransformIdentity, 1.1, 1.1);
  } completion:^(BOOL finished) {
    [self removeFromSuperview];
  }];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
   NSInteger index = round(scrollView.contentOffset.x / KScreenWidth);
  if (_currentIndex == index) {
    return;
  }
  _currentIndex = index;
  self.pageControl.currentIndex = index;
}
@end

@implementation  WelcomePageControl
- (instancetype)initWithNumber:(NSInteger)num
{
  if (self = [super init]) {
    _views = [NSMutableArray new];
    self.bounds = CGRectMake(0, 0, 10*num + 25*(num - 1), 10);
    for (int i = 0; i< num; i++) {
      UIView *view = [UIView new];
      view.layer.cornerRadius = 5;
      view.layer.borderWidth = 1;
      view.layer.borderColor = [UIColor whiteColor].CGColor;
      view.frame = CGRectMake(35*i, 0, 10, 10);
      [self addSubview: view];
      [_views addObject:view];
    }
    self.currentIndex = 0;
  }
  return self;
}

- (void)setCurrentIndex:(NSInteger)currentIndex
{
  if (currentIndex >  self.views.count - 1) {
    return;
  }
  [UIView animateWithDuration:0.5 animations:^{
    self.views[_currentIndex].backgroundColor = [UIColor clearColor];
    self.views[_currentIndex].bounds = CGRectMake(0, 0, 10, 10);
    self.views[currentIndex].backgroundColor = [UIColor whiteColor];
    self.views[currentIndex].bounds = CGRectMake(0, 0, 9, 9);
  }];
  _currentIndex = currentIndex;
}


@end
