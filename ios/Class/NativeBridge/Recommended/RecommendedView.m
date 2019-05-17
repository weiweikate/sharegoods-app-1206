//
//  RecommendedView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedView.h"
#import "RecommendedCell.h"
#import "RecTypeCell.h"
#import "Model/JXModel.h"
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import  <SDAutoLayout.h>
#import "ShowHeaderView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "MBProgressHUD+PD.h"
#import <YYKit.h>

#define SystemUpgradeCode 9999

@interface RecommendedView()<RecTypeCellDelegate,JXCellDelegate,UITableViewDelegate,UITableViewDataSource,UIScrollViewDelegate>
@property (nonatomic, weak)UITableView *tableView;
@property (nonatomic, strong)NSMutableArray *dataArr;
@property (nonatomic, strong)NSMutableArray *callBackArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;
@property (nonatomic, assign)NSInteger errCode;
@property(nonatomic, strong)UILabel *emptyLb;
@property (nonatomic, strong)UIView *emptyView;
@end

static NSString *ID = @"tabCell";
static NSString *IDType = @"TypeCell";

@implementation RecommendedView

-(instancetype)init{
  self=[super init];
  if(self){
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

-(void)setUI{
  self.backgroundColor = [UIColor redColor];
  UITableView *tableView = [[UITableView alloc]initWithFrame:self.bounds style: UITableViewStylePlain];
  tableView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
  tableView.delegate = self;
  tableView.dataSource = self;
  tableView.showsVerticalScrollIndicator = NO;
  [tableView registerClass:[RecommendedCell class] forCellReuseIdentifier:ID];
  [tableView registerClass:[RecTypeCell class] forCellReuseIdentifier:IDType];
    self.tableView =  tableView;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;//推荐该方法
    self.tableView.estimatedRowHeight = 0;
    self.tableView.estimatedSectionHeaderHeight = 0;
    self.tableView.estimatedSectionFooterHeight = 0;
    [self addSubview:tableView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _tableView.frame = self.bounds;
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
  self.tableView.mj_header = header;
  [self.tableView.mj_header beginRefreshing];

  MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
  footer.triggerAutomaticallyRefreshPercent = -5;
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];

  self.tableView.mj_footer = footer;
  self.tableView.mj_footer.hidden = YES;
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
  imgView.image = [UIImage imageNamed:@"Systemupgrade"];
  [_emptyView addSubview:imgView];

  imgView.sd_layout
  .centerXEqualToView(_emptyView)
  .centerYEqualToView(_emptyView)
  .widthIs(130)
  .heightIs(150);

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
  if (self.onStartRefresh) {
    self.onStartRefresh(@{});
  }
  self.page = 1;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"}];
  __weak RecommendedView * weakSelf = self;
  [NetWorkTool requestWithURL:self.uri params:dic toModel:nil success:^(NSDictionary * result) {

    JXModel* model = [JXModel modelWithJSON:result];
    weakSelf.dataArr = [model.data mutableCopy];
    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      weakSelf.callBackArr = [[result valueForKey:@"data"] mutableCopy];
    }

    [self.tableView.mj_header endRefreshing];
    if(model.data.count < 10){
      [weakSelf.tableView.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.tableView.mj_footer resetNoMoreData];
    }
    [self.tableView reloadData];
    if (weakSelf.tableView.mj_footer.hidden) {
      //延迟0.5秒，防止第一次在刷新成功过程中在顶部出现footer《加载更多》
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.tableView.mj_footer.hidden = NO;
      });
    }
    weakSelf.errCode = 10000;
  } failure:^(NSString *msg, NSInteger code) {
    weakSelf.errCode = code;
    [MBProgressHUD showSuccess:msg];
    [weakSelf.tableView.mj_header endRefreshing];
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
    __weak  RecommendedView * weakSelf = self;
    [NetWorkTool requestWithURL:self.uri params:dic toModel:nil success:^(NSDictionary * result) {

      JXModel* model = [JXModel modelWithJSON:result];
      [weakSelf.dataArr addObjectsFromArray:model.data];
      if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
        [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
      }
    [weakSelf.tableView reloadData];
    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
      if(model.data.count < 10){
      [weakSelf.tableView.mj_footer endRefreshingWithNoMoreData];
    }else{
      [weakSelf.tableView.mj_footer endRefreshing];
    }
      weakSelf.errCode = 10000;
  } failure:^(NSString *msg, NSInteger code) {
    weakSelf.errCode = code;
    [MBProgressHUD showSuccess:msg];
    [weakSelf.tableView.mj_footer endRefreshing];
  } showLoading:nil];
}



#define UITableViewDataSource
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
  return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
//  return self.data.count;
  return self.dataArr.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
  JXModelData * model= [self.dataArr objectAtIndex:indexPath.row];
  if(model.showType&& model.showType == 2){
    RecTypeCell * cell = [tableView dequeueReusableCellWithIdentifier:IDType];
    cell.model = model;
    cell.recTypeDelegate = self;
    cell.clipsToBounds = YES;
    return cell;

  }
  RecommendedCell * cell = [tableView dequeueReusableCellWithIdentifier:ID];
  cell.model = model;
  cell.cellDelegate = self;
  cell.clipsToBounds = YES;
  cell.login = self.userIsLogin;
  return cell;
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    /* model 为模型实例， keyPath为 model的属性名，通过 kvc统一赋值接口 */
    // keypath:比如你要显示的是str,str对应的model的属性是text（model属性名）
  JXModelData * modelType= [self.dataArr objectAtIndex:indexPath.row];
  if(modelType.showType&& modelType.showType == 2){
    return [self.tableView cellHeightForIndexPath:indexPath model:_dataArr[indexPath.row] keyPath:@"model" cellClass:[RecTypeCell class] contentViewWidth: self.frame.size.width];
  }
    return [self.tableView cellHeightForIndexPath:indexPath model:_dataArr[indexPath.row] keyPath:@"model" cellClass:[RecommendedCell class] contentViewWidth: self.frame.size.width];
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
//  JXModelData * model= [self.dataArr objectAtIndex:indexPath.row];
//  if(model.showType&& model.showType == 2){
    if (_onItemPress) {
      NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[indexPath.row]];
      [dic setObject:[NSNumber numberWithInteger:indexPath.row] forKey:@"index"];
      [self.callBackArr replaceObjectAtIndex:indexPath.row withObject:dic];
      _onItemPress(self.callBackArr[indexPath.row]);
    }
