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
#import "NSString+UrlAddParams.h"
#import "UIImage+Util.h"
#import "ShowShareImgMaker.h"
@implementation ShareImageMakerModel

@end
@implementation ShareImageMaker
SINGLETON_FOR_CLASS(ShareImageMaker)
- (void)creatShareImageWithShareImageMakerModel:(ShareImageMakerModel *)model
                                     completion:(ShareImageMakercompletionBlock) completion{
  if(![self checkLegalWithShareImageMakerModel:model completion:completion]){
    return;
  }
  NSString *imageType = model.imageType;
  NSArray * URLs = @[];
  NSArray * defaultImages = @[];
  __weak ShareImageMaker * weakSelf = self;
  
  if ([imageType isEqualToString:@"show"]||[imageType isEqualToString:@"webActivity"]) {
    URLs = @[model.imageUrlStr,model.headerImage];
    defaultImages = @[[UIImage imageNamed:@"logo.png"], [UIImage imageNamed:@"default_avatar.png"]];
  }else if ([imageType isEqualToString:@"web"]){
    URLs = @[model.imageUrlStr];
    defaultImages = @[[UIImage imageNamed:@"logo.png"]];
  } else{//web or  produce or nil
    URLs = @[model.imageUrlStr];
    defaultImages = @[[UIImage imageNamed:@"logo.png"]];
  }
  [self requestImageWithURLs:URLs defaultImage:defaultImages success:^(NSArray *images) {
    dispatch_async(dispatch_get_main_queue(), ^{
     
      NSString *path = [weakSelf ceratShareImageWithImages:images
                                                           model: model];
      if (path == nil || path.length == 0) {
        completion(nil, @"ShareImageMaker：保存图片到本地失败");
      }else{
        completion(path, nil);
      }
    });
  }];
}

-(BOOL)checkLegalWithShareImageMakerModel:(ShareImageMakerModel *)model
                               completion:(ShareImageMakercompletionBlock) completion{
   NSString *imageType = model.imageType;
  if ([imageType isEqualToString:@"show"]) {
   return [ShowShareImgMaker checkLegalWithShareImageMakerModel:model completion:completion];
  }
  
  if ([imageType isEqualToString:@"web"]) {
    if (model.imageUrlStr == nil) {
      completion(nil, @"图片URL（imageUrlStr）不能为nil");
      return NO;
    }
    if (model.QRCodeStr == nil) {
      completion(nil, @"二维码字符（QRCodeStr）不能为nil");
      return NO;
    }
    return YES;
  }
  
  if ([imageType isEqualToString:@"webActivity"]) {
    if (model.imageUrlStr == nil) {
      completion(nil, @"图片URL（imageUrlStr）不能为nil");
      return NO;
    }
    if (model.QRCodeStr == nil) {
      completion(nil, @"二维码字符（QRCodeStr）不能为nil");
      return NO;
    }
    return YES;
  }
  
  if (model.imageUrlStr == nil) {
    completion(nil, @"商品图片URL（imageUrlStr）不能为nil");
    return NO;
  }
  if (model.titleStr == nil) {
    completion(nil, @"商品标题（titleStr）不能为nil");
    return NO;
  }
  if (model.priceStr == nil) {
    completion(nil, @"价钱（priceStr）不能为nil");
    return NO;
  }
  if (model.QRCodeStr == nil) {
    completion(nil, @"二维码字符（QRCodeStr）不能为nil");
    return NO;
  }
  return YES;
  
}

