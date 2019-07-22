//
//  MBScrollView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBPlayerView.h"
#import "MBVideoModel.h"

@class MBPlayerManager;
@protocol  MBSrcollViewDataDelegate <NSObject>

- (void)pullNewData;  //拉取新的额消息
- (void)clickDownload:(MBModelData*) model;
-(void)clicCollection:(MBModelData*) model;
-(void)clickZan:(MBModelData*) model;
-(void)clickBuy:(MBModelData*) model;
-(void)getCurrentDataIndex:(NSInteger)index;
-(void)clickTagBtn:(MBModelData*)model index:(NSInteger)index;

@end

@interface MBScrollView : UIScrollView

@property (nonatomic, weak) id<MBSrcollViewDataDelegate> dataDelegate;
@property (nonatomic, strong) MBPlayerView *playerView;
@property (nonatomic, assign) BOOL isLogin;

- (void)setupData:(NSArray<MBVideoModel *> *)data;


@end
