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
#import "ShowCollectionReusableView.h"
#import "ShowHeaderView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "ASCollectionNode+ReloadIndexPaths.h"
#import <SDAutoLayout.h>
#import <YYKit.h>
#import "MyShowCellNode.h"
#import "NSObject+Util.h"
#import "NSString+UrlAddParams.h"
#import "NSDictionary+Util.h"

#define kReuseIdentifier @"ShowCell"
#define SystemUpgradeCode 9999
@interface ASDK_ShowGround()<ASCollectionDataSourceInterop, ASCollectionDelegate, ASCollectionViewLayoutInspecting>
@property (nonatomic, strong) ASCollectionNode * collectionNode;
@property (nonatomic, strong)NSMutableArray<ShowQuery_dataModel *> *dataArr;
@property (nonatomic, strong)NSMutableArray *callBackArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;
@property (nonatomic, assign)NSInteger errCode;
@property (nonatomic, strong)UILabel *emptyLb;
@property (nonatomic, strong)UIView *emptyView;
@property (nonatomic, strong)MosaicCollectionLayoutDelegate *layoutDelegate;
@property (nonatomic, assign)BOOL isFinish;
@end
@implementation ASDK_ShowGround

- (instancetype)init
{
  if (self = [super init]){
    [self initData];
    [self setUI];
    [self setupRefresh];
    [self setupEmptyView];
  }
  return self;
}

/**
 初始化
 */
- (void)initData
{
  _dataArr = [NSMutableArray new];
  _callBackArr = [NSMutableArray new];
}

/**
 布局子试图
 */
- (void)setUI
{
  MosaicCollectionLayoutDelegate *layoutDelegate = [[MosaicCollectionLayoutDelegate alloc] initWithNumberOfColumns:2 headerHeight:0];
  _collectionNode = [[ASCollectionNode alloc] initWithLayoutDelegate:layoutDelegate layoutFacilitator:nil];
  _collectionNode.dataSource = self;
  _collectionNode.delegate = self;
  _collectionNode.layoutInspector = self;
  _collectionNode.backgroundColor = [UIColor colorWithHexString:@"f5f5f5"];
  _collectionNode.showsVerticalScrollIndicator = NO;
  _collectionNode.showsHorizontalScrollIndicator = NO;
  _layoutDelegate = layoutDelegate;
  [_collectionNode registerSupplementaryNodeOfKind:UICollectionElementKindSectionHeader];
  [_collectionNode.view registerClass:[ShowCell class] forCellWithReuseIdentifier:kReuseIdentifier];
  [_collectionNode.view registerClass:[ShowCollectionReusableView class] forSupplementaryViewOfKind: UICollectionElementKindSectionHeader withReuseIdentifier:@"ShowCollectionReusableView"];
  [_collectionNode.view registerClass:[UICollectionReusableView  class] forSupplementaryViewOfKind: UICollectionElementKindSectionFooter withReuseIdentifier:@"UICollectionReusableView_footer"];
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
  footer.triggerAutomaticallyRefreshPercent = -10;
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];

  self.collectionNode.view.mj_footer = footer;
  self.collectionNode.view.mj_footer.hidden = YES;
}

/**
 * 设置空白代理
 */
- (void)setupEmptyView{
  _emptyView = [UIView new];
  [self addSubview:_emptyView];
  _emptyView.sd_layout.spaceToSuperView(UIEdgeInsetsZero);
  _emptyView.backgroundColor = [UIColor colorWithHexString:@"f5f5f5"];

  UIImageView *imgView = [UIImageView new];
  imgView.image = [UIImage imageNamed:@"empty"];
  [_emptyView addSubview:imgView];

  imgView.sd_layout
  .centerXEqualToView(_emptyView)
  .centerYEqualToView(_emptyView)
  .widthIs(267)
  .heightIs(192);

  _emptyLb = [UILabel new];
  _emptyLb.font = [UIFont systemFontOfSize:13];
  _emptyLb.textColor = [UIColor colorWithHexString:@"666666"];
  [_emptyView addSubview:_emptyLb];
  _emptyLb.textAlignment = 1;

  _emptyLb.sd_layout
  .topSpaceToView(imgView, 10)
  .heightIs(20)
  .leftSpaceToView(_emptyLb, 0)
  .rightSpaceToView(_emptyView, 0);
  //点击刷新
  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(refreshData)];
  [_emptyView addGestureRecognizer:tap];
   _emptyView.hidden = YES;
}

