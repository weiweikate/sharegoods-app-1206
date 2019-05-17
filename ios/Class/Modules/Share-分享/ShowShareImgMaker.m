//
//  ShowShareImgMaker.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowShareImgMaker.h"
#import <CoreImage/CoreImage.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <Accelerate/Accelerate.h>

@implementation ShowShareImgMakerModel

@end

@implementation ShowShareImgMaker

SINGLETON_FOR_CLASS(ShowShareImgMaker)

- (void)createShareImageWithShareImageMakerModel:(ShowShareImgMakerModel *)model
                                     completion:(ShowImageMakercompletionBlock)completion;
{
  if (model.imageUrlStr == nil) {
    completion(nil,@"商品图片URL（imageUrlStr）不能为nil");
    return;
  }
  if (model.titleStr == nil) {
    completion(nil,@"商品标题（titleStr）不能为nil");
    return;
  }
  if (model.QRCodeStr == nil) {
    completion(nil,@"二维码字符（QRCodeStr）不能为nil");
    return;
  }
  __weak ShowShareImgMaker * weakSelf = self;
  
  [self requestImageWithURLs:@[model.imageUrlStr,model.headerImage] success:^(NSArray *images) {
    NSString *path = [weakSelf ceratShareImageWithProductImage:images[0] headerImage:images[1] model:model];
    
    if (path == nil || path.length == 0) {
      completion(nil, @"ShareImageMaker：保存图片到本地失败");
    }else{
      completion(path, nil);
    }
  }];
}


-(void)requestImageWithURLs:(NSArray*) urls success:(void(^)(NSArray* images))success {
  NSMutableArray * imagArr = [NSMutableArray arrayWithCapacity:urls.count];
  __block NSInteger item =  urls.count;
  for(int i=0;i<urls.count;i++){
    i ==0 ? [imagArr addObject:[UIImage imageNamed:@"logo"]]:[imagArr addObject:[UIImage imageNamed:@"default_avatar"]];
    [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:urls[i]]options:YYWebImageOptionShowNetworkActivity progress:^(NSInteger receivedSize, NSInteger expectedSize) {
      
    } transform:nil completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (!error) {//如果加载网络图片失败，就用默认图
          imagArr[i]= image;
        }
        item -- ;
        if (item<=0) {
          success(imagArr);
        }
      });
    }];
  }
}

- (NSString* )ceratShareImageWithProductImage:(UIImage *)productImage
                                        headerImage:(UIImage *)headerImage
                                        model:(ShowShareImgMakerModel *)model
{
//  NSString *imageType = model.imageType;
  NSString *QRCodeStr = model.QRCodeStr;
  CGFloat i = 3;// 为了图片高清 图片尺寸375 * 667
  
  CGFloat imageHeght = 667*i;
  
    NSMutableArray *nodes = [NSMutableArray new];
    NSString *contentStr = model.titleStr;
    NSString *nameStr = model.userName;
  
    CGFloat sigle =  [self getStringHeightWithText:@"1" fontSize:13*i viewWidth:315*i];
    CGFloat height =  [self getStringHeightWithText:contentStr fontSize:13*i viewWidth:315*i];
    if (height > sigle*2) {
      height= sigle*2+1;
    }
    
    if (height > sigle) {
      imageHeght = 687*i;
    }
    //底图片
    [nodes addObject:@{
                       @"value": [self boxblurImage:productImage withBlurNumber:0.9] ,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
     ];
  
  
  //模糊图片
  UIImage * bgImg = [self imageByApplyingAlpha:0.5 image:[UIImage imageWithColor:[UIColor grayColor]]];

  [nodes addObject:@{
                     @"value": bgImg,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
   ];
  
  //白色背景
  UIImage * whiteBgImg = [UIImage imageWithColor:[UIColor whiteColor]];
  
  [nodes addObject:@{
                     @"value": [self creatRoundImagwwwe:whiteBgImg Radius:0.01 width:(375-30)*i height:472*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(15*i, 42*i, (375-30)*i, 472*i)]}
   ];
  
  //商品
  [nodes addObject:@{
                     @"value": [self creatRoundImagwwwe:productImage Radius:0.02 width:(375-60)*i height:345*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 57*i, (375-60)*i, 345*i)]}
   ];

  //头像
  [nodes addObject:@{
                     @"value": [self creatRoundImagwwwe:headerImage Radius:0.5 width:35*i height:35*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 412*i, 35*i, 35*i)]}
   ];
  
    //昵称
    NSMutableParagraphStyle *style = [NSMutableParagraphStyle new];
    style.lineBreakMode = NSLineBreakByTruncatingTail;
    NSAttributedString *nameAttrStr = [[NSAttributedString alloc]initWithString:nameStr
                                                                      attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:15*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]}];
  
    [nodes addObject:@{
                       @"value": nameAttrStr,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(75*i, 419*i, 220*i, height)]}
     ];
  
  
  //介绍
  NSMutableAttributedString *contentStrAttrStr = [[NSMutableAttributedString alloc]initWithString:contentStr
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]}];
  [contentStrAttrStr appendString:@""];
  
  [nodes addObject:@{
                     @"value": contentStrAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 457*i, 315*i, height*2)]}
   ];
  
