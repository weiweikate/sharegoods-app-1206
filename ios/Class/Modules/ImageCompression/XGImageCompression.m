//
//  XGImageCompression.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/27.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "XGImageCompression.h"

@implementation XGImageCompression
+(void)RN_ImageCompressionWithPath:(NSString *)path
                                fileSize:(NSInteger)fileSize
                               limitSize:(NSInteger)limitSize{
  UIImage *srcImage = [UIImage imageWithContentsOfFile:path];
  NSString* newpath = path;                  
  if (!srcImage) {
    srcImage = [UIImage imageWithContentsOfFile:newpath];
  }
  if (path.length > 0 && fileSize > limitSize && srcImage)  {
    CGFloat imageScale = limitSize / (fileSize*1.0);
    CGSize imageSize = CGSizeMake(srcImage.size.width * imageScale, srcImage.size.height * imageScale);
    UIGraphicsBeginImageContext(imageSize);
    CGRect imageRect = CGRectMake(0.0, 0.0, imageSize.width, imageSize.height);
    [srcImage drawInRect:imageRect];
    UIImage* thumbnail = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData * data = UIImagePNGRepresentation(thumbnail);
    if (data) {
      NSLog(@"???%ld",[data writeToFile:newpath atomically:YES]);
    }else{
      NSLog(@"???%ld", [UIImageJPEGRepresentation(thumbnail, 1) writeToFile:path atomically:YES]);
//      [UIImageJPEGRepresentation(thumbnail, 1) writeToFile:path atomically:YES];
    }
  }
  NSLog(@"图片保存成功path: %@",[path substringFromIndex:7]);
}
@end
