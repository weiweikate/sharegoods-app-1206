//
//  UIImage+Util.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/11/10.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UIImage+Util.h"
#import <CoreImage/CoreImage.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <Accelerate/Accelerate.h>
#import "NSString+UrlAddParams.h"


@implementation UIImage (Util)
+ (UIImage *)getLaunchImage{
  
  CGSize viewSize = [UIScreen mainScreen].bounds.size;
  NSString *viewOr = @"Portrait";//垂直
  NSString *launchImage = nil;
  NSArray *launchImages =  [[[NSBundle mainBundle] infoDictionary] valueForKey:@"UILaunchImages"];
  
  for (NSDictionary *dict in launchImages) {
    CGSize imageSize = CGSizeFromString(dict[@"UILaunchImageSize"]);
    
    if (CGSizeEqualToSize(viewSize, imageSize) && [viewOr isEqualToString:dict[@"UILaunchImageOrientation"]]) {
      launchImage = dict[@"UILaunchImageName"];
    }
  }
  return [UIImage imageNamed:launchImage];
}

-(NSData *)compressWithMaxLength:(NSUInteger)maxLength{
  // Compress by quality
  CGFloat compression = 1;
  NSData *data = UIImageJPEGRepresentation(self, compression);
  //NSLog(@"Before compressing quality, image size = %ld KB",data.length/1024);
  if (data.length < maxLength) return data;
  
  CGFloat max = 1;
  CGFloat min = 0;
  for (int i = 0; i < 6; ++i) {
    compression = (max + min) / 2;
    data = UIImageJPEGRepresentation(self, compression);
    //NSLog(@"Compression = %.1f", compression);
    //NSLog(@"In compressing quality loop, image size = %ld KB", data.length / 1024);
    if (data.length < maxLength * 0.9) {
      min = compression;
    } else if (data.length > maxLength) {
      max = compression;
    } else {
      break;
    }
  }
  //NSLog(@"After compressing quality, image size = %ld KB", data.length / 1024);
  if (data.length < maxLength) return data;
  UIImage *resultImage = [UIImage imageWithData:data];
  // Compress by size
  NSUInteger lastDataLength = 0;
  while (data.length > maxLength && data.length != lastDataLength) {
    lastDataLength = data.length;
    CGFloat ratio = (CGFloat)maxLength / data.length;
    //NSLog(@"Ratio = %.1f", ratio);
    CGSize size = CGSizeMake((NSUInteger)(resultImage.size.width * sqrtf(ratio)),
                             (NSUInteger)(resultImage.size.height * sqrtf(ratio))); // Use NSUInteger to prevent white blank
    UIGraphicsBeginImageContext(size);
    [resultImage drawInRect:CGRectMake(0, 0, size.width, size.height)];
    resultImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    data = UIImageJPEGRepresentation(resultImage, compression);
    //NSLog(@"In compressing size loop, image size = %ld KB", data.length / 1024);
  }
  //NSLog(@"After compressing size loop, image size = %ld KB", data.length / 1024);
  return data;
}

-(UIImage *)creatRoundImagWithRadius:(CGFloat)radius width:(CGFloat)width height:(CGFloat)height{
  // 开始图形上下文
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(width, height), NO, 0.0);
  // 获得图形上下文
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  // 根据radius的值画出路线
  // 设置一个范围
  CGRect rect = CGRectMake(0.0f, 0.0f,width, height);
  // 根据radius的值画出路线
  CGContextAddPath(ctx, [UIBezierPath bezierPathWithRoundedRect:rect cornerRadius:radius*height].CGPath);
  
  // 裁剪
  CGContextClip(ctx);
  // 将原照片画到图形上下文
  [self drawInRect:rect];
  // 从上下文上获取剪裁后的照片
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  // 关闭上下文
  UIGraphicsEndImageContext();
  return image;
}

/**
 *  设置图片透明度
 * @param alpha 透明度
 * @param image 图片
 */

-(UIImage *)imageByApplyingAlpha:(CGFloat )alpha
{
  UIGraphicsBeginImageContextWithOptions(self.size, NO, 0.0f);
  
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  
  CGRect area = CGRectMake(0, 0, self.size.width, self.size.height);
  
  CGContextScaleCTM(ctx, 1, -1);
  
  CGContextTranslateCTM(ctx, 0, -area.size.height);
  
  CGContextSetBlendMode(ctx, kCGBlendModeMultiply);
  
  CGContextSetAlpha(ctx, alpha);
  
  CGContextDrawImage(ctx, area, self.CGImage);
  UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
  
  UIGraphicsEndImageContext();
  
  return newImage;
}


