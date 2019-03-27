//
//  ShowCellNode.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AsyncDisplayKit/AsyncDisplayKit.h>
#import "ShowQueryModel.h"
@interface ShowCellNode : ASCellNode
-(instancetype)initWithModel:(ShowQuery_dataModel *)model;
@end

