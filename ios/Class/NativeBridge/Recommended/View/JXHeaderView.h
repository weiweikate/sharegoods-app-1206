//
//  JXHeaderView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JXModel.h"

NS_ASSUME_NONNULL_BEGIN

@class RecommendedCell;

@interface JXHeaderView : UIView

@property(nonatomic,strong)UserInfoModel* UserInfoModel;
@property(nonatomic,copy)NSString* time;

@end

NS_ASSUME_NONNULL_END
