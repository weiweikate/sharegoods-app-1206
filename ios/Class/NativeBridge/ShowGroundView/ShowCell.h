//
//  ShowCell.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/20.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ShowQueryModel.h"
NS_ASSUME_NONNULL_BEGIN

@interface ShowCell : UICollectionViewCell
@property(nonatomic, strong)ShowQuery_dataModel *model;
@end

NS_ASSUME_NONNULL_END
