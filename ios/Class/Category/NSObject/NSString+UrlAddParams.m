//
//  NSString+UrlAddParams.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "NSString+UrlAddParams.h"

@implementation NSString (UrlAddParams)

+(NSString *)stringWithNumber:(NSInteger)count{
  NSString * num = @"";
  if(count<=999){
    num = [NSString stringWithFormat:@"%ld",count>0?count:0];
  }else if(count<10000){
    num = [NSString stringWithFormat:@"%ldK+",count>0?count/1000:0];
  }else if(count<=100000){
    num = [NSString stringWithFormat:@"%ldW+",count>0?count/10000:0];
  }else if(count>100000){
    num = @"10W+";
  }
  
  return num;
}

+(NSString*)convertNSDictionaryToJsonString:(NSDictionary *)json{
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:json options:NSJSONWritingPrettyPrinted error:&error];
  if (error) {
    NSLog(@"json解析失败:%@", error);
    return nil;
  }
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  return jsonString;
}


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

-(CGFloat)getWidthStringfontSize:(CGFloat)fontSize viewWidth:(CGFloat)width{
  
  // 设置文字属性 要和label的一致
  NSDictionary *attrs = @{NSFontAttributeName : [UIFont systemFontOfSize:fontSize]};
  CGSize maxSize = CGSizeMake(width, MAXFLOAT);
  
  NSStringDrawingOptions options = NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading;
  
  // 计算文字占据的高度
  CGSize size = [self boundingRectWithSize:maxSize options:options attributes:attrs context:nil].size;
  
  //    当你是把获得的高度来布局控件的View的高度的时候.size转化为ceilf(size.height)。
  return  ceilf(size.width);
}

-(NSString*)getUrlAndWidth:(CGFloat)width height:(CGFloat)height{
  if(self){
    CGFloat scale = [UIScreen mainScreen].scale;
    NSString* showImage = [self componentsSeparatedByString:@"?"].firstObject;
    if([self containsString:@".webp"]||[self containsString:@".gif"]){
      return self;
    }
    showImage = [NSString stringWithFormat:@"%@?x-oss-process=image/resize,m_lfit,w_%0.0lf,h_%0.0lf/quality,Q_80",showImage,width*scale,height*scale];
    return showImage;
  }
  return nil;
}

/**
 *  截取URL中的参数
 *
 *  @return NSMutableDictionary parameters
 */
- (NSMutableDictionary *)getURLParameters{
  NSString *urlStr = self;
  
  // 查找参数
  NSRange range = [urlStr rangeOfString:@"?"];
  if (range.location == NSNotFound) {
    return nil;
  }
  
  // 以字典形式将参数返回
  NSMutableDictionary *params = [NSMutableDictionary dictionary];
  
  // 截取参数
  NSString *parametersString = [urlStr substringFromIndex:range.location + 1];
  
  // 判断参数是单个参数还是多个参数
  if ([parametersString containsString:@"&"]) {
    
    // 多个参数，分割参数
    NSArray *urlComponents = [parametersString componentsSeparatedByString:@"&"];
    
    for (NSString *keyValuePair in urlComponents) {
      // 生成Key/Value
      NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
      NSString *key = [pairComponents.firstObject stringByRemovingPercentEncoding];
      NSString *value = [pairComponents.lastObject stringByRemovingPercentEncoding];
      
      // Key不能为nil
      if (key == nil || value == nil) {
        continue;
      }
      
      id existValue = [params valueForKey:key];
      
      if (existValue != nil) {
        
        // 已存在的值，生成数组
        if ([existValue isKindOfClass:[NSArray class]]) {
          // 已存在的值生成数组
          NSMutableArray *items = [NSMutableArray arrayWithArray:existValue];
          [items addObject:value];
          
          [params setValue:items forKey:key];
        } else {
          
          // 非数组
          [params setValue:@[existValue, value] forKey:key];
        }
        
      } else {
        
        // 设置值
        [params setValue:value forKey:key];
      }
    }
  } else {
    // 单个参数
    
    // 生成Key/Value
    NSArray *pairComponents = [parametersString componentsSeparatedByString:@"="];
    
    // 只有一个参数，没有值
    if (pairComponents.count == 1) {
      return nil;
    }
    
    // 分隔值
    NSString *key = [pairComponents.firstObject stringByRemovingPercentEncoding];
    NSString *value = [pairComponents.lastObject stringByRemovingPercentEncoding];
    
    // Key不能为nil
    if (key == nil || value == nil) {
      return nil;
    }
    
    // 设置值
    [params setValue:value forKey:key];
  }
  
  return params;
}

@end
