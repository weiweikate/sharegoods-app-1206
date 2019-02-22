//
//  XGImageCompression.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/27.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "XGImageCompression.h"
#import "UIImage+Util.h"

@implementation XGImageCompression
+(void)RN_ImageCompressionWithPath:(NSString *)path
                                fileSize:(NSInteger)fileSize
                               limitSize:(NSInteger)limitSize{
  UIImage *srcImage = [UIImage imageWithContentsOfFile:path];
  NSString* newpath = path;                  
  if (!srcImage) {
    srcImage = [UIImage imageWithContentsOfFile:newpath];
  }
  NSData * data = [srcImage compressWithMaxLength:limitSize];
    if(data) {
      NSLog(@"???%ld",[data writeToFile:newpath atomically:YES]);
    }else{
//     NSLog(@"???%ld", [UIImageJPEGRepresentation(thumbnail, 1) writeToFile:path atomically:YES]);
//      [UIImageJPEGRepresentation(thumbnail, 1) writeToFile:path atomically:YES];
    }
  
  NSLog(@"图片保存成功path: %@",path);
}


@end
