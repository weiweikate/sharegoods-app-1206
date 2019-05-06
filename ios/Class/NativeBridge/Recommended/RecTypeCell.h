//
//  RecTypeCell.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/5.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Model/JXModel.h"

NS_ASSUME_NONNULL_BEGIN

@class RecTypeCell;

@protocol recTypeCellDelegate <NSObject>

- (void)clickLabel:(RecTypeCell*)cell;

@end


@interface RecTypeCell : UITableViewCell

@property (nonatomic,strong) JXModel * model;
@property (nonatomic, weak) id<recTypeCellDelegate> recTypeDelegate;

@end

NS_ASSUME_NONNULL_END
