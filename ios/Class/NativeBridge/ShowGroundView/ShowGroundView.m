//
//  ShowGroundView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowGroundView.h"
#import "LMHWaterFallLayout.h"
#import "ShowQueryModel.h"
#import "ShowCell.h"
#import "NetWorkTool.h"
@interface ShowGroundView()<UICollectionViewDataSource, LMHWaterFallLayoutDeleaget>
@property (nonatomic, weak) UICollectionView * collectionView;
@property (nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@end
@implementation ShowGroundView
- (instancetype)init
{
  self = [super init];
  if (self) {
    [self initData];
    [self setUI];
    [self refreshData];
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
  LMHWaterFallLayout * waterFallLayout = [[LMHWaterFallLayout alloc]init];
  waterFallLayout.delegate = self;
  
  // 创建collectionView
  UICollectionView * collectionView = [[UICollectionView alloc]initWithFrame:self.bounds collectionViewLayout:waterFallLayout];
  collectionView.backgroundColor = [UIColor whiteColor];
  
  collectionView.dataSource = self;
  [self addSubview:collectionView];
  
  // 注册
  [collectionView registerClass:[ShowCell class] forCellWithReuseIdentifier:@"ShowCell"];
  
  self.collectionView = collectionView;
}


/**
 刷新数据
 */
- (void)refreshData
{
  [NetWorkTool requestWithURL:ShowApi_query params:@{@"page": @"1", @"size": @"20"} toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
    
  } failure:^(NSString *msg, NSInteger code) {
    
  } showLoading:nil];
}

/**
 加载更多数据
 */
- (void)getMoreData
{
  
}


#pragma mark  - <LMHWaterFallLayoutDeleaget>
- (CGFloat)waterFallLayout:(LMHWaterFallLayout *)waterFallLayout heightForItemAtIndexPath:(NSUInteger)indexPath itemWidth:(CGFloat)itemWidth{
  
  ShowQuery_dataModel * model = self.dataArr[indexPath];

  return itemWidth / model.aspectRatio;
}

- (CGFloat)rowMarginInWaterFallLayout:(LMHWaterFallLayout *)waterFallLayout{
  
  return 20;
  
}

- (NSUInteger)columnCountInWaterFallLayout:(LMHWaterFallLayout *)waterFallLayout{
  
  return 2;
  
}

@end