- (void)setErrCode:(NSInteger)errCode
{
  _errCode = errCode;
  if (self.dataArr.count > 0) {
    _emptyView.hidden = YES;

  }else{
    _emptyView.hidden = NO;
    if (errCode == SystemUpgradeCode) {
      _emptyLb.text = @"系统维护升级中 ";
    }else{
      _emptyLb.text = @"暂无数据 ";
    }
  }
}

/**
 刷新数据
 */
- (void)refreshData
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  if (self.onStartRefresh) {
    self.onStartRefresh(@{});
  }
  self.page = 1;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"20"}];
  __weak ASDK_ShowGround * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic  toModel:nil success:^(NSDictionary* result) {
    if(self.type){
      [defaults setObject:[NSString convertNSDictionaryToJsonString:result] forKey:self.type];
    }
    ShowQueryModel* model = [ShowQueryModel modelWithJSON:result];
    weakSelf.dataArr = [model.data mutableCopy];
    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      weakSelf.callBackArr = [[result valueForKey:@"data"] mutableCopy];
    }

    [weakSelf.collectionNode.view.mj_header endRefreshing];
    if(model.data.count < 20){
      [weakSelf.collectionNode.view.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionNode.view.mj_footer resetNoMoreData];
    }
    [weakSelf.collectionNode reloadData];
    if (weakSelf.collectionNode.view.mj_footer.hidden) {
      //延迟0.5秒，防止第一次在刷新成功过程中在顶部出现footer《加载更多》
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        weakSelf.collectionNode.view.mj_footer.hidden = NO;
      });
    }
    weakSelf.errCode = 10000;
  } failure:^(NSString *msg, NSInteger code) {
    weakSelf.errCode = code;
    [MBProgressHUD showSuccess:msg];
    [weakSelf.collectionNode.view.mj_header endRefreshing];
  } showLoading:nil];
  self.isFinish = YES;
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
  __weak ASDK_ShowGround * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic toModel:nil success:^(NSDictionary* result) {

    ShowQueryModel* model = [ShowQueryModel modelWithJSON:result];
    [weakSelf.dataArr addObjectsFromArray:model.data];

    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
    }

    NSMutableArray *indexPaths = [NSMutableArray new];
    for (int i = 0; i<model.data.count; i++) {
      NSIndexPath *indexPath = [NSIndexPath indexPathForRow:weakSelf.dataArr.count - 1 - i inSection:0];
      [indexPaths addObject:indexPath];
    }
    [weakSelf.collectionNode insertItemsAtIndexPaths:indexPaths];
    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
    if(model.data.count < 20){
      [weakSelf.collectionNode.view.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.collectionNode.view.mj_footer endRefreshing];
    }
     weakSelf.errCode = 10000;
  } failure:^(NSString *msg, NSInteger code) {
    weakSelf.errCode = code;
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
    self.dataArr[indexPath.row].xg_index = indexPath.row;
    NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[indexPath.row]];
    [dic setObject:[NSNumber numberWithInteger:indexPath.row] forKey:@"index"];
    [self.callBackArr replaceObjectAtIndex:indexPath.row withObject:dic];
    _onItemPress(self.callBackArr[indexPath.row]);
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//       [_collectionNode reloadItemsAtIndexPaths:@[indexPath]];
//    });
  }
}

#pragma mark - ASCollectionNode data source.

- (ASCellNodeBlock)collectionNode:(ASCollectionNode *)collectionNode nodeBlockForItemAtIndexPath:(NSIndexPath *)indexPath
{
  ASCellNodeBlock block = [self js_collectionNode:collectionNode nodeBlockForItemAtIndexPath:indexPath];
  return ^{
    ASCellNode *node = block();
    if ([collectionNode.js_reloadIndexPaths containsObject:indexPath]) {
      node.neverShowPlaceholders = YES;
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW,
                                   (int64_t)(0.5 * NSEC_PER_SEC)),
                     dispatch_get_main_queue(),
                     ^{
                       node.neverShowPlaceholders = NO;

                     });
    }else {
      node.neverShowPlaceholders = NO;
    }
    return node;
  };
}

