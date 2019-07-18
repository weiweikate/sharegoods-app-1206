//
//  MBScrollView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBPlayerView.h"

@class MBPlayerManager;
@class MBVideoModel;

@protocol  MBSrcollViewDataDelegate <NSObject>

- (void)pullNewData;  //拉取新的额消息
- (void)clickDownload;
-(void)clicCollection;
-(void)clickZan;
-(void)clickBuy;
@end

@interface MBScrollView : UIScrollView

@property (nonatomic, weak) id<MBSrcollViewDataDelegate> dataDelegate;
@property (nonatomic, strong) MBPlayerView *playerView;

- (void)setupData:(NSArray<MBVideoModel *> *)data;


@end
