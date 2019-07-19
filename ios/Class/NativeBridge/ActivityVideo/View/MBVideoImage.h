//
//  MBVideoImage.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBProtocol.h"
#import "MBVideoModel.h"

NS_ASSUME_NONNULL_BEGIN
@class MBVideoImage;

@protocol  MBVideoImageDelegate <NSObject>
- (void)clickImagePlayOrPause; //点击播放/暂停
@end

@interface MBVideoImage : UIImageView
@property (nonatomic, weak) id<MBProtocol> dataDelegate;
@property (nonatomic, weak) id<MBVideoImageDelegate> Delegate;
@property(nonatomic,strong)MBModelData* model;

@end

NS_ASSUME_NONNULL_END
