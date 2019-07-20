//
//  MBVideoHeaderView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBVideoModel.h"
NS_ASSUME_NONNULL_BEGIN

@class MBVideoHeaderView;

@protocol  MBHeaderViewDelegate <NSObject>
- (void)headerClick;
- (void)goBack; 
- (void)guanzhuClick;
- (void)shareClick;
@end


@interface MBVideoHeaderView : UIView
@property (nonatomic, weak) id<MBHeaderViewDelegate> dataDelegate;
@property(nonatomic,strong)MBModelData* model;

@end

NS_ASSUME_NONNULL_END
