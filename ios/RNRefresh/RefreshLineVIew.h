//
//  RefreshLineVIew.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/9/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RefreshLineVIew : UIView
@property(nonatomic, strong)CAShapeLayer *leftLine;
@property(nonatomic, strong)CAShapeLayer *rightLine;
@property(nonatomic, assign)CGFloat strokeStart;
@property(nonatomic, assign)CGFloat strokeEnd;
@end

NS_ASSUME_NONNULL_END
