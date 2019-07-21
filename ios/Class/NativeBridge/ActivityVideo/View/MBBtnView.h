//
//  MBBtnView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBProtocol.h"
#import "MBVideoModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface MBBtnView : UIView
@property (nonatomic, weak) id<MBProtocol> dataDelegate;
@property (nonatomic,strong) UIImageView *playImageView;        //播放按钮
@property(nonatomic,strong)MBModelData* model;
@property (nonatomic, assign) BOOL *isLogin;

@end

NS_ASSUME_NONNULL_END
