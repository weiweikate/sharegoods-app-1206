//
//  OCExampleViewController.m
//  JXPagingView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import "PagingViewController.h"
#import "JXPagerView.h"
#import "JXCategoryView.h"
#import "TestListBaseView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "ShowHeaderView.h"
#import <SDAutoLayout.h>
#import "SwichView.h"
#import <MJRefresh/MJRefresh.h>
#import "NetWorkTool.h"
static const CGFloat JXTableHeaderViewHeight = 200;
static const CGFloat JXheightForHeaderInSection = 50;
static const NSString * USERTYPE_mineWriter = @"mineWriter";
static const NSString * USERTYPE_mineNormal = @"mineNormal";
static const NSString * USERTYPE_others = @"others";

@interface PagingViewController () <JXPagerViewDelegate>
@property (nonatomic, strong) JXPagerView *pagingView;
@property (nonatomic, strong) NSArray <NSString *> *titles;
@property(nonatomic, strong)UIView *headerView;
@property(nonatomic, strong)SwichView *swichView;
@property (nonatomic, strong)SwichViewNavi *Navi;
@end

@implementation PagingViewController
- (instancetype)init
{
  if (self = [super init]) {
    
    _pagingView = [[JXPagerView alloc] initWithDelegate:self];
    [self addSubview:self.pagingView];
    [self.pagingView.listContainerView.collectionView addObserver:self forKeyPath:@"contentOffset" options:NSKeyValueObservingOptionNew context:nil];
  }
  return self;
}

- (void)dealloc
{
  [self.pagingView.listContainerView.collectionView removeObserver:self forKeyPath:@"contentOffset"];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
  if ([keyPath isEqualToString:@"contentOffset"]) {
    CGPoint contentOffset = [change[NSKeyValueChangeNewKey] CGPointValue];
    NSInteger index = contentOffset.x / self.width_sd;
    [self.Navi.swichView changToIndex:index];
    [self.swichView changToIndex:index];
  }
}

-(void)layoutSubviews
{
  [super layoutSubviews];
  self.pagingView.frame = self.bounds;
}


#pragma mark - JXPagingViewDelegate

- (UIView *)tableHeaderViewInPagerView:(JXPagerView *)pagerView {
  return self.headerView;
}

- (NSUInteger)tableHeaderViewHeightInPagerView:(JXPagerView *)pagerView {
  return _headerHeight - kNavBarHeight;
}

- (NSUInteger)heightForPinSectionHeaderInPagerView:(JXPagerView *)pagerView {
  return 0;
}

- (UIView *)viewForPinSectionHeaderInPagerView:(JXPagerView *)pagerView {
  return nil;
}

- (NSInteger)numberOfListsInPagerView:(JXPagerView *)pagerView {
  return self.swichView.data.count;
}


- (id<JXPagerViewListViewDelegate>)pagerView:(JXPagerView *)pagerView initListAtIndex:(NSInteger)index {
  TestListBaseView *list = [[TestListBaseView alloc] init];
  list.onPersonItemPress = self.onPersonItemPress;
  list.onPersonPublish = self.onPersonPublish;
  list.onPersonCollection = self.onPersonCollection;

  NSString *title=  self.swichView.data[index];
  if ([title isEqualToString:@"文章"]) {
    if ([self.userType isEqualToString: USERTYPE_mineWriter]) {
      list.api = ShowApi_mineQuery;
      list.type = 0;
    }else{
      list.api = ShowApi_otherQuery;
       list.params = @{@"userCode": [self.userType stringByReplacingOccurrencesOfString:@"others" withString:@""]};
       list.type = 2;
    }
  }else if ([title isEqualToString:@"收藏"]){
     list.api = ShowApi_mineCollect;
     list.type = 1;
  }
  [list refreshData];
  return list;
}

- (void)mainTableViewDidScroll:(UIScrollView *)scrollView {
  CGFloat Y = scrollView.contentOffset.y;
  CGFloat hei = _headerHeight - kNavBarHeight;
  if(Y >= 0 && Y <= hei){
    CGFloat left = ( KScreenWidth - self.swichView.width_sd)/2.0 -15;
    left = left/((hei)*1.0 );
    left = left * Y;
    self.swichView.frame = CGRectMake(left+15, self.swichView.origin.y, self.swichView.width_sd, self.swichView.height_sd);
    
  }
  _Navi.hidden =  Y < hei;
}

#pragma mark - JXCategoryViewDelegate

- (void)categoryView:(JXCategoryBaseView *)categoryView didSelectedItemAtIndex:(NSInteger)index {
  //    self.navigationController.interactivePopGestureRecognizer.enabled = (index == 0);
}

- (void)setHeaderHeight:(NSInteger)headerHeight
{
  _headerHeight = headerHeight + 50;
  self.headerView.height_sd = _headerHeight;
}


- (void)didUpdateReactSubviews {
  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:[ShowHeaderView class]]) {
      UIView *bgView =[UIView new];
      bgView.frame = CGRectMake(0, 0, KScreenWidth, _headerHeight);
      [bgView addSubview:view];
      view.sd_layout
      .spaceToSuperView(UIEdgeInsetsMake(0, 0, 44, 0));
      UIView *view2 = [UIView new];
      [bgView addSubview:view2];
      view2.sd_layout
      .bottomSpaceToView(bgView, 0)
      .leftSpaceToView(bgView, 0)
      .rightSpaceToView(bgView, 0)
      .heightIs(50);
      [view2 addSubview:self.swichView];
      [self addSubview:self.Navi];
      self.swichView.frame = CGRectMake(15, 0, 2*80-40, 44);
      self.headerView = bgView;
      [self.pagingView reloadData];
    }
  }
}

- (void)setUserType:(NSString *)userType
{
  _userType = userType;
  if ([self.userType isEqualToString:@"mineWriter"]) {
    self.swichView.data = @[@"文章", @"收藏"];
    self.Navi.data = @[@"文章", @"收藏"];
  } else if ([self.userType isEqualToString:@"mineNormal"]){
    self.swichView.data = @[@"收藏"];
    self.Navi.data = @[ @"收藏"];
  } else if ([self.userType containsString:@"others"]){
    self.swichView.data = @[@"文章"];
    self.Navi.data = @[@"文章"];
  }
}

- (SwichView *)swichView
{
  if (!_swichView) {
    _swichView =[SwichView new];
    MJWeakSelf
    _swichView.selectBlock = ^(NSInteger index) {
      [weakSelf.Navi.swichView changToIndex:index];
      [weakSelf.pagingView.listContainerView.collectionView  scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0] atScrollPosition:UICollectionViewScrollPositionNone animated:YES];
    };
  }
  return _swichView;
}

- (SwichViewNavi *)Navi
{
  if (!_Navi) {
    MJWeakSelf
    _Navi = [SwichViewNavi new];
    _Navi.hidden = YES;
    _Navi.backBlock = ^{
      //      if (weakSelf.goBack) {
      //        weakSelf.goBack(@{});
      //      }
    };
    _Navi.selectBlock = ^(NSInteger index) {
      [weakSelf.swichView changToIndex:index];
      [weakSelf.pagingView.listContainerView.collectionView  scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0] atScrollPosition:UICollectionViewScrollPositionNone animated:YES];
    };
  }
  return  _Navi;
}

@end


