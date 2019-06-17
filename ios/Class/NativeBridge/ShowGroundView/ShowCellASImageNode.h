//
//  ShowCellASImageNode.h
//  crm_app_xiugou
//
//  Created by slardar chen on 2019/6/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AsyncDisplayKit/AsyncDisplayKit.h>
#import "ShowQueryModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface ShowCellASImageNode : ASCellNode
-(instancetype)initWithModel:(ShowQuery_dataModel *)model;
@end

NS_ASSUME_NONNULL_END
