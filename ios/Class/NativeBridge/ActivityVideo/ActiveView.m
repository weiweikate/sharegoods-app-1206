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

#import "MBScrollView.h"
#import "MBVideoModel.h"
#import "MBVideoHeaderView.h"
#import "MBFileManager.h"
#import "MBNetworkManager.h"

@interface ActiveView()<MBSrcollViewDataDelegate,MBHeaderViewDelegate>

@property (nonatomic, strong)NSMutableArray *dataArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, assign)NSInteger current;
@property (nonatomic, strong)NSMutableArray *callBackArr;

@property (nonatomic, strong)UIView *headerView;

@property (nonatomic, strong)MBVideoHeaderView *VideoHeaderView;

@property (nonatomic, strong) MBScrollView *scrollView;
@property (nonatomic, assign) BOOL didPausePlay;
@property (nonatomic, assign) BOOL isPersonal;
@property (nonatomic, assign) BOOL isCollect;
@property (nonatomic, assign) NSInteger tabType;
@property (nonatomic, assign) BOOL isEnd;

@property(nonatomic, strong)UILabel *emptyLb;
@property (nonatomic, strong)UIView *emptyView;

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
    _VideoHeaderView.dataDelegate = self;
  }
  return _VideoHeaderView;
}

-(instancetype)init{
  self=[super init];
  if(self){
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"guanzhu"];
    if([MBFileManager clearCache]){//清除网络层保存的下载进度
      [[MBNetworkManager shareInstance] clearDownloadingOffset]; //清除网络层保存的下载进度
    };
    self.didPausePlay = NO;
    [self initData];
    [self initUI];
//    [self setupRefresh];
  }
  return self;
}

/**
 初始化
 */
- (void)initData
{
  self.page = 1;
  self.current = 0;
  _dataArr = [NSMutableArray new];
  _callBackArr = [NSMutableArray new];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
}

/**
 刷新数据
 */
- (void)refreshData
{
  NSMutableDictionary *dic = [NSMutableDictionary new];
  NSString *currentShowNo = @"";
  if(self.dataArr.lastObject){
   currentShowNo = [self.dataArr.lastObject valueForKey:@"showNo"];
  }
  if(self.isPersonal&&self.userCode){
    [dic setObject:self.userCode forKey:@"queryUserCode"];
  }

  if(self.isCollect){
    [dic setObject:@(1) forKey:@"isCollect"];
  }
  if(self.tabType){
    [dic setObject:[NSNumber numberWithInteger:self.tabType]  forKey:@"spreadPosition"];
  }
  [dic addEntriesFromDictionary:@{@"currentShowNo":currentShowNo}];

  __weak ActiveView * weakSelf = self;
  [NetWorkTool requestWithURL:@"/social/show/video/list/next@GET" params:dic toModel:nil success:^(NSDictionary* result) {
    MBVideoModel* model = [MBVideoModel modelWithJSON:result];
    [weakSelf.dataArr addObjectsFromArray:model.data];
    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
    }
    if(model.data.count<5){
      self.isEnd = YES;
    }
    self.VideoHeaderView.model = weakSelf.dataArr.firstObject;
    [self.scrollView setupData:weakSelf.dataArr];

  } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
  } showLoading:nil];
}

/**
 加载更多数据
 */
- (void)getMoreData
{
  if(self.isEnd){
    return;
  }
  NSMutableDictionary *dic = [NSMutableDictionary new];
  NSString *currentShowNo = [self.dataArr.lastObject valueForKey:@"showNo"];
  if(self.isPersonal&&self.userCode){
    [dic setObject:self.userCode forKey:@"queryUserCode"];
  }
  if(self.isCollect){
    [dic setObject:@(1)  forKey:@"isCollect"];
  }
  if(self.tabType){
    [dic setObject:[NSNumber numberWithInteger:self.tabType]  forKey:@"spreadPosition"];
  }
  [dic addEntriesFromDictionary:@{@"currentShowNo": currentShowNo}];
  __weak ActiveView * weakSelf = self;

  [NetWorkTool requestWithURL:@"/social/show/video/list/next@GET" params:dic toModel:nil success:^(NSDictionary* result) {
    MBVideoModel* model = [MBVideoModel modelWithJSON:result];
      [weakSelf.dataArr addObjectsFromArray:model.data];
      if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
        [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
      }
      if(model.data.count<5){
        self.isEnd = YES;
        [MBProgressHUD showSuccess:@"我也是有底线的"];
      }
      [self.scrollView setupData:[model.data mutableCopy]];
    } failure:^(NSString *msg, NSInteger code) {
      [MBProgressHUD showSuccess:msg];
    } showLoading:nil];
}


