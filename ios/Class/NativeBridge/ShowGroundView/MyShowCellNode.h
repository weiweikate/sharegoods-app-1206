//
//  MyShowCellNode.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/6/20.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ASCellNode.h"
#import "ShowQueryModel.h"

@interface MyShowCellNode : ASCellNode
-(instancetype)initWithModel:(ShowQuery_dataModel *)model index: (NSInteger)index;
@property(nonatomic, strong)void (^deletBtnTapBlock)(ShowQuery_dataModel* model,NSInteger index);
@end

