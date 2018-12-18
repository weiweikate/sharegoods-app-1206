//
//  SCCell.h
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface SCCell : UITableViewCell

+(instancetype)cellWithTableView:(UITableView *)tableView andId:(NSString *)cellID;
@end

NS_ASSUME_NONNULL_END
