//
//  NSString+UrlAddParams.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "NSString+UrlAddParams.h"

@implementation NSString (UrlAddParams)

-(NSString *)urlAddCompnentForValue:(NSString *)value key:(NSString *)key{
  
  NSMutableString *string = [[NSMutableString alloc]initWithString:self];
  @try {
    NSRange range = [string rangeOfString:@"?"];
    if (range.location != NSNotFound) {//找到了
      //如果?是最后一个直接拼接参数
      if (string.length == (range.location + range.length)) {
        NSLog(@"最后一个是?");
        string = (NSMutableString *)[string stringByAppendingString:[NSString stringWithFormat:@"%@=%@",key,value]];
      }else{//如果不是最后一个需要加&
        if([string hasSuffix:@"&"]){//如果最后一个是&,直接拼接
          string = (NSMutableString *)[string stringByAppendingString:[NSString stringWithFormat:@"%@=%@",key,value]];
        }else{//如果最后不是&,需要加&后拼接
          string = (NSMutableString *)[string stringByAppendingString:[NSString stringWithFormat:@"&%@=%@",key,value]];
        }
      }
    }else{//没找到
      if([string hasSuffix:@"&"]){//如果最后一个是&,去掉&后拼接
        string = (NSMutableString *)[string substringToIndex:string.length-1];
      }
      string = (NSMutableString *)[string stringByAppendingString:[NSString stringWithFormat:@"?%@=%@",key,value]];
    }
  } @catch (NSException *exception) {
    
  } @finally {
    
  }
  
  
  return string.copy;
}

/*
 * 返回结果即为包含每行文字的数组，行数即为count数
 * 该方法主要是预先的计算出文本在UIlable等控件中的显示情况，
 */
- (NSArray *)getLinesArrayWithfont:(UIFont *)font andLableWidth:(CGFloat)lableWidth{
  NSString *string = self;
  CTFontRef myFont = CTFontCreateWithName(( CFStringRef)([font fontName]), [font pointSize], NULL);
  NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc] initWithString:string];
  [attStr addAttribute:(NSString *)kCTFontAttributeName value:(__bridge  id)myFont range:NSMakeRange(0, attStr.length)];
  CFRelease(myFont);
  CTFramesetterRef frameSetter = CTFramesetterCreateWithAttributedString(( CFAttributedStringRef)attStr);
  CGMutablePathRef path = CGPathCreateMutable();
  CGPathAddRect(path, NULL, CGRectMake(0,0,lableWidth,100000));
  CTFrameRef frame = CTFramesetterCreateFrame(frameSetter, CFRangeMake(0, 0), path, NULL);
  NSArray *lines = ( NSArray *)CTFrameGetLines(frame);
  NSMutableArray *linesArray = [[NSMutableArray alloc]init];
  for (id line in lines) {
    CTLineRef lineRef = (__bridge  CTLineRef )line;
    CFRange lineRange = CTLineGetStringRange(lineRef);
    NSRange range = NSMakeRange(lineRange.location, lineRange.length);
    NSString *lineString = [string substringWithRange:range];
    CFAttributedStringSetAttribute((CFMutableAttributedStringRef)attStr, lineRange, kCTKernAttributeName, (CFTypeRef)([NSNumber numberWithFloat:0.0]));
    CFAttributedStringSetAttribute((CFMutableAttributedStringRef)attStr, lineRange, kCTKernAttributeName, (CFTypeRef)([NSNumber numberWithInt:0.0]));
    [linesArray addObject:lineString];
  }
  
  CGPathRelease(path);
  CFRelease( frame );
  CFRelease(frameSetter);
  return (NSArray *)linesArray;
}

-(CGFloat)getStringHeightWithfontSize:(CGFloat)fontSize viewWidth:(CGFloat)width
{
  // 设置文字属性 要和label的一致
  NSDictionary *attrs = @{NSFontAttributeName : [UIFont systemFontOfSize:fontSize]};
  CGSize maxSize = CGSizeMake(width, MAXFLOAT);
  
  NSStringDrawingOptions options = NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading;
  
  // 计算文字占据的高度
  CGSize size = [self boundingRectWithSize:maxSize options:options attributes:attrs context:nil].size;
  
  //    当你是把获得的高度来布局控件的View的高度的时候.size转化为ceilf(size.height)。
  return  ceilf(size.height);
}

-(CGFloat)getWithStringSizeWidthfontSize:(CGFloat)fontSize viewWidth:(CGFloat)width{
  
  // 设置文字属性 要和label的一致
  NSDictionary *attrs = @{NSFontAttributeName : [UIFont systemFontOfSize:fontSize]};
  CGSize maxSize = CGSizeMake(width, MAXFLOAT);
  
  NSStringDrawingOptions options = NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading;
  
  // 计算文字占据的高度
  CGSize size = [self boundingRectWithSize:maxSize options:options attributes:attrs context:nil].size;
  
  //    当你是把获得的高度来布局控件的View的高度的时候.size转化为ceilf(size.height)。
  return  ceilf(size.width);
}

@end
