//
//  ASDK_ShowGround.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ASDK_ShowGround.h"
#import <AsyncDisplayKit/AsyncDisplayKit.h>
#import "ShowQueryModel.h"
#import "MosaicCollectionLayoutDelegate.h"
#import <MJRefresh/MJRefresh.h>
#import "NetWorkTool.h"
#import "MBProgressHUD+PD.h"
#import "ShowCell.h"
#import "ShowCellNode.h"

#define kReuseIdentifier @"ShowCell"
@interface ASDK_ShowGround()<ASCollectionDataSourceInterop, ASCollectionDelegate, ASCollectionViewLayoutInspecting>
@property (nonatomic, strong) ASCollectionNode * collectionNode;
@property (nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;
@end
@implementation ASDK_ShowGround

- (instancetype)init
{
  if (self = [super init]){
    [self initData];
    [self setUI];
    [self setupRefresh];
  
  }
  
  return self;
}

/**
 初始化
 */
- (void)initData
{
  _dataArr = [NSMutableArray new];
}

/**
 布局子试图
 */
- (void)setUI
{
  MosaicCollectionLayoutDelegate *layoutDelegate = [[MosaicCollectionLayoutDelegate alloc] initWithNumberOfColumns:2 headerHeight:44.0];
  _collectionNode = [[ASCollectionNode alloc] initWithLayoutDelegate:layoutDelegate layoutFacilitator:nil];
  _collectionNode.dataSource = self;
  _collectionNode.delegate = self;
  _collectionNode.layoutInspector = self;
  [_collectionNode registerSupplementaryNodeOfKind:UICollectionElementKindSectionHeader];
  [_collectionNode.view registerClass:[ShowCell class] forCellWithReuseIdentifier:kReuseIdentifier];
  [self addSubnode:_collectionNode];
  
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _collectionNode.view.frame = self.bounds;
}

/**
 * 刷新控件
 */
- (void)setupRefresh{
  
  MJRefreshNormalHeader *header = [MJRefreshNormalHeader headerWithRefreshingTarget:self refreshingAction:@selector(refreshData)];
  [header setTitle:@"下拉刷新" forState:MJRefreshStateIdle];
  [header setTitle:@"松开刷新" forState:MJRefreshStatePulling];
  [header setTitle:@"正在刷新 ..." forState:MJRefreshStateRefreshing];
  header.lastUpdatedTimeLabel.hidden = YES;
  header.stateLabel.font = [UIFont systemFontOfSize:11];
  header.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  self.collectionNode.view.mj_header = header;
  [self.collectionNode.view.mj_header beginRefreshing];
  
  MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
  footer.triggerAutomaticallyRefreshPercent = -5;
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  
  self.collectionNode.view.mj_footer = footer;
  self.collectionNode.view.mj_footer.hidden = YES;
}

/**
 刷新数据
 */
- (void)refreshData
{
  if (self.onStartRefresh) {
    self.onStartRefresh(@{});
  }
  self.page = 1;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"}];
  __weak ASDK_ShowGround * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic  toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    weakSelf.dataArr = [result.data mutableCopy];
    [weakSelf.collectionNode.view.mj_header endRefreshing];
    if(result.data.count < 10){
      [weakSelf.collectionNode.view.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionNode.view.mj_footer resetNoMoreData];
    }
    [weakSelf.collectionNode reloadData];
    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
    weakSelf.collectionNode.view.mj_footer.hidden = NO;
  } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
    [weakSelf.collectionNode.view.mj_header endRefreshing];
  } showLoading:nil];
}

/**
 加载更多数据
 */
- (void)getMoreData
{
  self.page++;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"}];
  __weak ASDK_ShowGround * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    [weakSelf.dataArr addObjectsFromArray:result.data];
    [weakSelf.collectionNode reloadData];
    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
    if(result.data.count < 10){
      [weakSelf.collectionNode.view.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionNode.view.mj_footer endRefreshing];
    }
  } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
    [weakSelf.collectionNode.view.mj_footer endRefreshing];
  } showLoading:nil];
}


- (NSInteger)numberOfSectionsInCollectionNode:(ASCollectionNode *)collectionNode
{
  return 1;
}

- (NSInteger)collectionNode:(ASCollectionNode *)collectionNode numberOfItemsInSection:(NSInteger)section
{
  return self.dataArr.count;
}

- (void)collectionNode:(ASCollectionNode *)collectionNode didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
  if (_onItemPress) {
    _onItemPress([self.dataArr[indexPath.item] modelToJSONObject]);
    self.dataArr[indexPath.item].click = self.dataArr[indexPath.item].click + 5;
    [_collectionNode reloadData];
  }
}

#pragma mark - ASCollectionNode data source.

- (ASCellNodeBlock)collectionNode:(ASCollectionNode *)collectionNode nodeBlockForItemAtIndexPath:(NSIndexPath *)indexPath
{
  //  if (kShowUICollectionViewCells && indexPath.item % 3 == 1) {
  //    // When enabled, return nil for every third cell and then cellForItemAtIndexPath: will be called.
  //    return nil;
  //  }

  ShowQuery_dataModel *model = self.dataArr[indexPath.item];
  return ^{
    return [[ShowCellNode alloc]initWithModel:model];
  };
}


/**
 * Asks the inspector for the number of supplementary views for the given kind in the specified section.
 */
- (NSUInteger)collectionView:(ASCollectionView *)collectionView supplementaryNodesOfKind:(NSString *)kind inSection:(NSUInteger)section
{
  return [kind isEqualToString:UICollectionElementKindSectionHeader] ? 1 : 0;
}

- (ASCellNode *)collectionNode:(ASCollectionNode *)collectionNode nodeForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
{
  NSDictionary *textAttributes = @{
                                   NSFontAttributeName: [UIFont preferredFontForTextStyle:UIFontTextStyleHeadline],
                                   NSForegroundColorAttributeName: [UIColor grayColor]
                                   };
  UIEdgeInsets textInsets = UIEdgeInsetsMake(11.0, 0, 11.0, 0);
  ASTextCellNode *textCellNode = [[ASTextCellNode alloc] initWithAttributes:textAttributes insets:textInsets];
  textCellNode.text = [NSString stringWithFormat:@"Section %zd", indexPath.section + 1];
  return textCellNode;
}


- (ASSizeRange)collectionView:(ASCollectionView *)collectionView constrainedSizeForNodeAtIndexPath:(NSIndexPath *)indexPath
{
  return ASSizeRangeZero;
}

- (ASScrollDirection)scrollableDirections
{
  return ASScrollDirectionVerticalDirections;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
  return [_collectionNode.view dequeueReusableCellWithReuseIdentifier:kReuseIdentifier forIndexPath:indexPath];
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
{
  return nil;
}


- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
  if (self.onStartScroll) {
    self.onStartScroll(@{});
  }
}


- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
  if (self.onEndScroll) {
    self.onEndScroll(@{});
  }
}
- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
  if (decelerate==NO) {
    if (self.onEndScroll) {
      self.onEndScroll(@{});
    }
  }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  CGFloat Y = scrollView.contentOffset.y;
  if (Y> self.height &&
      scrollView.bounces == YES &&
      scrollView.mj_footer.state != MJRefreshStateNoMoreData) {
    scrollView.bounces = NO;
  }else if((Y<self.height || scrollView.mj_footer.state == MJRefreshStateNoMoreData) &&
           scrollView.bounces == NO){
    scrollView.bounces = YES;
  }
  
}
@end
