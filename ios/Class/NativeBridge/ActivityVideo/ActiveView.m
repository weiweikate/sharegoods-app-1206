//
//  ActiveView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActiveView.h"
#import <AVFoundation/AVFoundation.h>
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import  <SDAutoLayout.h>
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "MBProgressHUD+PD.h"
#import <YYKit.h>

#import "MBAVAssetResourceLoader.h"
#import "MBScrollView.h"
#import "MBVideoModel.h"
#import "MBVideoHeaderView.h"
@interface ActiveView()<MBSrcollViewDataDelegate>

@property (nonatomic, strong)NSMutableArray* dataSource;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;

@property (nonatomic, strong)MBVideoHeaderView *VideoHeaderView;

@property (nonatomic, strong) MBScrollView *scrollView;
@property (nonatomic, assign) BOOL didPausePlay;

@end


@implementation ActiveView

#pragma mark - Custom Accessors

- (MBScrollView *)scrollView {
  if (!_scrollView) {
    _scrollView = [[MBScrollView alloc] init];
  }
  
  return _scrollView;
}

-(MBVideoHeaderView*)VideoHeaderView{
  if(!_VideoHeaderView){
    _VideoHeaderView = [[MBVideoHeaderView alloc]init];
  }
  return _VideoHeaderView;
}

- (NSMutableArray *)dataSource {
  if (!_dataSource) {
    _dataSource = [NSMutableArray new];
  }
  return _dataSource;
}

-(instancetype)init{
  self=[super init];
  if(self){
    self.didPausePlay = NO;
    [self initUI];
//    [self setupRefresh];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
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
//  self.tableView.mj_header = header;
//  [self.tableView.mj_header beginRefreshing];
  
  MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
  footer.triggerAutomaticallyRefreshPercent = -5;
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  
//  self.tableView.mj_footer = footer;
//  self.tableView.mj_footer.hidden = YES;
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
  //  __weak ShowGroundView * weakSelf = self;
  //  [NetWorkTool requestWithURL:self.uri params:dic  toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
  //    weakSelf.dataArr = [result.data mutableCopy];
//  [self.tableView.mj_header endRefreshing];
//  if(YES){
//    [self.tableView.mj_footer endRefreshingWithNoMoreData];
//  }else{
//    [self.tableView.mj_footer resetNoMoreData];
//  }
//  [self.tableView reloadData];
  //    if (weakSelf.collectionView.mj_footer.hidden) {
  //      //延迟0.5秒，防止第一次在刷新成功过程中在顶部出现footer《加载更多》
  //      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//  self.tableView.mj_footer.hidden = NO;
  //      });
  //    }
  //  } failure:^(NSString *msg, NSInteger code) {
  //    [MBProgressHUD showSuccess:msg];
  //    [weakSelf.collectionView.mj_header endRefreshing];
  //  } showLoading:nil];
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
  //  [NetWorkTool requestWithURL:self.uri params:dic toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
  //    [weakSelf.dataArr addObjectsFromArray:result.data];
  //    [weakSelf.collectionView reloadData];
  //    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
  //    if(result.data.count < 10){
  //      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
  //    }else{
  //      [weakSelf.collectionView.mj_footer endRefreshing];
  //    }
  //  } failure:^(NSString *msg, NSInteger code) {
  //    [MBProgressHUD showSuccess:msg];
  //    [weakSelf.collectionView.mj_footer endRefreshing];
  //  } showLoading:nil];
}


- (void)initUI {
  MBVideoModel *videoModel1 = [[MBVideoModel alloc] init];
  videoModel1.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel1.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/82010007db639677c13a.jpeg"];
  
  MBVideoModel *videoModel2 = [[MBVideoModel alloc] init];
  videoModel2.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel2.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/81db000e8706eaa0f924.jpeg"];
  
  MBVideoModel *videoModel3 = [[MBVideoModel alloc] init];
  videoModel3.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel3.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/820000099b44b23afad2.jpeg"];
  
  MBVideoModel *videoModel4 = [[MBVideoModel alloc] init];
  videoModel4.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel4.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/81eb000c20963982d2e7.jpeg"];
  [self addSubview:self.scrollView];
  [self addSubview:self.VideoHeaderView];
  
  self.scrollView.sd_layout.topEqualToView(self)
  .leftEqualToView(self).widthIs(KScreenWidth).heightIs(KScreenHeight);
  
  self.VideoHeaderView.sd_layout
  .topSpaceToView(self, 0).leftSpaceToView(self, 0)
  .rightSpaceToView(self, 0).heightIs(100);
  
  
  [self.scrollView.playerView.player play];
  self.didPausePlay = NO;
  [self.scrollView setupData:@[videoModel1, videoModel2, videoModel3, videoModel4]];
  self.scrollView.dataDelegate = self;
}

#pragma mark - Protocol conformance

- (void)pullNewData {
  MBVideoModel *videoModel1 = [[MBVideoModel alloc] init];
  videoModel1.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel1.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/82010007db639677c13a.jpeg"];
  
  MBVideoModel *videoModel2 = [[MBVideoModel alloc] init];
  videoModel2.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel2.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/81db000e8706eaa0f924.jpeg"];
  
  MBVideoModel *videoModel3 = [[MBVideoModel alloc] init];
  videoModel3.videoURL = [NSURL URLWithString:@"http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4"];
  videoModel3.imageURL = [NSURL URLWithString:@"http://pb3.pstatp.com/large/820000099b44b23afad2.jpeg"];
  
  [self.scrollView setupData:@[]];
}

@end
