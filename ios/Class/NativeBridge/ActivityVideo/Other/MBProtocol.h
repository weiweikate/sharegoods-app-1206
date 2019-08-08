//
//  MBProtocol.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/18.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MBVideoModel.h"

NS_ASSUME_NONNULL_BEGIN

@protocol MBProtocol <NSObject>

- (void)clickBuy:(MBModelData*) model;
- (void)clickPlayOrPause; //点击播放/暂停
- (void)clickDownload:(MBModelData*) model;
- (void)clicCollection:(MBModelData*) model;
-(void)clickZan:(MBModelData*) model;
-(void)clickTag:(MBModelData*) model index:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
