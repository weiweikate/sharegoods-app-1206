//
//  MBToastLabelView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 提示类
 */
@interface MBToastLabelView : UIView

+ (instancetype)message:(NSString *)message delaySecond:(CGFloat)second;

@end