//    //二维码
    UIImage *QRCodeImage = [self QRCodeWithStr:QRCodeStr];
    [nodes addObject:@{@"value": QRCodeImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(148*i, 544*i, 80*i, 80*i)]}
     ];
  
  
  //介绍
  NSMutableAttributedString *logpStrAttrStr = [[NSMutableAttributedString alloc]initWithString:@"秀一秀  赚到够"
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FFFFFF"]}];
  
  [nodes addObject:@{
                     @"value": logpStrAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 634*i, 80*i, height*1)]}
   ];
  
  CGRect rect = CGRectMake(0.0f, 0.0f, 375*i, imageHeght);
  UIGraphicsBeginImageContext(CGSizeMake(375*i, imageHeght));
  CGContextRef context = UIGraphicsGetCurrentContext();
  CGContextSetFillColorWithColor(context, [UIColor whiteColor].CGColor);
  CGContextFillRect(context, rect);
  
  for (int i = 0 ; i < nodes.count; i++) {
    NSDictionary *node = nodes[i];
    NSValue *location = node[@"location"];
    NSString * locationType = node[@"locationType"];
    id str = node[@"value"];
    if (locationType && [locationType isEqualToString:@"rect"]) {
      if ([str respondsToSelector:NSSelectorFromString(@"drawInRect:")]) {
        [str drawInRect:[location CGRectValue]];
      }
    }else{
      if ([str respondsToSelector:NSSelectorFromString(@"drawAtPoint:")]) {
        [str drawAtPoint:[location CGPointValue]];
      }
    }
    
  }
  
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return [self save:image withPath:[NSString stringWithFormat:@"/Documents/QRCode%@.png",[model modelToJSONString].md5String]];
}


/**
 保存图片到本地，并返回路径
 */
- (NSString *)save:(UIImage *)imgsave withPath:(NSString *)subPath{
  NSString * path =NSHomeDirectory();
  NSString * Pathimg =[path stringByAppendingString:subPath];
  if ([UIImagePNGRepresentation(imgsave) writeToFile:Pathimg atomically:YES] == YES) {
    return Pathimg;
  }
  return @"";
}

/**
 绘制二维码
 */
- (UIImage *)QRCodeWithStr:(NSString *)str{
  CIFilter *filter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
  [filter setDefaults];
  //存放的信息
  NSString *info = str;
  //把信息转化为NSData
  NSData *infoData = [info dataUsingEncoding:NSUTF8StringEncoding];
  //滤镜对象kvc存值
  [filter setValue:infoData forKeyPath:@"inputMessage"];
  [filter setValue:@"H" forKey:@"inputCorrectionLevel"];
  CIImage *outImage = [filter outputImage];
  
  return [self createNonInterpolatedUIImageFormCIImage:outImage withSize:360];
}

