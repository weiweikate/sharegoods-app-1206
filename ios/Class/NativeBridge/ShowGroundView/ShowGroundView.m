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
@interface ShowGroundView()<UICollectionViewDataSource, WHCWaterfallFlowLayoutDelegate, UICollectionViewDelegate>
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
}

/**
 * 刷新控件
 */
- (void)setupRefresh{
  
  self.collectionView.mj_header = [MJRefreshNormalHeader headerWithRefreshingTarget:self refreshingAction:@selector(refreshData)];
  [self.collectionView.mj_header beginRefreshing];
  
  
  self.collectionView.mj_footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
}
/**
 刷新数据
 */
- (void)refreshData
{
  self.page = 1;
  __weak ShowGroundView * weakSelf = self;
  [NetWorkTool requestWithURL:ShowApi_query params:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"20"} toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    weakSelf.dataArr = [result.data mutableCopy];
    [weakSelf.collectionView reloadData];
    [weakSelf.collectionView.mj_header endRefreshing];
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
  __weak ShowGroundView * weakSelf = self;
  [NetWorkTool requestWithURL:ShowApi_query params:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"} toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    [weakSelf.dataArr addObjectsFromArray:result.data];
    [weakSelf.collectionView reloadData];
    [weakSelf.collectionView.mj_footer endRefreshing];
    if (result.currentPage == result.totalPage) {
      
    }else{
      
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
//  if (view.headerView != self.headerView) {
//    [view.headerView removeFromSuperview];
      [view addSubview:self.headerView];
//  }
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
    self.dataArr[indexPath.item].readNumber++ ;
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
@end
