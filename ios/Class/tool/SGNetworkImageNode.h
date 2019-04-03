//
//  SGNetworkImageNode.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
// 解决网络图片reload闪烁的bug

#import <UIKit/UIKit.h>
#import <AsyncDisplayKit/AsyncDisplayKit.h>
NS_ASSUME_NONNULL_BEGIN

@interface SGNetworkImageNode : ASDisplayNode
/** 网络地址 */
@property (nonatomic, copy) NSURL *URL;
/** 转场color */
@property (nonatomic, strong)UIColor *placeholderColor;
/** 静态image */
@property (nonatomic, strong)UIImage *image;
/** 转场时间 */
@property (nonatomic, assign)NSTimeInterval js_placeholderFadeDuration;
/** 空置图片 */
@property (nonatomic, strong)UIImage *defaultImage;

@end

NS_ASSUME_NONNULL_END
