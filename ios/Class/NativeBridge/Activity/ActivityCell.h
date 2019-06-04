//
//  ActivityCell.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Model/ActiveModel.h"

@class ActivityCell;

NS_ASSUME_NONNULL_BEGIN

typedef void(^cellBlock)(ActivityCell*);//block写法比较特殊，一般重命名一下

@interface ActivityCell : UITableViewCell
@property (nonatomic,strong) ActiveModel * model;
@property (nonatomic,copy) cellBlock block;

@end

NS_ASSUME_NONNULL_END
