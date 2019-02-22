//
//  ShowGroundView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowGroundView.h"
#import "WHCWaterfallFlowLayout.h"
#import "ShowQueryModel.h"
#import "ShowCell.h"
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import "ShowHeaderView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "ShowCollectionReusableView.h"
@interface ShowGroundView()<UICollectionViewDataSource, WHCWaterfallFlowLayoutDelegate, UICollectionViewDelegate, UIScrollViewDelegate>
@property (nonatomic, weak) UICollectionView * collectionView;
@property (nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;
@end
@implementation ShowGroundView
- (instancetype)init
{
  self = [super init];
  if (self) {
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
  // 创建布局
//  LMHWaterFallLayout * waterFallLayout = [[LMHWaterFallLayout alloc]init];
  WHCWaterfallFlowLayout *whcLayout = [[WHCWaterfallFlowLayout alloc] init];
  whcLayout.itemSpacing = 10;
  whcLayout.lineSpacing = 10;
  whcLayout.sectionInset = UIEdgeInsetsMake(10, 10, 10, 10);
  whcLayout.colCount = 2;
  whcLayout.delegate = self;
  
  // 创建collectionView
  UICollectionView * collectionView = [[UICollectionView alloc]initWithFrame:self.bounds collectionViewLayout:whcLayout];
 collectionView.backgroundColor = [UIColor colorWithHexString:@"f5f5f5"];
  [collectionView registerClass:[ShowCollectionReusableView class] forSupplementaryViewOfKind: UICollectionElementKindSectionHeader withReuseIdentifier:@"ShowCollectionReusableView"];
  
  collectionView.dataSource = self;
  collectionView.delegate = self;
  [self addSubview:collectionView];
  
  // 注册
  [collectionView registerClass:[ShowCell class] forCellWithReuseIdentifier:@"ShowCell"];
  
  self.collectionView = collectionView;
  
}

- (void)layoutSubviews
{
  [super layoutSubviews];
   _collectionView.frame = self.bounds;
  self.collectionView.mj_footer.ignoredScrollViewContentInsetBottom = self.height / 2.0;
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
  self.collectionView.mj_header = header;
  [self.collectionView.mj_header beginRefreshing];
  
  MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  
  self.collectionView.mj_footer = footer;
  self.collectionView.mj_footer.hidden = YES;
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
  __weak ShowGroundView * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic  toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    weakSelf.dataArr = [result.data mutableCopy];
    [weakSelf.collectionView reloadData];
    [weakSelf.collectionView.mj_header endRefreshing];
    if(result.data.count < 10){
      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
    }else{
        [weakSelf.collectionView.mj_footer resetNoMoreData];
    }
    weakSelf.collectionView.mj_footer.hidden = NO;
  } failure:^(NSString *msg, NSInteger code) {
    [weakSelf.collectionView.mj_header endRefreshing];
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
  __weak ShowGroundView * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    [weakSelf.dataArr addObjectsFromArray:result.data];
    [weakSelf.collectionView reloadData];
    if(result.data.count < 10){
      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
    }else{
       [weakSelf.collectionView.mj_footer endRefreshing];
    }
  } failure:^(NSString *msg, NSInteger code) {
    [weakSelf.collectionView.mj_footer endRefreshing];
  } showLoading:nil];
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
  return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
  
//  self.collectionView.mj_footer.hidden = self.shops.count == 0;
  
  return self.dataArr.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
  
  ShowCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"ShowCell" forIndexPath:indexPath];
  cell.layer.cornerRadius = 4;
  cell.clipsToBounds = YES;
  cell.backgroundColor = [UIColor whiteColor];
  cell.model = self.dataArr[indexPath.item];
  
  return cell;
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(nonnull NSString *)kind atIndexPath:(nonnull NSIndexPath *)indexPath
{
//  if ([kind isEqualToString:UICollectionElementKindSectionHeader]) {
    ShowCollectionReusableView * view = [collectionView dequeueReusableSupplementaryViewOfKind: UICollectionElementKindSectionHeader withReuseIdentifier:@"ShowCollectionReusableView" forIndexPath:indexPath];
//    view.backgroundColor = [UIColor redColor];

      [view removeAllSubviews];
     [view addSubview:self.headerView];
  
    return view;
//  }else{
//    UICollectionReusableView * view = [UICollectionReusableView new];
//    view.backgroundColor = [UIColor redColor];
//    return view;
//  }
}


- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
  if (_onItemPress) {
     _onItemPress([self.dataArr[indexPath.item] modelToJSONObject]);
    self.dataArr[indexPath.item].click++ ;
    [collectionView reloadData];
  }
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(WHCWaterfallFlowLayout*)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section
{
   return CGSizeMake(self.width, self.headerView.height);
}

 - (CGFloat)collectionView:(UICollectionView *)collectionView layout:(WHCWaterfallFlowLayout*)collectionViewLayout heightForWidth:(CGFloat)width atIndexPath:(NSIndexPath*)indexPath
{
  ShowQuery_dataModel * model = self.dataArr[indexPath.item];
  
  return width / model.aspectRatio + 90;
}

- (void)didUpdateReactSubviews {
  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:[ShowHeaderView class]]) {
        self.headerView = view;
        [self.collectionView reloadData];
    }
  }
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
@end
