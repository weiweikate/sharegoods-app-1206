//
//  UIImage+Util.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/10.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (Util)

/**
 获取启动图
 */
+ (UIImage *)getLaunchImage;

/**
 图片压缩
 */
-(NSData *)compressWithMaxLength:(NSUInteger)maxLength;

/**
 生成圆角图片
 */
-(UIImage *)creatRoundImagWithRadius:(CGFloat)radius width:(CGFloat)width height:(CGFloat)height;
/**
 高斯模糊
 */
-(UIImage *)boxblurWithBlurNumber:(CGFloat)blur;
/**
 修改透明度
 */
-(UIImage *)imageByApplyingAlpha:(CGFloat )alpha;
/**
 绘制二维码
 */
+ (UIImage *)QRCodeWithStr:(NSString *)str;
@end

NS_ASSUME_NONNULL_END
