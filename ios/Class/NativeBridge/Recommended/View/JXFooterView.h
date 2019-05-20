//
//  JXFooterView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JXModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface JXFooterView : UIView

@property (nonatomic,assign) NSInteger downloadCount;

@property (nonatomic,assign) NSInteger likesCount;
@property (nonatomic,assign) NSInteger shareCount;
@property (nonatomic,copy) NSString * showNo;
@property (nonatomic,assign) NSInteger type; //事件类型
@property (nonatomic,strong)NSArray * products;
@property (nonatomic,assign) BOOL isLike;

@property(nonatomic,copy)void (^clickGoods)(GoodsDataModel*);
@property(nonatomic,copy)void (^zanBlock)(NSString*);
@property(nonatomic,copy)void (^downloadBlock)(NSString*);
@property(nonatomic,copy)void (^shareBlock)(NSString*);
@property(nonatomic,copy)void (^addCarBlock)(GoodsDataModel*);

@end

NS_ASSUME_NONNULL_END
