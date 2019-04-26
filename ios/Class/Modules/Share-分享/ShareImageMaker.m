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
      UIImage * image2 = image;
      if (error) {//如果加载网络图片失败，就用默认图
        image2 = [UIImage imageNamed:@"logo.png"];
      }
      NSString *path = [weakSelf ceratShareImageWithProductImage:image2
                                                           model: model];
      if (path == nil || path.length == 0) {
        completion(nil, @"ShareImageMaker：保存图片到本地失败");
      }else{
        completion(path, nil);
      }
    });
  }];
}

- (NSString* )ceratShareImageWithProductImage:(UIImage *)productImage
                                        model:(ShareImageMakerModel *)model
{
  NSString *imageType = model.imageType;
  NSString *QRCodeStr = model.QRCodeStr;
  CGFloat i = 3;// 为了图片高清 图片尺寸250 * 340
  
  CGFloat imageHeght = 340*i;
  
  NSMutableArray *nodes = [NSMutableArray new];
  
  if ([imageType isEqualToString:@"web"]) {
    //主图图片
    [nodes addObject:@{
                       @"value": productImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 250*i, 340*i)]}
     ];
    //二维码
    UIImage *QRCodeImage = [self QRCodeWithStr:QRCodeStr];
    [nodes addObject:@{@"value": QRCodeImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(195*i, 285*i, 45*i, 45*i)]}
     ];
  }else{
    NSString *titleStr = model.titleStr;
    NSString *priceStr = model.priceStr;
    NSString *retailPrice = model.retailPrice;
    NSString *spellPrice = model.spellPrice;
    priceStr = [NSString stringWithFormat:@"市场价：%@",priceStr];
    if ([model.priceType isEqualToString:@"mr_skill"]) {
      retailPrice = [NSString stringWithFormat:@"秒杀价：%@",retailPrice];
    }else{
      retailPrice = [NSString stringWithFormat:@"V  1  价：%@",retailPrice];
    }
    spellPrice = [NSString stringWithFormat:@"拼店价：%@",spellPrice];
    
    CGFloat sigle =  [self getStringHeightWithText:@"1" fontSize:13*i viewWidth:220*i];
    CGFloat height =  [self getStringHeightWithText:titleStr fontSize:13*i viewWidth:220*i];
    if (height > sigle*2) {
      height= sigle*2+1;
    }
    
    if (height > sigle) {
      imageHeght = 360*i;
    }
    //主图图片
    [nodes addObject:@{
                       @"value": productImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 250*i, 250*i)]}
     ];
  //标题
  NSMutableParagraphStyle *style = [NSMutableParagraphStyle new];
  style.lineBreakMode = NSLineBreakByTruncatingTail;
  NSAttributedString *titleAttrStr = [[NSAttributedString alloc]initWithString:titleStr
                                                                    attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor grayColor]}];
  [nodes addObject:@{
                     @"value": titleAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(15*i, 253*i, 220*i, height)]}
   ];
  
  //价格
  NSMutableAttributedString *priceAttrStr = [[NSMutableAttributedString alloc]initWithString:priceStr
                                                                                  attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:10*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"], NSStrikethroughStyleAttributeName: @1}];
  [priceAttrStr addAttributes:@{ NSStrikethroughStyleAttributeName: @0}
                        range:NSMakeRange(0, 4)];
  [nodes addObject:@{
                     @"value": priceAttrStr,
                     @"location": [NSValue valueWithCGPoint:CGPointMake(15*i, 253*i+height+10*i)]}
   ];
  
  //v1价格
  NSMutableAttributedString *retailPriceAttrStr = [[NSMutableAttributedString alloc]initWithString:retailPrice
                                                                                        attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:10*i], NSForegroundColorAttributeName: [UIColor redColor]}];
  [retailPriceAttrStr addAttributes:@{ NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]}
                              range:NSMakeRange(0, retailPrice.length - model.retailPrice.length)];
  [nodes addObject:@{
                     @"value": retailPriceAttrStr,
                     @"location": [NSValue valueWithCGPoint:CGPointMake(15*i, 253*i+height+10*i + 15*i)]}
   ];
  //拼店d价格
  NSMutableAttributedString *spellPriceAttrStr = [[NSMutableAttributedString alloc]initWithString:spellPrice
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:10*i], NSForegroundColorAttributeName: [UIColor redColor]}];
  [spellPriceAttrStr addAttributes:@{ NSForegroundColorAttributeName:[UIColor colorWithHexString:@"333333"]}
                             range:NSMakeRange(0, 4)];
  [nodes addObject:@{
                     @"value": spellPriceAttrStr,
                     @"location": [NSValue valueWithCGPoint:CGPointMake(15*i, 253*i+height+10*i + 15*i*2)]}
   ];
  //二维码
  UIImage *QRCodeImage = [self QRCodeWithStr:QRCodeStr];
  [nodes addObject:@{@"value": QRCodeImage,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(180*i, 253*i+height+10*i, 48*i, 48*i)]}
   ];
  }
  
  CGRect rect = CGRectMake(0.0f, 0.0f, 250*i, imageHeght);
  UIGraphicsBeginImageContext(CGSizeMake(250*i, imageHeght));
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