//  }
}

#pragma mark - 按钮点击代理
/**
 *  折叠按钮点击代理
 *
 *  @param cell 按钮所属cell
 */

-(void)clickFoldLabel:(RecommendedCell*)cell{
    NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
    JXModelData *model = self.dataArr[indexPath.row];
    model.isOpening = !model.isOpening;
    [self.tableView beginUpdates];
    [self.tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
}

-(void)imageClick:(RecommendedCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if (_onNineClick) {
    NSMutableArray * images = [NSMutableArray new];
    for (NSDictionary* image in cell.model.resource) {
      [images addObject:[image valueForKey:@"url"]];
    }
    NSDictionary * dic = @{@"imageUrls":images,@"index":[NSNumber numberWithInteger:indexPath.row]};
    _onNineClick(dic);
  }
}

-(void)addCar:(RecommendedCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if(_onAddCartClick) {
    _onAddCartClick(@{
                      @"detail":self.callBackArr[indexPath.item],
                      @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
}

-(void)zanClick:(RecommendedCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  JXModelData *model = self.dataArr[indexPath.row];
  if(!model.like){
    model.likesCount++;
  }else{
    model.likesCount--;
  }
  model.like = !model.like;

  NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[indexPath.row]];
  [dic setObject:[NSNumber numberWithInteger:model.likesCount] forKey:@"likesCount"];
  [dic setObject:@(model.like) forKey:@"like"];
  [self.callBackArr replaceObjectAtIndex:indexPath.row withObject:dic];
  if(_onZanPress) {
    _onZanPress(@{
                  @"detail":self.callBackArr[indexPath.item],
                  @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
  [self.tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
}

-(void)downloadClick:(RecommendedCell *)cell{
  NSLog(@"delegate 3");
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if(_onDownloadPress) {
    _onDownloadPress(@{
                       @"detail":self.callBackArr[indexPath.item],
                       @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
}

-(void)shareClick:(RecommendedCell *)cell{
  NSLog(@"delegate 4");
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if(_onSharePress) {
    _onSharePress(@{
                    @"detail":self.callBackArr[indexPath.item],
                    @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
}

-(void)labelClick:(RecommendedCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if (_onItemPress) {
    NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[indexPath.row]];
    [dic setObject:[NSNumber numberWithInteger:indexPath.row] forKey:@"index"];
    [self.callBackArr replaceObjectAtIndex:indexPath.row withObject:dic];
    _onItemPress(self.callBackArr[indexPath.row]);
  }
}

- (void)didUpdateReactSubviews {
  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:[ShowHeaderView class]]) {
      self.tableView.tableHeaderView = view;
      [self.tableView reloadData];
    }
  }
}


#pragma mark - RecTypeCell-delegate

-(void)zanBtnClick:(RecTypeCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  JXModelData *model = self.dataArr[indexPath.row];
  model.like = !model.like;
  [self.tableView beginUpdates];
  [self.tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
  [self.tableView endUpdates];
  if(_onZanPress) {
    _onZanPress(@{
                  @"detail":self.callBackArr[indexPath.item],
                  @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
}

-(void)shareBtnClick:(RecTypeCell *)cell{
  NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
  if(_onSharePress) {
    _onSharePress(@{
                    @"detail":self.callBackArr[indexPath.item],
                    @"index":[NSNumber numberWithInteger:indexPath.row]});
  }
}

-(void)clickLabel:(RecTypeCell *)cell{

}


#pragma mark - scrollView-delegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  CGFloat Y = scrollView.contentOffset.y;
  if(_onScrollY){
    _onScrollY(@{@"YDistance":@(Y)});
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

-(void)replaceData:(NSInteger) index num:(NSInteger) num{
  if (self.dataArr.count>index) {

  }
}

-(void)replaceItemData:(NSInteger)index data:(NSDictionary *)data{
  if(data){
    JXModelData* model = [JXModelData modelWithJSON:data];
    [self.dataArr replaceObjectAtIndex:index withObject:model];
    [self.callBackArr replaceObjectAtIndex:index withObject:data];
  [self.tableView reloadRowAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0] withRowAnimation:UITableViewRowAnimationNone];
  }
}

-(void)scrollToTop{
  [self.tableView  scrollRectToVisible:CGRectMake(0, 0, 1, 1) animated:NO];
}

@end