- (NSString* )ceratShareImageWithImages:(NSArray *)images
                                        model:(ShareImageMakerModel *)model
{
  NSString *imageType = model.imageType;
  NSString *QRCodeStr = model.QRCodeStr ;
  
  CGFloat i = 3;// 为了图片高清 图片尺寸250 * 340
  
  CGFloat imageHeght = 667*i;
  CGFloat imageWidth =  375*i;
  
  NSMutableArray *nodes = [NSMutableArray new];
  
  if ([imageType isEqualToString:@"webActivity"]) {
    NSDictionary * dataDic = [ShowShareImgMaker getParamsWithWEBImages:images
                                                              model:model];
    nodes = dataDic[@"nodes"];
    NSNumber* height = dataDic[@"height"];
    imageHeght = height.floatValue;
    NSNumber* width = dataDic[@"width"];
    imageWidth = width.floatValue;
    
  }else if([imageType isEqualToString:@"web"]){
    imageHeght = 340*i;
    imageWidth =  250*i;
    //主图图片
    [nodes addObject:@{
                       @"value": images[0],
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 250*i, 340*i)]}
     ];
    //二维码
    UIImage *QRCodeImage = [UIImage QRCodeWithStr:QRCodeStr];
    [nodes addObject:@{@"value": QRCodeImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(195*i, 285*i, 45*i, 45*i)]}
     ];
    
  } else if ([imageType isEqualToString:@"show"]){
   NSDictionary * dataDic = [ShowShareImgMaker getParamsWithImages:images
                                     model:model];
    nodes = dataDic[@"nodes"];
    NSNumber* height = dataDic[@"height"];
    imageHeght = height.floatValue;
    NSNumber* width = dataDic[@"width"];
    imageWidth = width.floatValue;

  }else{
    NSString *titleStr = model.titleStr;
    NSString *priceStr = model.priceStr;
    NSString *retailPrice = model.retailPrice;
    NSString *retailString = @"";
    NSString *shareMoneyPrice = [NSString stringWithFormat:@"立省%@元起",model.shareMoney?model.shareMoney:@"xx"];

    priceStr = [NSString stringWithFormat:@"市场价：%@",priceStr];
    if ([model.priceType isEqualToString:@"mr_skill"]) {
      retailPrice = [NSString stringWithFormat:@"%@",retailPrice];
      retailString = [NSString stringWithFormat:@"秒杀价"];
    }else{
      retailPrice = [NSString stringWithFormat:@"%@",retailPrice];
      retailString = [NSString stringWithFormat:@"零售价"];
    }

    CGFloat sigle =  [@"1" getStringHeightWithfontSize:18*i viewWidth:315*i];
    CGFloat height =  [titleStr getStringHeightWithfontSize:18*i viewWidth:315*i];
    if (height > sigle*2) {
      height= sigle*2+1;
    }

    if (height > sigle) {
      imageHeght = 687*i;
    }

    //logo
    UIImage * logo = [UIImage imageNamed:@"logoShare.png"];
    [nodes addObject:@{
                       @"value": logo,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(104*i, 46*i, 37*i, 37*i)]}
     ];

    //标语
    NSMutableAttributedString *logoTitle = [[NSMutableAttributedString alloc]initWithString:@"秀一秀 赚到够"
                                                                                    attributes:@{NSFontAttributeName:[UIFont boldSystemFontOfSize:18*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FF0050"]}];
    [nodes addObject:@{
                       @"value": logoTitle,
                       @"location": [NSValue valueWithCGPoint:CGPointMake(152*i, 55*i)]}
     ];



    //主图图片[images[0] creatRoundImagWithRadius:0.02 width:(375-60)*i height:410*i]
    [nodes addObject:@{
                       @"value": [images[0] creatRoundImagWithRadius:0.02 width:339*i height:339*i],
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(18*i, 100*i, 339*i, 339*i)]}
     ];
  //标题
  NSMutableParagraphStyle *style = [NSMutableParagraphStyle new];
  style.lineBreakMode = NSLineBreakByTruncatingTail;
  NSAttributedString *titleAttrStr = [[NSAttributedString alloc]initWithString:titleStr
                                                                    attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:18*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]}];
  [nodes addObject:@{
                     @"value": titleAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(18*i, 460*i, 340*i, height)]}
   ];

    //拼店价格()
    NSMutableAttributedString *retailPriceAttrStr = [[NSMutableAttributedString alloc]initWithString:retailPrice
                                                                                         attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:22*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"#FF0050"]}];
//    [spellPriceAttrStr addAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i]}
//                               range:NSMakeRange(0, 1)];
//    [spellPriceAttrStr addAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i]}
//                               range:NSMakeRange(spellPrice.length-2, 2)];
    [nodes addObject:@{
                       @"value": retailPriceAttrStr,
                       @"location": [NSValue valueWithCGPoint:CGPointMake(18*i, 460*i+height+13*i)]}
     ];

    CGFloat spellPriceWidth = [retailPrice getWidthStringfontSize:22 viewWidth:200];

    //拼店文字

    NSMutableAttributedString *pindian = [[NSMutableAttributedString alloc]initWithString:[NSString stringWithFormat:@" %@ ",retailString]
                                                                                         attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i],
                                                                                          NSBackgroundColorAttributeName:[UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:0.1],
                                                                                                  NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FF0050"]}];
    [nodes addObject:@{
                       @"value": pindian,
                       @"location": [NSValue valueWithCGPoint:CGPointMake((spellPriceWidth+38)*i, 460*i+height+19*i)]}
     ];

    //价格
    NSMutableAttributedString *priceAttrStr = [[NSMutableAttributedString alloc]initWithString:priceStr
                                                                                    attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"], NSStrikethroughStyleAttributeName: @1}];

    [nodes addObject:@{
                       @"value": priceAttrStr,
                       @"location": [NSValue valueWithCGPoint:CGPointMake(18*i, 460*i+height+18*i*2+9*i)]}
     ];

  //二维码
  UIImage *QRCodeImage = [UIImage QRCodeWithStr:QRCodeStr];
  [nodes addObject:@{@"value": QRCodeImage,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(268*i, 457*i+height+13*i, 77*i, 77*i)]}
   ];

    //扫码购 扫码购
    CGFloat tempStrwidth = [@"扫码购" getWidthStringfontSize:13 viewWidth:150];
    NSMutableAttributedString * tempStrAttrStr = [[NSMutableAttributedString alloc]initWithString:@"扫码购"
                                                                                         attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i],
                                                                                                      NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FF0050"],}];
    
    [nodes addObject:@{
                       @"value": tempStrAttrStr,
                       @"location": [NSValue valueWithCGPoint:CGPointMake(268*i+38*i-(tempStrwidth*i)/2, 457*i+height+13*i+80*i)]}
     ];

    CGFloat shareMoneywidth = [shareMoneyPrice getWidthStringfontSize:13 viewWidth:150];
    NSMutableAttributedString *shareMoneyAttrStr = [[NSMutableAttributedString alloc]initWithString:shareMoneyPrice
                                                                                          attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i],
                                                                              NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FF0050"],}];

    [nodes addObject:@{
                       @"value": shareMoneyAttrStr,
                       @"location": [NSValue valueWithCGPoint:CGPointMake(268*i+38*i-(shareMoneywidth*i)/2, 457*i+height+13*i*2+88*i)]}
     ];

  }

  CGRect rect = CGRectMake(0.0f, 0.0f, imageWidth, imageHeght);
  UIGraphicsBeginImageContext(CGSizeMake(imageWidth, imageHeght));
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



