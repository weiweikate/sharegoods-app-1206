//
//  MBScrollView.m
//  MBVideoPlayer
//
//  Created by chenda on 2018/5/9.
//  Copyright © 2018年 chenda. All rights reserved.
//

#import "MBScrollView.h"

#import <AVFoundation/AVFoundation.h>
#import  <SDAutoLayout.h>
#import "UIImageView+WebCache.h"
#import "NSString+UrlAddParams.h"
#import "MBProgressHUD+PD.h"

#import "MBVideoModel.h"
#import "MBBtnView.h"
#import "UIImageView+WebCache.h"

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height

#define IMAGEVIEW_COUNT 3

@interface MBScrollView() <UIScrollViewDelegate, MBPlayerViewDelegate,MBProtocol>

@property (nonatomic, strong) UIImageView *firstImageView, *secondImageView, *thirdImageView, *tempImageView;
//@property (nonatomic, strong)  MBPlayerView *firstPlayerView, *secondPlayerView, *thirdPlayerView;
//@property (nonatomic, strong) MBPlayerView *playerView;

@property (nonatomic, strong) NSMutableArray<MBModelData *> *dataArray;
@property (nonatomic, strong) MBModelData *firstVideoModel, *secondVideoModel, *thirdVideoModel;

@property (nonatomic, assign) NSInteger currentIndexOfImageView;
@property (nonatomic, assign) NSInteger currentIndexOfShowView;

@property (nonatomic, assign) NSInteger pagIndex;

@property (nonatomic, assign) BOOL isLoading;
@property (nonatomic, assign) BOOL isInitVideo;

@property (nonatomic) NSMutableArray<UIImageView *> *tempArray;

@property (nonatomic, strong) MBBtnView * btnView1,*btnView2,*btnView3;

@end

@implementation MBScrollView

#pragma mark - Lifecycle

- (instancetype)init {
    self = [super init];
    if (self) {
        self.pagingEnabled = YES;
        self.opaque = YES;
        self.backgroundColor = [UIColor blackColor];
        self.showsVerticalScrollIndicator = NO;
        self.showsHorizontalScrollIndicator = NO;
        if (@available(iOS 11.0, *)) {
            self.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
//        self.contentSize = CGSizeMake(0, KScreenHeight * 3);
      
        self.delegate = self;
        self.firstVideoModel = [[MBModelData alloc] init];
        self.secondVideoModel = [[MBModelData alloc] init];
        self.thirdVideoModel = [[MBModelData alloc] init];
    }
    
    return self;
}

#pragma mark - Custom Accessors

- (NSMutableArray *)dataArray {
    if (!_dataArray) {
        _dataArray = [NSMutableArray array];
    }
    
    return _dataArray;
}

- (MBPlayerView *)playerView {
    if (!_playerView) {
        _playerView = [[MBPlayerView alloc] init];
    }
    
    return _playerView;
}
-(MBBtnView *)btnView1{
  if(!_btnView1){
    _btnView1 = [[MBBtnView alloc]init];
    _btnView1.dataDelegate = self;
  }
  return _btnView1;
}

-(MBBtnView *)btnView2{
  if(!_btnView2){
    _btnView2 = [[MBBtnView alloc]init];
    _btnView2.dataDelegate = self;
  }
  return _btnView2;
}
-(MBBtnView *)btnView3{
  if(!_btnView3){
    _btnView3 = [[MBBtnView alloc]init];
    _btnView3.dataDelegate = self;

  }
  return _btnView3;
}
-(UIImageView *)firstImageView{
  if(!_firstImageView){
    _firstImageView = [[UIImageView alloc]init];
    _firstImageView.userInteractionEnabled = YES;
    [self addSubview:_firstImageView];
    [self addSubview:self.btnView1];
    self.btnView1.sd_layout
    .centerYEqualToView(_firstImageView)
    .centerYEqualToView(_firstImageView)
    .widthIs(KScreenWidth).heightIs(KScreenHeight);
  }
  return _firstImageView;
}

-(UIImageView *)secondImageView{
  if(!_secondImageView){
    _secondImageView = [[UIImageView alloc]init];
    _secondImageView.userInteractionEnabled = YES;
    [self addSubview:_secondImageView];
    [self addSubview:self.btnView2];
    self.btnView2.sd_layout
    .centerYEqualToView(_secondImageView)
    .centerYEqualToView(_secondImageView)
    .widthIs(KScreenWidth).heightIs(KScreenHeight);
  }
  return _secondImageView;
}

-(UIImageView *)thirdImageView{
  if(!_thirdImageView){
    _thirdImageView = [[UIImageView alloc]init];
    _thirdImageView.userInteractionEnabled = YES;
    [self addSubview:_thirdImageView];
    [self addSubview:self.btnView3];
    self.btnView3.sd_layout
    .centerYEqualToView(_thirdImageView)
    .centerYEqualToView(_thirdImageView)
    .widthIs(KScreenWidth).heightIs(KScreenHeight);
  }
  return _thirdImageView;
}
#pragma mark - IBActions

#pragma mark - Public
-(void)setIsLogin:(BOOL *)isLogin{
  _isLogin = isLogin;
  self.btnView1.isLogin = isLogin;
  self.btnView2.isLogin = isLogin;
  self.btnView3.isLogin = isLogin;

}

- (void)setupData:(NSArray<MBModelData *> *)data {
    if (data.count == 0) {
        return;
    }
  
    if (self.dataArray.count < 3) {//还没有数据
      if(self.dataArray.count<=3){
        self.dataArray = [NSMutableArray arrayWithArray:data];
      }
        self.contentSize = CGSizeMake(self.frame.size.width, self.frame.size.height * self.dataArray.count+1);
        if (self.dataArray.count > 0) {
          self.firstVideoModel = self.dataArray.firstObject;
          CGRect firstFrame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
          self.firstImageView.frame = firstFrame;
          self.btnView1.model = self.firstVideoModel;
          [self.firstImageView setImageWithURL:[NSURL URLWithString:[[self getUrlfromArr:self.firstVideoModel type:@"img"] getUrlAndWidth:KScreenWidth height:KScreenHeight]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"00000"]]];
          self.currentIndexOfImageView = 0;
        }
      
        if (self.dataArray.count > 1) {
            CGRect secondFrame = CGRectMake(0, self.frame.size.height, self.frame.size.width, self.frame.size.height);
            self.secondImageView.frame = secondFrame;
            self.secondVideoModel = self.dataArray[1];
            self.btnView2.model = self.secondVideoModel;
            [self.secondImageView setImageWithURL:[NSURL URLWithString:[[self getUrlfromArr:self.secondVideoModel type:@"img"] getUrlAndWidth:KScreenWidth height:KScreenHeight]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"00000"]]];
            self.currentIndexOfImageView++;
        }
        
        if (self.dataArray.count > 2) {
            CGRect thirdFrame = CGRectMake(0, self.frame.size.height * 2, self.frame.size.width, self.frame.size.height);
            self.thirdImageView.frame =  thirdFrame;
            self.thirdVideoModel = self.dataArray[2];
            self.btnView3.model = self.thirdVideoModel;
            [self.thirdImageView setImageWithURL:[NSURL URLWithString:[[self getUrlfromArr:self.thirdVideoModel type:@"img"] getUrlAndWidth:KScreenWidth height:KScreenHeight]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"00000"]]];
            self.currentIndexOfImageView++;
        }
      self.isLoading = NO;
