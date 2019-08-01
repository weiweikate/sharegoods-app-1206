//
//  TestListBaseView.m
//  JXCategoryView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import "TestListBaseView.h"
#import "WHCWaterfallFlowLayout.h"
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import "ShowQueryModel.h"
#import "MineArticleCell.h"
#import "NSString+UrlAddParams.h"
#import "MBProgressHUD+PD.h"
#import "MineCollectCell.h"
#import "OtherArticleCell.h"
@interface TestListBaseView()<UICollectionViewDataSource, WHCWaterfallFlowLayoutDelegate, UICollectionViewDelegate, UIScrollViewDelegate>
@property (nonatomic, copy) void(^scrollCallback)(UIScrollView *scrollView);
@property (nonatomic, assign)NSInteger page;
@property(nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@end

@implementation TestListBaseView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
//        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, frame.size.height) style:UITableViewStylePlain];
        WHCWaterfallFlowLayout *whcLayout = [[WHCWaterfallFlowLayout alloc] init];
        whcLayout.itemSpacing = 10;
        whcLayout.lineSpacing = 10;
        whcLayout.sectionInset = UIEdgeInsetsMake(10, 10, 10, 10);
        whcLayout.colCount = 2;
        whcLayout.delegate = self;
        UICollectionView * collectionView = [[UICollectionView alloc]initWithFrame:self.bounds collectionViewLayout:whcLayout];
        collectionView.showsVerticalScrollIndicator = NO;
        collectionView.showsHorizontalScrollIndicator = NO;
        collectionView.dataSource = self;
        collectionView.delegate = self;
        collectionView.backgroundColor = [UIColor colorWithHexString:@"F5F5F5"];
        [collectionView registerClass:[MineArticleCell class] forCellWithReuseIdentifier:@"MineArticleCell"];
      [collectionView registerClass:[MineCollectCell class] forCellWithReuseIdentifier:@"MineCollectCell"];
      [collectionView registerClass:[OtherArticleCell class] forCellWithReuseIdentifier:@"OtherArticleCell"];
        self.collectionView = collectionView;
        [self addSubview:collectionView];
      
      MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
      footer.triggerAutomaticallyRefreshPercent = -10;
      [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
      [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
      [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
      footer.stateLabel.font = [UIFont systemFontOfSize:11];
      footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
      self.collectionView.mj_footer = footer;
      
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.collectionView.frame = self.bounds;
}

/**
 刷新数据
 */
- (void)refreshData
{
  self.page = 1;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"20"}];
  __weak TestListBaseView * weakSelf = self;
  [NetWorkTool requestWithURL:_api params:dic  toModel:[ShowQueryModel class] success:^(ShowQueryModel* model) {
    weakSelf.dataArr = [model.data mutableCopy];
    [weakSelf.collectionView.mj_header endRefreshing];
    if(model.data.count < 20){
      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionView.mj_footer resetNoMoreData];
    }
    [weakSelf.collectionView reloadData];
  } failure:^(NSString *msg, NSInteger code) {
  
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
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"20"}];
  __weak TestListBaseView * weakSelf = self;
  [NetWorkTool requestWithURL:_api params:dic toModel:[ShowQueryModel class] success:^(ShowQueryModel* model) {
    
    [weakSelf.dataArr addObjectsFromArray:model.data];
  
    NSMutableArray *indexPaths = [NSMutableArray new];
    for (int i = 0; i<model.data.count; i++) {
      NSIndexPath *indexPath = [NSIndexPath indexPathForRow:weakSelf.dataArr.count - 1 - i inSection:0];
      [indexPaths addObject:indexPath];
    }
    [weakSelf.collectionView insertItemsAtIndexPaths:indexPaths];
    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
    if(model.data.count < 20){
      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionView.mj_footer endRefreshing];
    }

  } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
    [weakSelf.collectionView.mj_footer endRefreshing];
  } showLoading:nil];
}



- (void)setApi:(NSString *)api
{
  _api = api;
}

#pragma mark - UITableViewDataSource, UITableViewDelegate

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    //  self.collectionView.mj_footer.hidden = self.shops.count == 0;
    
    return self.dataArr.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    __weak TestListBaseView *weakSelf = self;
  if (self.type == 0) {
    MineArticleCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"MineArticleCell" forIndexPath:indexPath];
    cell.model = self.dataArr[indexPath.row];
    cell.deleteBlock = ^(ShowQuery_dataModel * _Nonnull model) {
      NSInteger index = [weakSelf.dataArr indexOfObject:model];
      [weakSelf.dataArr removeObjectAtIndex:index];
      [weakSelf.collectionView reloadData];
    };
    return cell;
  } else if (self.type == 1){
    MineCollectCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"MineCollectCell" forIndexPath:indexPath];
    cell.model = self.dataArr[indexPath.row];
    return cell;
  }
  
  OtherArticleCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"OtherArticleCell" forIndexPath:indexPath];
  cell.model = self.dataArr[indexPath.row];
  return cell;
  
  return nil;

}


- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(WHCWaterfallFlowLayout*)collectionViewLayout heightForWidth:(CGFloat)width atIndexPath:(NSIndexPath*)indexPath
{
  ShowQuery_dataModel *model = self.dataArr[indexPath.row];
  CGFloat titleHeight = [model.pureContent_1 getHeightWithFontSize:13 viewWidth:width - 20 maxLineCount:2];
  return width /model.aspectRatio_show + 45 + titleHeight;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
  if (self.onItemPress) {
    self.onItemPress([self.dataArr[indexPath.row] modelToJSONObject]);
  }
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    self.scrollCallback(scrollView);
}


#pragma mark - JXPagingViewListViewDelegate

- (UIScrollView *)listScrollView {
    return self.collectionView;
}

- (void)listViewDidScrollCallback:(void (^)(UIScrollView *))callback {
    self.scrollCallback = callback;
}

- (UIView *)listView {
    return self;
}

@end
