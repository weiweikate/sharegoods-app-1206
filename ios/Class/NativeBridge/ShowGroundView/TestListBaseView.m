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
#import "UIScrollView+EmptyDataSet.h"


@interface TestListBaseView()<UICollectionViewDataSource, WHCWaterfallFlowLayoutDelegate, UICollectionViewDelegate, UIScrollViewDelegate,DZNEmptyDataSetSource,DZNEmptyDataSetDelegate>
@property (nonatomic, copy) void(^scrollCallback)(UIScrollView *scrollView);
@property (nonatomic, assign)NSInteger page;
@property(nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@property(nonatomic, assign)BOOL isError;

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
        collectionView.emptyDataSetSource = self;
        collectionView.emptyDataSetDelegate = self;
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
      [footer setTitle:@"我也是有底线的~" forState:MJRefreshStateNoMoreData];
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
  self.isError = NO;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"size": @"20"}];
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
    [MBProgressHUD showSuccess:msg];
    self.isError = YES;
    [self.collectionView reloadData];
  } showLoading:nil];
 
}


/**
 加载更多数据
 */
- (void)getMoreData
{
  NSMutableDictionary *dic = [NSMutableDictionary new];
  NSString *cursor = [self.dataArr.lastObject valueForKey:@"cursor"];
  
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  if(cursor){
    [dic addEntriesFromDictionary:@{@"cursor":cursor}];
  }
  
  [dic addEntriesFromDictionary:@{@"size": @"20"}];
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

-(void)setType:(NSInteger)type{
  _type = type;
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
  if (self.onPersonItemPress) {
    self.onPersonItemPress([self.dataArr[indexPath.row] modelToJSONObject]);
  }
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    self.scrollCallback(scrollView);
}


#pragma arguments - DZNEmptyDataSetDelegate

- (UIImage *)imageForEmptyDataSet:(UIScrollView *)scrollView {
  return [UIImage imageNamed:@"empty"];
}

// 空白页显示返回按钮图片
- (NSAttributedString *)buttonTitleForEmptyDataSet:(UIScrollView *)scrollView forState:(UIControlState)state {
  NSString *text = @"点击刷新";
  if(!self.isError){
    if(self.type == 0){
      text = @"去发布";
    }else if(self.type == 1){
      text = @"点击去收藏";
    }else{
      return nil;
    }
  }
  UIFont   *font = [UIFont systemFontOfSize:15.0];
  // 设置默认状态、点击高亮状态下的按钮字体颜色
  UIColor  *textColor = [UIColor whiteColor];
  
  NSMutableDictionary *attributes = [NSMutableDictionary new];
  [attributes setObject:font      forKey:NSFontAttributeName];
  [attributes setObject:textColor forKey:NSForegroundColorAttributeName];
  
  return [[NSAttributedString alloc] initWithString:text attributes:attributes];
}

- (NSAttributedString *)titleForEmptyDataSet:(UIScrollView *)scrollView {
  NSString *title = @"暂无数据";
  if(!self.isError){
    if(self.type == 0){
      title = @"暂无内容，马上去发布文章";
    }else if(self.type == 1){
      title = @"暂无内容，马上去收藏好文";
    }
  }
  NSDictionary *attributes = @{
                               NSFontAttributeName:[UIFont
                                                    systemFontOfSize:13.0],
                               NSForegroundColorAttributeName:[UIColor colorWithHexString:@"666666"]
                               };
  return [[NSAttributedString alloc] initWithString:title attributes:attributes];
}


- (nullable UIImage *)buttonBackgroundImageForEmptyDataSet:(UIScrollView *)scrollView forState:(UIControlState)state{
  CGRect frame = CGRectMake(0, 0, 100, 34);
  //底部上下渐变效果背景
  //通过图片上下文设置颜色空间间
  UIGraphicsBeginImageContext(frame.size);
  //获得当前的上下文
  CGContextRef context = UIGraphicsGetCurrentContext();
  //创建颜色空间 /* Create a DeviceRGB color space. */
  CGColorSpaceRef rgb = CGColorSpaceCreateDeviceRGB();
  //通过矩阵调整空间变换
  CGContextScaleCTM(context, frame.size.width, frame.size.height);
  //通过颜色组件获得渐变上下文
  CGGradientRef backGradient;
  CGFloat colors[] = {
    252/255.0, 93/255.0, 57/255.0, 1.0,
    255/255.0, 0/255.0, 80/255.0, 1.0,
  };
  backGradient = CGGradientCreateWithColorComponents(rgb, colors, NULL, sizeof(colors)/(sizeof(colors[0])*4));
  //释放颜色渐变
  CGColorSpaceRelease(rgb);
  //通过上下文绘画线色渐变
  //设置渐变颜色方向，左上点为(0,0), 右下点为(1,1)
  CGContextDrawLinearGradient(context, backGradient, CGPointMake(0, 0.5), CGPointMake(1, 0.5), kCGGradientDrawsBeforeStartLocation);
  //通过图片上下文获得照片
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  
  return image;
}

- (void)emptyDataSet:(UIScrollView *)scrollView didTapButton:(UIButton *)button {
  if(!self.isError){
    if(self.type == 0){
      if (self.onPersonPublish) {
        self.onPersonPublish(@{});
      }
    }else if(self.type == 1){
      if (self.onPersonCollection) {
        self.onPersonCollection(@{});
      }
    }
  }else{
    [self refreshData];
  }
}

- (void)emptyDataSetWillAppear:(UIScrollView *)scrollView{
  self.collectionView.mj_footer.hidden = YES;
}

-(void)emptyDataSetDidAppear:(UIScrollView *)scrollView{
  UIButton *button = [scrollView valueForKeyPath:@"emptyDataSetView.button"];
  button.layer.cornerRadius = 17;
  button.clipsToBounds = YES;
  if (button) {
    // Change button width
    for (NSLayoutConstraint *constraint in button.superview.constraints) {
      if (constraint.firstItem == button && constraint.firstAttribute == NSLayoutAttributeLeading) {
        constraint.constant = 100.0;
      } else if (constraint.secondItem == button && constraint.secondAttribute == NSLayoutAttributeTrailing) {
        constraint.constant = 100.0;
      }
    }
    // Change button height
    for (NSLayoutConstraint *constraint in button.constraints) {
      if (constraint.firstItem == button && constraint.firstAttribute == NSLayoutAttributeHeight) {
        constraint.constant = 34.0;
      }
    }
  }
}

- (void)emptyDataSetWillDisappear:(UIScrollView *)scrollView{
  self.collectionView.mj_footer.hidden = NO;
}

- (CGFloat)verticalOffsetForEmptyDataSet:(UIScrollView *)scrollView{
  
  return -130;
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