//        [self playVideo];
    }else {
        for (MBModelData *model in data) {
            [self.dataArray addObject:model];
        }
        
        if (data.count > 0) {//如果获取到新的数据，则自动上滑显示
            self.contentSize = CGSizeMake(self.frame.size.width, self.frame.size.height * self.dataArray.count);
            self.contentOffset = CGPointMake(0, self.frame.size.height * self.currentIndexOfImageView);
        }
        self.isLoading = NO;
    }
}

#pragma mark - Private

- (void)playVideo {
  MBModelData *videoModel = [self.dataArray objectAtIndex:self.currentIndexOfShowView];
  [self.playerView setUrlString:[self getUrlfromArr:videoModel type:@"video"]];
  self.playerView.frame = CGRectMake(0, 0, KScreenWidth, KScreenHeight);
    if (self.firstImageView&&self.firstImageView.frame.origin.y == self.contentOffset.y) {
      [self.firstImageView addSubview:self.playerView ];
    }
    
    if (self.secondImageView&&self.secondImageView.frame.origin.y == self.contentOffset.y) {
      [self.secondImageView addSubview:self.playerView ];
    }
    
    if (self.thirdImageView&&self.thirdImageView.frame.origin.y == self.contentOffset.y) {
      [self.thirdImageView addSubview:self.playerView ];
    }
  self.isInitVideo = YES;
  self.playerView.playDelegate = self;
  [self.playerView setHidden:YES];
}

