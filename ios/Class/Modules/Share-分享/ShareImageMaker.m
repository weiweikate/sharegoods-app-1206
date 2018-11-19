//
//  ShareImageMaker.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ShareImageMaker.h"
#import <CoreImage/CoreImage.h>
#import <AssetsLibrary/AssetsLibrary.h>

@implementation ShareImageMakerModel

@end
@implementation ShareImageMaker
SINGLETON_FOR_CLASS(ShareImageMaker)
- (void)creatShareImageWithShareImageMakerModel:(ShareImageMakerModel *)model
                                         completion:(ShareImageMakercompletionBlock) completion;
{
  if (model.imageUrlStr == nil) {
    completion(nil, @"商品图片URL（imageUrlStr）不能为nil");
    return;
  }
  if (model.titleStr == nil) {
    completion(nil, @"商品标题（titleStr）不能为nil");
    return;
  }
  if (model.priceStr == nil) {
    completion(nil, @"价钱（priceStr）不能为nil");
    return;
  }
  if (model.QRCodeStr == nil) {
    completion(nil, @"二维码字符（QRCodeStr）不能为nil");
    return;
  }
  __weak ShareImageMaker * weakSelf = self;
  NSString *imgUrl = [model.imageUrlStr  stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:imgUrl] options:YYWebImageOptionShowNetworkActivity progress:^(NSInteger receivedSize, NSInteger expectedSize) {
    
  } transform:nil completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
     dispatch_async(dispatch_get_main_queue(), ^{
    NSString *path = [weakSelf ceratShareImageWithProductImage:image titleStr:model.titleStr priceStr:model.priceStr QRCodeStr:model.QRCodeStr];
    if (path == nil || path.length == 0) {
      completion(nil, @"ShareImageMaker：保存图片到本地失败");
    }else{
       completion(path, nil);
    }
         });
  }];
}

- (NSString* )ceratShareImageWithProductImage:(UIImage *)productImage
                                     titleStr:(NSString *)titleStr
                                     priceStr:(NSString *)priceStr
                                    QRCodeStr:(NSString *)QRCodeStr
{
  
  CGRect rect = CGRectMake(0.0f, 0.0f, 250, 325);
  UIGraphicsBeginImageContext(CGSizeMake(250, 325));
  CGContextRef context = UIGraphicsGetCurrentContext();
  CGContextSetFillColorWithColor(context, [UIColor whiteColor].CGColor);
  CGContextFillRect(context, rect);
  // 绘制图片
  [productImage drawInRect:CGRectMake(0, 0, 250, 250)];
    // 绘制图片
  [titleStr drawInRect:CGRectMake(7.5, 258, 133, 40) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13], NSForegroundColorAttributeName: [UIColor blackColor]}];
    // 绘制图片
  NSMutableAttributedString *priceAttrStr = [[NSMutableAttributedString alloc]initWithString:priceStr attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:16], NSForegroundColorAttributeName: [UIColor redColor]}];
  [priceAttrStr drawAtPoint:CGPointMake(7.5, 300)];
  [priceAttrStr setAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:12]} range:NSMakeRange(0, 1)];
  
  UIImage *QRCodeImage = [self QRCodeWithStr:QRCodeStr];
  [QRCodeImage drawInRect:CGRectMake(180, 265, 55, 55)];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  NSDate * date =[NSDate new];
  return [self save:image withPath:[NSString stringWithFormat:@"/Documents/QRCode%lf.png",date.timeIntervalSince1970]];
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
  
  CIImage *outImage = [filter outputImage];
  
  return [self createNonInterpolatedUIImageFormCIImage:outImage withSize:50];
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

- (void)creatQRCodeImageWithQRCodeStr:(NSString *)QRCodeStr
                        completion:(ShareImageMakercompletionBlock) completion{
  if (QRCodeStr.length == 0 || QRCodeStr == nil) {
    completion(nil,@"生成二维码的字符串不能为空");
    return;
  }
  UIImage *QRCodeImage =  [self QRCodeWithStr:QRCodeStr];
  NSString *path = [self save:QRCodeImage withPath:[NSString stringWithFormat:@"/Documents/InviteFriendsQRCode%lf.png", [NSDate new].timeIntervalSince1970]];
  if (path.length == 0 || path == nil) {
    completion(nil,@"保存二维码失败");
  }else{
    completion(path,nil);
  }
}

- (void)createPromotionShareImageWithQRString:(NSString *)QRString
                                   completion:(ShareImageMakercompletionBlock) completion{
  UIImage *bgImage = [UIImage imageNamed:@"promotionBg"];
  UIImage *QRCodeImage =  [self QRCodeWithStr:QRString];
  
  CGRect rect = CGRectMake(0.0f, 0.0f, 280, 380);
  UIGraphicsBeginImageContext(CGSizeMake(280, 380));
  CGContextRef context = UIGraphicsGetCurrentContext();
//  CGContextSetFillColorWithColor(context, [UIColor redColor].CGColor);
//  CGContextFillRect(context, rect);
  // 绘制图片
  [bgImage drawInRect:CGRectMake(0, 0, 280, 380)];
  // 绘制图片
  [QRCodeImage drawInRect:CGRectMake(70, 180, 140, 140)];
  // 绘制文字
  NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
  paragraphStyle.alignment = NSTextAlignmentCenter;
  [@"长按二维码打开链接" drawInRect:CGRectMake(0, 340, 280, 30) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:12], NSForegroundColorAttributeName: [UIColor whiteColor], NSParagraphStyleAttributeName: paragraphStyle}];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  NSString * path = [self save:image withPath:[NSString stringWithFormat:@"/Documents/promotionShareImage.png"]];
  if (path == nil || path.length == 0) {
    completion(nil, @"ShareImageMaker：保存图片到本地失败");
  }else{
    completion(path, nil);
  }
}

- (void)saveInviteFriendsImage:(NSString*)QRString
 completion:(completionBlock) completion
{
  UIImage *bgImage = [UIImage imageNamed:@"Invite_fiends_bg"];
  UIImage *QRCodeImage =  [self QRCodeWithStr:QRString];
  UIGraphicsBeginImageContext(CGSizeMake(750, 1334));
  [bgImage drawInRect:CGRectMake(0, 0, 750, 1334)];
  // 绘制图片
  [QRCodeImage drawInRect:CGRectMake(225, 620, 310, 310)];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  if(image){
    __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
    [lib writeImageToSavedPhotosAlbum:image.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
      NSLog(@"assetURL = %@, error = %@", assetURL, error);
      lib = nil;
      if (!error) {
        completion(YES);
      }else{
        completion(NO);
      }
    }];
  } else{
     completion(NO);
  }

}
@end
