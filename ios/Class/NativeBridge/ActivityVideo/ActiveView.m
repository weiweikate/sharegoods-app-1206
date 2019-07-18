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

@interface ActiveView()<MBSrcollViewDataDelegate,MBHeaderViewDelegate>

@property (nonatomic, strong)NSMutableArray *dataArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)NSMutableArray *callBackArr;

@property (nonatomic, strong)UIView *headerView;

@property (nonatomic, strong)MBVideoHeaderView *VideoHeaderView;

@property (nonatomic, strong) MBScrollView *scrollView;
@property (nonatomic, assign) BOOL didPausePlay;

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
    self.didPausePlay = NO;
    self.page = 1;
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
  _dataArr = [NSMutableArray new];
  _callBackArr = [NSMutableArray new];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
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
//  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector()];
//  [_emptyView addGestureRecognizer:tap];
  _emptyView.hidden = YES;
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
  __weak ActiveView * weakSelf = self;

  [NetWorkTool requestWithURL:@"/social/show/video/list/next?currentShowNo=SHOW2019071711285263900000600000@GET" params:dic toModel:nil success:^(NSDictionary* result) {
    MBVideoModel* model = [MBVideoModel modelWithJSON:result];
    weakSelf.dataArr = [model.data mutableCopy];
    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      weakSelf.callBackArr = [[result valueForKey:@"data"] mutableCopy];
    }
    
      [self.scrollView setupData:weakSelf.dataArr];

    } failure:^(NSString *msg, NSInteger code) {

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
  [self getMoreData];
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

#pragma arguments - delegate

- (void)clickDownload{
  
}

-(void)clicCollection{
 
}

-(void)clickZan{
 
}

-(void)clickBuy{
 
}

-(void)goBack{
  
}

-(void)headerClick{
  
}

- (void)guanzhuClick{
  
}

- (void)shareClick{
  
}

@end