- (void)creatQRCodeImageWithQRCodeStr:(NSString *)QRCodeStr
                           completion:(ShareImageMakercompletionBlock) completion{
  if (QRCodeStr.length == 0 || QRCodeStr == nil) {
    completion(nil,@"生成二维码的字符串不能为空");
    return;
  }
  UIImage *QRCodeImage =  [self QRCodeWithStr:QRCodeStr];
  NSString *path = [self save:QRCodeImage withPath:[NSString stringWithFormat:@"/Documents/InviteFriendsQRCode%@.png", QRCodeStr.md5String]];
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
                     logoImage:(NSString*)logoImage
                    completion:(completionBlock) completion
{
  UIImage *bgImage = [UIImage imageNamed:@"Invite_fiends_bg"];
  [self QRCodeWithStr:QRString imageStr:logoImage com:^(UIImage *QRCodeImage) {
    UIGraphicsBeginImageContext(CGSizeMake(750, 1334));
    [bgImage drawInRect:CGRectMake(0, 0, 750, 1334)];
    // 绘制图片
    [QRCodeImage drawInRect:CGRectMake(215 - 40, 805, 400, 400)];
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
  }];
  
}

- (void)saveShopInviteFriendsImage:(NSDictionary*)dic completion:(completionBlock) completion{
  NSString *headerImg = dic[@"headerImg"];
  NSString *shopName = dic[@"shopName"];
  NSString *shopId = dic[@"shopId"];
  NSString *shopPerson = dic[@"shopPerson"];
  NSString *codeString = dic[@"codeString"];
  NSString *wxTip = dic[@"wxTip"];
  //  __weak ShareImageMaker * weakSelf = self;
  NSString *imgUrl = [headerImg stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:imgUrl] options:YYWebImageOptionShowNetworkActivity progress:^(NSInteger receivedSize, NSInteger expectedSize) {} transform:nil completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
    if (image) {
      UIGraphicsBeginImageContext(CGSizeMake(68*2, 68*2));
      CGContextRef ref = UIGraphicsGetCurrentContext();
      CGRect rect = CGRectMake(0, 0, 68*2, 68*2);
      CGContextAddEllipseInRect(ref, rect);
      CGContextClip(ref);
      [image drawInRect:rect];
      UIImage * headerImage = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
      
      UIGraphicsBeginImageContext(CGSizeMake(650, 760));
      UIImage *contentImage = [UIImage imageNamed:@"shop_invite_friends_content"];
      [contentImage drawInRect:CGRectMake(0, 0, 650, 760)];
      //头像
      [headerImage drawInRect:CGRectMake((26+14.5)*2, 31*2, 68*2,68*2)];
      
      CGFloat textLeft = (14.5+105)*2;
      CGFloat textWidth = 180*2;
      CGFloat textHeight = 14*2;
      [shopName drawInRect:CGRectMake(textLeft, 34*2, textWidth, textHeight) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:28], NSForegroundColorAttributeName: [UIColor blackColor]}];
      
      [shopId drawInRect:CGRectMake(textLeft, 34*2 + 16 + 28, textWidth, textHeight) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:26], NSForegroundColorAttributeName: [UIColor blackColor]}];
      
      [shopPerson drawInRect:CGRectMake(textLeft, 34*2 + 16 + 28 + 16 + 26, textWidth, textHeight) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:26], NSForegroundColorAttributeName: [UIColor blackColor]}];
      
      UIImage *QRCodeImage =  [self QRCodeWithStr:codeString];
      [QRCodeImage drawInRect:CGRectMake(189, (130+ 20)*2, 136*2, 136*2)];
      
      [wxTip drawInRect:CGRectMake((650-207*2)/2.0, (130+ 20)*2 + 136*2 + 54, 207*2, textHeight) withAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:26], NSForegroundColorAttributeName: [UIColor colorWithRed:85/255.0 green:85/255.0 blue:85/255.0 alpha:1]}];
      
      UIImage *imageContent = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
      
      UIGraphicsBeginImageContext(CGSizeMake(750, 1334));
      UIImage *bgImage = [UIImage imageNamed:@"shop_invite_friends_bg"];
      [bgImage drawInRect:CGRectMake(0, 0, 750, 1334)];
      [imageContent drawInRect:CGRectMake(50, 171*2, 650, 760)];
      UIImage *imageResult = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
      
      if(imageResult){
        __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
        [lib writeImageToSavedPhotosAlbum:imageResult.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
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
    }else{
      completion(NO);
    }
  }];
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

@end
