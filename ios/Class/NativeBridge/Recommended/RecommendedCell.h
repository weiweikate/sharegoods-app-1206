//
//  Recommended Cell.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Model/JXModel.h"

NS_ASSUME_NONNULL_BEGIN

@class RecommendedCell;

@protocol JXCellDelegate <NSObject>
/**
 *  折叠按钮点击代理
 *
 *  @param cell 按钮所属cell
 */
- (void)clickFoldLabel:(RecommendedCell*)cell;

  //点击回调
- (void)labelClick:(RecommendedCell*)cell;
-(void)zanClick:(RecommendedCell*)cell;
-(void)downloadClick:(RecommendedCell*)cell;
-(void)shareClick:(RecommendedCell*)cell;
-(void)imageClick:(RecommendedCell*)cell;

@end

typedef void(^cellBlock)(RecommendedCell*);//block写法比较特殊，一般重命名一下


@interface RecommendedCell : UITableViewCell
@property (nonatomic,strong) JXModelData * model;
@property (nonatomic,copy) cellBlock block;
@property (nonatomic, weak) id<JXCellDelegate> cellDelegate;

@end

NS_ASSUME_NONNULL_END