//高斯模糊
-(UIImage *)boxblurWithBlurNumber:(CGFloat)blur {
  UIImage *image = self;
  if(image==nil){
    return nil;
  }
  int boxSize = blur;
  if (blur<1||blur>100) {
    boxSize=25;
  }
  boxSize = boxSize - (boxSize % 2) + 1;
  
  CGImageRef img = image.CGImage;
  
  vImage_Buffer inBuffer, outBuffer, rgbOutBuffer;
  vImage_Error error;
  
  void *pixelBuffer, *convertBuffer;
  
  CGDataProviderRef inProvider = CGImageGetDataProvider(img);
  CFDataRef inBitmapData = CGDataProviderCopyData(inProvider);
  
  convertBuffer = malloc( CGImageGetBytesPerRow(img) * CGImageGetHeight(img) );
  rgbOutBuffer.width = CGImageGetWidth(img);
  rgbOutBuffer.height = CGImageGetHeight(img);
  rgbOutBuffer.rowBytes = CGImageGetBytesPerRow(img);
  rgbOutBuffer.data = convertBuffer;
  
  inBuffer.width = CGImageGetWidth(img);
  inBuffer.height = CGImageGetHeight(img);
  inBuffer.rowBytes = CGImageGetBytesPerRow(img);
  inBuffer.data = (void *)CFDataGetBytePtr(inBitmapData);
  
  pixelBuffer = malloc( CGImageGetBytesPerRow(img) * CGImageGetHeight(img) );
  
  if (pixelBuffer == NULL) {
    NSLog(@"No pixelbuffer");
  }
  
  outBuffer.data = pixelBuffer;
  outBuffer.width = CGImageGetWidth(img);
  outBuffer.height = CGImageGetHeight(img);
  outBuffer.rowBytes = CGImageGetBytesPerRow(img);
  
  void *rgbConvertBuffer = malloc( CGImageGetBytesPerRow(img) * CGImageGetHeight(img) );
  vImage_Buffer outRGBBuffer;
  outRGBBuffer.width = CGImageGetWidth(img);
  outRGBBuffer.height = CGImageGetHeight(img);
  outRGBBuffer.rowBytes = CGImageGetBytesPerRow(img);//3
  outRGBBuffer.data = rgbConvertBuffer;
  
  error = vImageBoxConvolve_ARGB8888(&inBuffer, &outBuffer, NULL, 0, 0, boxSize, boxSize, NULL, kvImageEdgeExtend);
  //    error = vImageBoxConvolve_ARGB8888(&inBuffer, &outBuffer, NULL, 0, 0, boxSize, boxSize, NULL, kvImageEdgeExtend);
  
  if (error) {
    NSLog(@"error from convolution %ld", error);
  }
  const uint8_t mask[] = {2, 1, 0, 3};
  
  vImagePermuteChannels_ARGB8888(&outBuffer, &rgbOutBuffer, mask, kvImageNoFlags);
  
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef ctx = CGBitmapContextCreate(rgbOutBuffer.data,
                                           rgbOutBuffer.width,
                                           rgbOutBuffer.height,
                                           8,
                                           rgbOutBuffer.rowBytes,
                                           colorSpace,
                                           kCGImageAlphaNoneSkipLast);
  CGImageRef imageRef = CGBitmapContextCreateImage(ctx);
  UIImage *returnImage = [UIImage imageWithCGImage:imageRef];
  
  //clean up
  CGContextRelease(ctx);
  
  free(pixelBuffer);
  free(convertBuffer);
  free(rgbConvertBuffer);
  CFRelease(inBitmapData);
  
  CGColorSpaceRelease(colorSpace);
  CGImageRelease(imageRef);
  
  return returnImage;
  
}

/**
 绘制二维码
 */
+ (UIImage *)QRCodeWithStr:(NSString *)str{
  CIFilter *filter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
  [filter setDefaults];
  //存放的信息
  NSString *info = [str urlAddCompnentForValue:@"7" key:@"pageSource"];
  //把信息转化为NSData
  NSData *infoData = [info dataUsingEncoding:NSUTF8StringEncoding];
  //滤镜对象kvc存值
  [filter setValue:infoData forKeyPath:@"inputMessage"];
  [filter setValue:@"H" forKey:@"inputCorrectionLevel"];
  CIImage *outImage = [filter outputImage];
  
  return [self createNonInterpolatedUIImageFormCIImage:outImage withSize:360];
}

/**
 处理绘制的二维码模糊的问题
 */
+ (UIImage *)createNonInterpolatedUIImageFormCIImage:(CIImage *)image withSize:(CGFloat) size
{
  CGRect extent = CGRectIntegral(image.extent);
  CGFloat scale = MIN(size/CGRectGetWidth(extent), size/CGRectGetHeight(extent));
  
  //1.创建bitmap;
  size_t width = CGRectGetWidth(extent) * scale;
  size_t height = CGRectGetHeight(extent) * scale;
  CGColorSpaceRef cs = CGColorSpaceCreateDeviceGray();
  CGContextRef bitmapRef = CGBitmapContextCreate(nil, width, height, 8, 0, cs, (CGBitmapInfo)kCGImageAlphaNone);
  CIContext *context = [CIContext contextWithOptions:nil];
  CGImageRef bitmapImage = [context createCGImage:image fromRect:extent];
  CGContextSetInterpolationQuality(bitmapRef, kCGInterpolationNone);
  CGContextScaleCTM(bitmapRef, scale, scale);
  CGContextDrawImage(bitmapRef, extent, bitmapImage);
  
  //2.保存bitmap到图片
  CGImageRef scaledImage = CGBitmapContextCreateImage(bitmapRef);
  CGContextRelease(bitmapRef);
  CGImageRelease(bitmapImage);
  return [UIImage imageWithCGImage:scaledImage];
}



@end