#pragma mark - Protocol conformance

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    CGFloat offset_y = scrollView.contentOffset.y;
    
    CGPoint translatePoint = [scrollView.panGestureRecognizer translationInView:scrollView];
    if (self.dataArray.count == 0) {
        return;
    }
    
    if (offset_y > (KScreenHeight * (self.dataArray.count - 1))) {
        if (self.isLoading) {
            return;
        }
        NSLog(@"拉到底部了");
        
        self.isLoading = YES;
        [self.dataDelegate pullNewData]; //如果拉到了底部，则去拉取新数据
        return;
    }

    if (self.currentIndexOfImageView > self.dataArray.count - 1) {
        return;
    }

    //向下滑动。
    if (offset_y > (KScreenHeight * self.currentIndexOfImageView) && translatePoint.y < 0) {
        self.currentIndexOfImageView++;
        NSLog(@"lalalalalal");
        if (self.currentIndexOfImageView == self.dataArray.count) {
            return;
        }
        self.firstImageView.frame = self.secondImageView.frame;
        self.firstImageView.image = self.secondImageView.image;
        self.btnView1.model = self.btnView2.model;

        self.secondImageView.frame = self.thirdImageView.frame;
        self.firstImageView.image = self.secondImageView.image;
        self.btnView1.model = self.btnView2.model;

        self.secondImageView.image = self.thirdImageView.image;
        self.btnView2.model = self.btnView3.model;
      
        CGRect frame = self.thirdImageView.frame;
        frame.origin.y += self.frame.size.height;
        self.thirdImageView.frame = frame;
      
        self.thirdVideoModel = [self.dataArray objectAtIndex:self.currentIndexOfImageView];
        self.btnView3.model = self.thirdVideoModel;
      
        [self.thirdImageView setImageWithURL:[NSURL URLWithString:[[self getUrlfromArr:self.thirdVideoModel type:@"img"] getUrlAndWidth:KScreenWidth height:KScreenHeight]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"00000"]]];
    }
    
    if (offset_y >= self.frame.size.height * (self.currentIndexOfShowView + 1) && translatePoint.y < 0) {
        self.currentIndexOfShowView++;
        if([self.dataDelegate respondsToSelector:@selector(getCurrentDataIndex:)]){
          [self.dataDelegate getCurrentDataIndex:self.currentIndexOfShowView];
        }
        NSLog(@"should Play");
//        [self playVideo];
    }
    
    if (offset_y < 0) {
        NSLog(@"已经到顶部了");
        return;
    }
    
    //向上滑动
    if (translatePoint.y > 0 && offset_y < self.secondImageView.frame.origin.y) {
        if (self.currentIndexOfImageView >= 3) {
            self.thirdImageView.frame = self.secondImageView.frame;
            self.thirdImageView.image = self.secondImageView.image;
            self.btnView3.model = self.btnView2.model;
          
            self.secondImageView.frame = self.firstImageView.frame;
            self.secondImageView.image = self.firstImageView.image;
            self.btnView2.model = self.btnView1.model;
          
            CGRect frame = self.firstImageView.frame;
            frame.origin.y -= self.frame.size.height;
            self.firstImageView.frame = frame;
            self.firstVideoModel = [self.dataArray objectAtIndex:self.currentIndexOfImageView - IMAGEVIEW_COUNT];
          self.btnView1.model = self.firstVideoModel;
          [self.firstImageView setImageWithURL:[NSURL URLWithString:[[self getUrlfromArr:self.firstVideoModel type:@"img"] getUrlAndWidth:KScreenWidth height:KScreenHeight]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"00000"]]];
          
            self.currentIndexOfImageView--;
        }
    }
    
    if (translatePoint.y > 0 && offset_y <= self.frame.size.height * (self.currentIndexOfShowView - 1) ) {
        self.currentIndexOfShowView--;
      if([self.dataDelegate respondsToSelector:@selector(getCurrentDataIndex:)]){
        [self.dataDelegate getCurrentDataIndex:self.currentIndexOfShowView];
      }
      NSLog(@"should back play");
//        [self playVideo];
    }
  
}

// 结束滚动后开始返回当前下标
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
  if(self.pagIndex!=self.currentIndexOfShowView&&(self.playerView.frame.origin.y!=scrollView.contentOffset.y||scrollView.contentOffset.y==0)){
    self.isInitVideo = false;
    self.btnView1.playImageView.hidden = NO;
    self.btnView2.playImageView.hidden = NO;
    self.btnView3.playImageView.hidden = NO;
    [self.playerView.player pause];
    self.playerView.hidden = YES;
    self.pagIndex = self.currentIndexOfShowView;
  }
}

- (void)playerViewDidPrepareToShowVideo {
    dispatch_async(dispatch_get_main_queue(), ^{
//        [self addSubview:self.playerView];
        self.playerView.hidden = NO;
    });
}

#pragma mark -  MBBtnViewDelegate
-(void)clickPlayOrPause{
  if(self.isInitVideo){
      if(self.playerView.isPlaying){
        [self.playerView.player pause];
      }else{
        [self.playerView.player play];
      }
  }else{
    [self playVideo];
  }

}

- (void)clickDownload:(MBModelData *)model{
  if(self.dataDelegate){
    [self.dataDelegate clickDownload:model];
  }
}

-(void)clicCollection:(MBModelData *)model{
  if(self.dataDelegate){
    [self.dataDelegate clicCollection:model];
  }
}

-(void)clickZan:(MBModelData *)model{
  if(self.dataDelegate){
    [self.dataDelegate clickZan:model];
  }
}

-(void)clickBuy:(MBModelData *)model{
  if(self.dataDelegate){
    [self.dataDelegate clickBuy:model];
  }
}


-(void)clickTag:(MBModelData *)model index:(NSInteger)index{
  if(self.dataDelegate){
    [self.dataDelegate clickTagBtn:model index:index];
  }
}

-(void)resetStatus{

}

-(NSString*)getUrlfromArr:(MBModelData*)data type:(NSString*)type{
  NSString * url = @"";
  if(data.resource.count>0){
    for(MBSourcesModel* model in data.resource){
      if([type isEqualToString:@"img"]&&model.type==5){
        url = model.baseUrl;
      }
      if([type isEqualToString:@"video"]&&model.type==4){
        url = model.baseUrl;
      }
    }
  }
  return url;
}
@end
