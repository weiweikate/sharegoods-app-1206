//
//  JXFooterView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface JXFooterView : UIView

@property (nonatomic,assign) NSInteger type; //事件类型
@property (nonatomic,strong) UIImageView * goodsImg;
@property (nonatomic,strong) UILabel * titile;
@property (nonatomic,strong) UILabel * price;
@property (nonatomic,strong) UIButton * shopCarBtn;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UIButton * downloadBtn;
@property (nonatomic,strong) UIButton * shareBtn;

@end

NS_ASSUME_NONNULL_END