- (ASCellNodeBlock)js_collectionNode:(ASCollectionNode *)collectionNode nodeBlockForItemAtIndexPath:(NSIndexPath *)indexPath
{
  ShowQuery_dataModel *model = self.dataArr[indexPath.item];
  if([self.type isEqualToString:@"MyDynamic"]){
    return ^{
      MyShowCellNode *node = [[MyShowCellNode alloc]initWithModel:model index:indexPath.row ];
      node.deletBtnTapBlock = ^(ShowQuery_dataModel *m, NSInteger index) {

        UIAlertController *alterController = [UIAlertController alertControllerWithTitle:@"温馨提示"
                                                                                 message:@"确定删除这条动态吗？"
                                                                          preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"再想想"
                                                               style:UIAlertActionStyleDefault
                                                             handler:^(UIAlertAction * _Nonnull action) {

                                                             }];
        UIAlertAction *actionSubmit = [UIAlertAction actionWithTitle:@"狠心删除"
                                                               style:UIAlertActionStyleDefault
                                                             handler:^(UIAlertAction * _Nonnull action) {
                                                               [self deletehData:m];
                                                             }];
        [alterController addAction:actionSubmit];
        [alterController addAction:actionCancel];
        [self.currentViewController_XG  presentViewController:alterController animated:YES completion:nil];
      };
      return node;
    };
  }
    return ^{
      ShowCellNode *node = [[ShowCellNode alloc]initWithModel:model index:indexPath.row];
      return node;
    };
}



/**
 删除文章数据
 */
- (void)deletehData:(ShowQuery_dataModel*)m
{
  if(m.showNo){
  [NetWorkTool requestWithURL:@"/social/show/content/delete@POST" params:@{@"showNo": m.showNo}  toModel:nil success:^(NSDictionary* result) {
    NSInteger index = [self.dataArr indexOfObject:m];
    [self.dataArr removeObject:m];
    [self.callBackArr removeObject:m];
    [self.collectionNode deleteItemsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]]];

  } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
  } showLoading:nil];
  }
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
  //  NSDictionary *textAttributes = @{
  //                                   NSFontAttributeName: [UIFont preferredFontForTextStyle:UIFontTextStyleHeadline],
  //                                   NSForegroundColorAttributeName: [UIColor grayColor]
  //                                   };
  //  UIEdgeInsets textInsets = UIEdgeInsetsMake(11.0, 0, 11.0, 0);
  //  ASTextCellNode *textCellNode = [[ASTextCellNode alloc] initWithAttributes:textAttributes insets:textInsets];
  //  textCellNode.text = [NSString stringWithFormat:@"Section %zd", indexPath.section + 1];
  return nil;
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
  //section header
  if ([kind isEqualToString:UICollectionElementKindSectionHeader]) {
    ShowCollectionReusableView * view = [collectionView dequeueReusableSupplementaryViewOfKind: UICollectionElementKindSectionHeader withReuseIdentifier:@"ShowCollectionReusableView" forIndexPath:indexPath];

    //    view.backgroundColor = [UIColor redColor];
    [view removeAllSubviews];
    [view addSubview:self.headerView];

    return view;
  }else{
    //section footer
    UICollectionReusableView * view = [collectionView dequeueReusableSupplementaryViewOfKind: UICollectionElementKindSectionFooter withReuseIdentifier:@"UICollectionReusableView_footer" forIndexPath:indexPath];
    return view;
  }
}


- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
  if (self.onScrollStateChanged) {
    self.onScrollStateChanged(@{@"state":[NSNumber numberWithInteger:1]});
  }
}

- (void)scrollViewWillBeginDecelerating:(UIScrollView *)scrollView{
  if (self.onScrollStateChanged) {
    self.onScrollStateChanged(@{@"state":[NSNumber numberWithInteger:1]});
  }

}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
  if (self.onScrollStateChanged) {
    self.onScrollStateChanged(@{@"state":[NSNumber numberWithInteger:0]});
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
  if(_onScrollY){
    _onScrollY(@{@"YDistance":@(Y)});
  }
  if (Y> self.height &&
      scrollView.bounces == YES &&
      scrollView.mj_footer.state != MJRefreshStateNoMoreData) {
    scrollView.bounces = NO;
  }else if((Y<self.height || scrollView.mj_footer.state == MJRefreshStateNoMoreData) &&
           scrollView.bounces == NO){
    scrollView.bounces = YES;
  }

}