- (void)initUI {
  [self addSubview:self.scrollView];
  [self addSubview:self.VideoHeaderView];

  self.scrollView.sd_layout.topEqualToView(self)
  .leftEqualToView(self).widthIs(KScreenWidth).heightIs(KScreenHeight);

  self.VideoHeaderView.sd_layout
  .topSpaceToView(self, 0).leftSpaceToView(self, 0)
  .rightSpaceToView(self, 0).heightIs(100);
  self.scrollView.dataDelegate = self;
}

-(void)setParams:(NSDictionary *)params{
  MBModelData* firstData = [MBModelData modelWithJSON:params];
  self.isPersonal = firstData.isPersonal;
  self.isCollect = firstData.isCollect;
  self.tabType = firstData.tabType;

  self.dataArr = [NSMutableArray arrayWithObject:firstData];
  self.callBackArr = [NSMutableArray arrayWithObject:params];
  self.VideoHeaderView.model = firstData;
  [self.scrollView setupData:self.dataArr];
  [self videoHotRequest];
  if(!self.isPersonal){
    [self refreshData];
  }
}


-(void)setUserCode:(NSString *)userCode{
  _userCode = userCode;
  self.VideoHeaderView.userCode = userCode;
  if(userCode&&userCode.length>0){
    self.VideoHeaderView.isLogin = YES;
    self.scrollView.isLogin = YES;
  }else{
    self.VideoHeaderView.isLogin = NO;
    self.scrollView.isLogin = NO;
  }
  if(self.isPersonal){
    [self refreshData];
  }
}

#pragma mark - Protocol conformance

- (void)pullNewData {
  self.page++;
  [self getMoreData];
}

#pragma arguments - delegate
-(void)getCurrentDataIndex:(NSInteger)index{
  NSLog(@"getCurrentDataIndex==%ld",index);
  self.current = index;
  if(self.current<self.dataArr.count&&[self.dataArr objectAtIndex:self.current]){
    self.VideoHeaderView.model =[self.dataArr objectAtIndex:self.current];
    [self videoHotRequest];
  }
}

- (void)clickDownload:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
  if(_onDownloadPress){
    _onDownloadPress(self.callBackArr[self.current]);
  }
}

-(void)clicCollection:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
  NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[self.current]];
  [dic setObject:@(model.collect) forKey:@"collect"];
  if(_onCollection){
    _onCollection(dic);
  }
}

-(void)clickZan:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
  NSMutableDictionary * dic = [NSMutableDictionary dictionaryWithDictionary:self.callBackArr[self.current]];
  [dic setObject:@(model.like) forKey:@"like"];
  if(_onZanPress){
    _onZanPress(dic);
  }
}

-(void)clickBuy:(MBModelData *)model{
  if(_onBuy){
    _onBuy(self.callBackArr[self.current]);
  }
}

-(void)clickTagBtn:(MBModelData *)model index:(NSInteger)index{
  NSLog(@"%@",model.showTags[index-1]);
  if(_onPressTag){
    NSDictionary *dic = [NSDictionary dictionaryWithDictionary:(NSDictionary*)model.showTags[index-1]];
    _onPressTag(dic);
  }
}

-(void)goBack{
  if(_onBack){
    _onBack(@{});
  }
}

-(void)headerClick:(MBModelData *)model{
  if(_onSeeUser){
    _onSeeUser(self.callBackArr[self.current]);
  }
}

- (void)guanzhuClick:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
  if(_onAttentionPress){
    _onAttentionPress(self.callBackArr[self.current]);
  }
}

- (void)shareClick:(MBModelData *)model{
  if(_onSharePress){
    _onSharePress(self.callBackArr[self.current]);
  }
}


#pragma arguments -- 视频热度接口请求

-(void)videoHotRequest{
  MBModelData* data = self.dataArr[self.current];

  if(data.showNo){
    [NetWorkTool requestWithURL:ShowApi_incrCountByType params:@{@"showNo": data.showNo,@"type":@6}  toModel:nil success:^(NSDictionary* result) {

    } failure:^(NSString *msg, NSInteger code) {
    [MBProgressHUD showSuccess:msg];
    } showLoading:nil];
  }
}

@end