- (void)QRCodeWithStr:(NSString *)str imageStr:(NSString *)logoStr com:(void(^)(UIImage * image))com{
  CIFilter *filter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
  [filter setDefaults];
  //存放的信息
  NSString *info = str;
  //把信息转化为NSData
  NSData *infoData = [info dataUsingEncoding:NSUTF8StringEncoding];
  //滤镜对象kvc存值
  [filter setValue:infoData forKeyPath:@"inputMessage"];
  [filter setValue:@"H" forKey:@"inputCorrectionLevel"];
  CIImage *outImage = [filter outputImage];
  
  UIImage * qrImage = [self createNonInterpolatedUIImageFormCIImage:outImage withSize:360];
  if ([logoStr hasPrefix:@"http"]) {
    [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:logoStr] options:YYWebImageOptionShowNetworkActivity progress:^(NSInteger receivedSize, NSInteger expectedSize) {
      
    } transform:nil completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (image) {
          [self QRCode:qrImage image:image com:com];
        }else{
          [self QRCode:qrImage image:[UIImage imageNamed:@"logo.png"] com:com];
        }
      });
    }];
  }else{
    if (logoStr == nil || logoStr.length == 0) {
      logoStr=@"logo.png";
    }
    [self QRCode:qrImage image:[UIImage imageNamed:logoStr] com:com];
  }
}

- (void)QRCode:(UIImage *)str image:(UIImage *)image com:(void(^)(UIImage * image))com{
  CGRect rect = CGRectMake(0.0f, 0.0f, 360 , 350);
  UIGraphicsBeginImageContext(CGSizeMake(360, 360));
  [str drawInRect:rect];
  image = [self creatRoundImagwwwe: image];
  [image drawInRect:CGRectMake(140, 140, 80, 80)];
  UIImage *image2 = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  com(image2);
}

/**
 处理绘制的二维码模糊的问题
 */
- (UIImage *)createNonInterpolatedUIImageFormCIImage:(CIImage *)image withSize:(CGFloat) size
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

-(CGFloat)getStringHeightWithText:(NSString *)text fontSize:(CGFloat)fontSize viewWidth:(CGFloat)width
{
  // 设置文字属性 要和label的一致
  NSDictionary *attrs = @{NSFontAttributeName : [UIFont systemFontOfSize:fontSize]};
  CGSize maxSize = CGSizeMake(width, MAXFLOAT);
  
  NSStringDrawingOptions options = NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading;
  
  // 计算文字占据的高度
  CGSize size = [text boundingRectWithSize:maxSize options:options attributes:attrs context:nil].size;
  
  //    当你是把获得的高度来布局控件的View的高度的时候.size转化为ceilf(size.height)。
  return  ceilf(size.height);
}

-(UIImage *)creatRoundImagwwwe:(UIImage *)image{
  CGRect rect = CGRectMake(0.0f, 0.0f, 60 , 60);
  UIGraphicsBeginImageContext(CGSizeMake(60, 60));
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  CGContextAddEllipseInRect(ctx, rect);
  CGContextClip(ctx);
  [image drawInRect:rect];
  UIImage *image2 = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return image2;
}


-(UIImage *)creatRoundImagwwwe:(UIImage *)image Radius:(CGFloat)radius width:(CGFloat)width height:(CGFloat)height{
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
  [image drawInRect:rect];
  // 从上下文上获取剪裁后的照片
  UIImage *image2 = UIGraphicsGetImageFromCurrentImageContext();
  // 关闭上下文
  UIGraphicsEndImageContext();
  return image2;
}


/**
 *  设置图片透明度
 * @param alpha 透明度
 * @param image 图片
 */

-(UIImage *)imageByApplyingAlpha:(CGFloat )alpha  image:(UIImage*)image
{
  UIGraphicsBeginImageContextWithOptions(image.size, NO, 0.0f);
  
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  
  CGRect area = CGRectMake(0, 0, image.size.width, image.size.height);
  
  CGContextScaleCTM(ctx, 1, -1);
  
  CGContextTranslateCTM(ctx, 0, -area.size.height);

  CGContextSetBlendMode(ctx, kCGBlendModeMultiply);
  
  CGContextSetAlpha(ctx, alpha);
  
  CGContextDrawImage(ctx, area, image.CGImage);
  UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
  
  UIGraphicsEndImageContext();

  return newImage;
}

  //高斯模糊
-(UIImage *)boxblurImage:(UIImage *)image withBlurNumber:(CGFloat)blur {
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

@end