-(void)setType:(NSString *)type{
  _type = type;  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  if(type && [defaults objectForKey:type]){
    NSDictionary *dicData = [NSDictionary dictionaryWithJsonString:[defaults objectForKey:type]];
    if (dicData) {
      self.callBackArr = [[dicData valueForKey:@"data"] mutableCopy];
      ShowQueryModel* model = [ShowQueryModel modelWithJSON:dicData];
      self.dataArr = [model.data mutableCopy];
    }
//    [self.collectionNode reloadData];
  }
}


- (void)setHeaderHeight:(NSInteger)headerHeight
{
  _headerHeight  = headerHeight;
  _layoutDelegate.headerHeight = headerHeight;
  _emptyView.sd_layout.topSpaceToView(self, headerHeight)
  .leftEqualToView(self).rightEqualToView(self).bottomEqualToView(self);
  [self.collectionNode reloadData];
}
//
- (void)didUpdateReactSubviews {
  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:[ShowHeaderView class]]) {
      self.headerView = view;
      [self.collectionNode reloadData];
    }
  }
}

//- (void)setHeaderHeight:(NSInteger)headerHeight
//{
//  _headerHeight  = headerHeight+44;
//  _layoutDelegate.headerHeight = _headerHeight+10;
//  _emptyView.sd_layout.topSpaceToView(self, _headerHeight+10)
//  .leftEqualToView(self).rightEqualToView(self).bottomEqualToView(self);
//  [self.collectionNode reloadData];
//}
////
//- (void)didUpdateReactSubviews {
//  for (UIView *view in self.reactSubviews) {
//    if ([view isKindOfClass:[ShowHeaderView class]]) {
//      UIView *headerBg = [[UIView alloc]init];
//      UIView *btnV = [[UIView alloc]init];
//      [headerBg addSubview:view];
//      [headerBg addSubview:btnV];
//
//      headerBg.sd_layout.topEqualToView(self)
//      .leftEqualToView(self).rightEqualToView(self)
//      .heightIs(self.headerHeight).widthIs(375);
//      headerBg.backgroundColor = [UIColor blueColor];
//
//      view.sd_layout.topEqualToView(headerBg)
//      .leftEqualToView(headerBg).rightEqualToView(headerBg)
//      .heightIs(self.headerHeight-44);
//
//      btnV.sd_layout.topSpaceToView(view, 0)
//      .leftEqualToView(headerBg).rightEqualToView(headerBg)
//      .heightIs(44);
//      btnV.backgroundColor = [UIColor redColor];
//
//      [headerBg setupAutoHeightWithBottomView:btnV bottomMargin:0];
//      self.headerView = headerBg;
//      [self.collectionNode reloadData];
//    }
//  }
//}


-(void)replaceData:(NSInteger) index num:(NSInteger) num{
  if (self.dataArr.count>index) {
      self.dataArr[index].click = num;
    [self.collectionNode reloadItemsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]]];
  }
}

// isFinish判断页面数据是否加载完成，未完成则不触发，防止崩溃
-(void)addDataToTopData:(NSDictionary*)data{
  if(self.isFinish){
    ShowQuery_dataModel* model = [ShowQuery_dataModel modelWithJSON:data];
    [self.dataArr insertObject:model atIndex:0];
    [self.callBackArr insertObject:data atIndex:0];
    [self.collectionNode reloadData];
  }
}


-(void)replaceItemData:(NSInteger)index data:(NSDictionary *)data{
  if(data){
    ShowQuery_dataModel* model = [ShowQuery_dataModel modelWithJSON:data];
    [self.dataArr replaceObjectAtIndex:index withObject:model];
    [self.callBackArr replaceObjectAtIndex:index withObject:data];
    [self.collectionNode reloadItemsAtIndexPaths:@[[NSIndexPath indexPathForRow:index inSection:0]]];
  }
}

-(void)scrollToTop{
  [self.collectionNode scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] atScrollPosition:UICollectionViewScrollPositionTop animated:YES];
}
@end