- (void)QRCodeWithStr:(NSString *)str imageStr:(NSString *)logoStr com:(void(^)(UIImage * image))com{
  
  UIImage * qrImage = [UIImage QRCodeWithStr:str];
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
#pragma mark-推广相关-目前废弃
- (void)createPromotionShareImageWithQRString:(NSString *)QRString
                                   completion:(ShareImageMakercompletionBlock) completion{
  UIImage *bgImage = [UIImage imageNamed:@"promotionBg"];
  UIImage *QRCodeImage =  [UIImage QRCodeWithStr:QRString];
  
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

#pragma mark- 邀请好友相关
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
      
      UIImage *QRCodeImage =  [UIImage QRCodeWithStr:codeString];
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

#pragma mark-二维码和商品绘制图形
-(void)creatQRCodeImageAndProductModel:(ShareImageMakerModel *)model completion:(ShareImageMakercompletionBlock)completion{
  
  if (model.imageUrlStr == nil) {
    completion(nil, @"图片URL（imageUrlStr）不能为nil");
    return;
  }
  if (model.QRCodeStr == nil) {
    completion(nil, @"二维码字符（QRCodeStr）不能为nil");
    return;
  }
  
  NSArray * URLs = @[];
  NSArray * defaultImages = @[];
    URLs = @[model.imageUrlStr];
    defaultImages = @[[UIImage imageNamed:@"logo.png"]];
  [self requestImageWithURLs:URLs defaultImage:defaultImages success:^(NSArray *images) {
    dispatch_async(dispatch_get_main_queue(), ^{
      
      NSString *path = [ShowShareImgMaker getShowProductImageModelImages:images model:model];
      if (path == nil || path.length == 0) {
        completion(nil, @"ShareImageMaker：保存图片到本地失败");
      }else{
        completion(path, nil);
      }
    });
  }];
}

#pragma mark-公用部分
- (void)QRCode:(UIImage *)str image:(UIImage *)image com:(void(^)(UIImage * image))com{
  CGRect rect = CGRectMake(0.0f, 0.0f, 360 , 350);
  UIGraphicsBeginImageContext(CGSizeMake(360, 360));
  [str drawInRect:rect];
  image = [image creatRoundImagWithRadius:1 width:60 height:60];
  [image drawInRect:CGRectMake(140, 140, 80, 80)];
  UIImage *image2 = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  com(image2);
}

//生产二维码，并返回路径，通用
- (void)creatQRCodeImageWithQRCodeStr:(NSString *)QRCodeStr
                           completion:(ShareImageMakercompletionBlock) completion{
  if (QRCodeStr.length == 0 || QRCodeStr == nil) {
    completion(nil,@"生成二维码的字符串不能为空");
    return;
  }
  UIImage *QRCodeImage =  [UIImage QRCodeWithStr:QRCodeStr];
  NSString *path = [self save:QRCodeImage withPath:[NSString stringWithFormat:@"/Documents/InviteFriendsQRCode%@.png", QRCodeStr.md5String]];
  if (path.length == 0 || path == nil) {
    completion(nil,@"保存二维码失败");
  }else{
    completion(path,nil);
  }
}


-(void)requestImageWithURLs:(NSArray*) urls defaultImage:(NSArray *)defaultImages success:(void(^)(NSArray* images))success {
  NSAssert(urls.count == defaultImages.count, @"数量要一样多少");
  NSMutableArray * imagArr = [defaultImages mutableCopy];
  __block NSInteger item =  urls.count;
  for(int i=0;i<urls.count;i++){
    NSString *imgUrl =[urls[i]  stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    [[YYWebImageManager sharedManager] requestImageWithURL:[NSURL URLWithString:imgUrl]options:YYWebImageOptionShowNetworkActivity progress:^(NSInteger receivedSize, NSInteger expectedSize) {
      
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
@end
