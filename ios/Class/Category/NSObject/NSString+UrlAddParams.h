//
//  NSString+UrlAddParams.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (UrlAddParams)
-(NSString *)urlAddCompnentForValue:(NSString *)value key:(NSString *)key;
/*
 * 返回结果即为包含每行文字的数组，行数即为count数
 * 该方法主要是预先的计算出文本在UIlable等控件中的显示情况，
 */
- (NSArray *)getLinesArrayWithfont:(UIFont *)font andLableWidth:(CGFloat)lableWidth;


-(CGFloat)getStringHeightWithfontSize:(CGFloat)fontSize viewWidth:(CGFloat)width;


-(CGFloat)getWithStringSizeWidthfontSize:(CGFloat)fontSize viewWidth:(CGFloat)width;
@end

NS_ASSUME_NONNULL_END
