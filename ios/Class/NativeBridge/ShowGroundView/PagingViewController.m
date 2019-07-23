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

static const CGFloat JXTableHeaderViewHeight = 200;
static const CGFloat JXheightForHeaderInSection = 50;

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
    return 2;
}


- (id<JXPagerViewListViewDelegate>)pagerView:(JXPagerView *)pagerView initListAtIndex:(NSInteger)index {
    TestListBaseView *list = [[TestListBaseView alloc] init];
    if (index == 0) {
        list.dataSource = @[@"橡胶火箭", @"橡胶火箭炮", @"橡胶机关枪", @"橡胶子弹", @"橡胶攻城炮", @"橡胶象枪", @"橡胶象枪乱打", @"橡胶灰熊铳", @"橡胶雷神象枪", @"橡胶猿王枪", @"橡胶犀·榴弹炮", @"橡胶大蛇炮", @"橡胶火箭", @"橡胶火箭炮", @"橡胶机关枪", @"橡胶子弹", @"橡胶攻城炮", @"橡胶象枪", @"橡胶象枪乱打", @"橡胶灰熊铳", @"橡胶雷神象枪", @"橡胶猿王枪", @"橡胶犀·榴弹炮", @"橡胶大蛇炮"].mutableCopy;
    }else if (index == 1) {
        list.dataSource = @[@"吃烤肉", @"吃鸡腿肉", @"吃牛肉", @"各种肉"].mutableCopy;
    }else if (index == 2) {
        list.dataSource = @[@"【剑士】罗罗诺亚·索隆", @"【航海士】娜美", @"【狙击手】乌索普", @"【厨师】香吉士", @"【船医】托尼托尼·乔巴", @"【船匠】 弗兰奇", @"【音乐家】布鲁克", @"【考古学家】妮可·罗宾", @"【船匠】 弗兰奇", @"【音乐家】布鲁克", @"【考古学家】妮可·罗宾", @"【船匠】 弗兰奇", @"【音乐家】布鲁克", @"【考古学家】妮可·罗宾", @"【船匠】 弗兰奇", @"【音乐家】布鲁克", @"【考古学家】妮可·罗宾"].mutableCopy;
    }
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
      self.swichView.data = @[@"文章", @"收藏"];
      self.Navi.data = @[@"文章", @"收藏"];
      [self addSubview:self.Navi];
      self.swichView.frame = CGRectMake(15, 0, 2*80-40, 44);
      self.headerView = bgView;
      [self.pagingView reloadData];
    }
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


