//
//  ShowShareImgMaker.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowShareImgMaker.h"
#import "UIImage+Util.h"
#import "NSString+UrlAddParams.h"

@implementation ShowShareImgMaker

+(BOOL)checkLegalWithShareImageMakerModel:(ShareImageMakerModel *)model
                                     completion:(ShareImageMakercompletionBlock)completion
{
  if (model.imageUrlStr == nil) {
    completion(nil,@"商品图片URL（imageUrlStr）不能为nil");
    return NO;
  }
  if (model.titleStr == nil) {
    completion(nil,@"商品标题（titleStr）不能为nil");
    return NO;
  }
  if (model.QRCodeStr == nil) {
    completion(nil,@"二维码字符（QRCodeStr）不能为nil");
    return NO;
  }
  if (model.userName == nil) {
    model.userName = @"";
  }
  if (model.headerImage == nil) {
    model.headerImage = @"";
  }
   return YES;
}



+ (NSDictionary *)getParamsWithImages:(NSArray<UIImage *> *)images
                                        model:(ShareImageMakerModel *)model
{
//  NSString *imageType = model.imageType;
  NSString *QRCodeStr = model.QRCodeStr;
  CGFloat i = 3;// 为了图片高清 图片尺寸375 * 667

  CGFloat imageHeght = 667*i;

    NSMutableArray *nodes = [NSMutableArray new];
    NSString *contentStr = model.titleStr;
    NSString *nameStr = model.userName;

    CGFloat sigle =  [@"1" getStringHeightWithfontSize:13*i viewWidth:315*i];
    CGFloat height =  [contentStr getStringHeightWithfontSize:13*i viewWidth:315*i];
    if (height > sigle*2) {
      height= sigle*2+1;
    }

    if (height > sigle) {
      imageHeght = 687*i;
    }
    //底图片
    [nodes addObject:@{
                       @"value": [images[0] boxblurWithBlurNumber:0.9] ,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
     ];


  //模糊图片
  UIImage * bgImg = [UIImage imageWithColor:[[UIColor grayColor] colorWithAlphaComponent:0.5]];

  [nodes addObject:@{
                     @"value": bgImg,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
   ];

  //白色背景
  UIImage * whiteBgImg = [UIImage imageWithColor:[UIColor whiteColor]];

  [nodes addObject:@{
                     @"value": [whiteBgImg  creatRoundImagWithRadius:0.01 width:(375-30)*i height:472*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(15*i, 42*i, (375-30)*i, 472*i)]}
   ];

  //商品
  [nodes addObject:@{
                     @"value": [images[0] creatRoundImagWithRadius:0.02 width:(375-60)*i height:345*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 57*i, (375-60)*i, 345*i)]}
   ];

  //头像
  [nodes addObject:@{
                     @"value": [images[1] creatRoundImagWithRadius:0.5 width:35*i height:35*i],
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
  NSArray * contentArr = [contentStr getLinesArrayWithfont:[UIFont systemFontOfSize:13*i] andLableWidth:315*i];
  NSInteger len = 0;
  NSString* string = [NSString stringWithFormat:@"%@",contentStr];

  if(contentArr.count>2){
    len= [(NSString*)contentArr[0] length];
    string = [[contentStr substringWithRange:NSMakeRange(0, len*2-2)] stringByAppendingString:@"..."];
  }
  string = [string stringByReplacingOccurrencesOfString:@" " withString:@""];
  string = [string stringByReplacingOccurrencesOfString:@"\r" withString:@""];
  string = [string stringByReplacingOccurrencesOfString:@"\n" withString:@""];
  NSMutableAttributedString *contentStrAttrStr = [[NSMutableAttributedString alloc]initWithString:string
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]}];

  [nodes addObject:@{
                     @"value": contentStrAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(30*i, 457*i, 315*i, height*2)]}
   ];

//    //二维码
    UIImage *QRCodeImage = [UIImage QRCodeWithStr:QRCodeStr];
    [nodes addObject:@{@"value": QRCodeImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(148*i, 544*i, 80*i, 80*i)]}
     ];


  //loago
  NSMutableAttributedString *logpStrAttrStr = [[NSMutableAttributedString alloc]initWithString:@"秀一秀  赚到够"
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FFFFFF"]}];

  [nodes addObject:@{
                     @"value": logpStrAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(145*i, 634*i, 90*i, height*1)]}
   ];

  return @{@"width": @(375*i), @"height": @(imageHeght), @"nodes": nodes};
}

+ (NSDictionary *)getParamsWithWEBImages:(NSArray<UIImage *> *)images
                                        model:(ShareImageMakerModel *)model
{
//  NSString *imageType = model.imageType;
  NSString *QRCodeStr = model.QRCodeStr;
  CGFloat i = 3;// 为了图片高清 图片尺寸375 * 667

  CGFloat imageHeght = 667*i;

    NSMutableArray *nodes = [NSMutableArray new];
  NSString *contentStr = model.other? model.other:@"";
  NSString *nameStr = model.userName?model.userName:@"";

    CGFloat sigle =  [@"1" getStringHeightWithfontSize:13*i viewWidth:315*i];
    CGFloat height =  [contentStr getStringHeightWithfontSize:13*i viewWidth:315*i];
    if (height > sigle*2) {
      height= sigle*2+1;
    }

    if (height > sigle) {
      imageHeght = 687*i;
    }
    //底图片
    [nodes addObject:@{
                       @"value": [images[0] boxblurWithBlurNumber:0.5] ,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
     ];


  //模糊图片
  UIImage * bgImg = [UIImage imageWithColor:[[UIColor whiteColor] colorWithAlphaComponent:0.3]];

  [nodes addObject:@{
                     @"value": bgImg,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(0, 0, 375*i, 667*i)]}
   ];


  //商品
  [nodes addObject:@{
                     @"value": [images[0] creatRoundImagWithRadius:0.02 width:(375-60)*i height:410*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(33*i, 57*i, (375-66)*i, 410*i)]}
   ];

  //头像
  [nodes addObject:@{
                     @"value": [images[1] creatRoundImagWithRadius:0.5 width:25*i height:25*i],
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(64*i, 422*i, 25*i, 25*i)]}
   ];

    //昵称+数额
    NSString * text = [NSString stringWithFormat:@"%@ %@",nameStr,contentStr];
    NSMutableParagraphStyle *style = [NSMutableParagraphStyle new];
    style.lineBreakMode = NSLineBreakByTruncatingTail;
    NSAttributedString *nameAttrStr = [[NSAttributedString alloc]initWithString:text
                                                                      attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:15*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FFFFFF"]}];

    [nodes addObject:@{
                       @"value": nameAttrStr,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(99*i, 424*i, 220*i, height)]}
     ];


    //白色背景
    UIImage * whiteBgImg = [UIImage imageWithColor:[UIColor whiteColor]];

    [nodes addObject:@{
                       @"value": [whiteBgImg  creatRoundImagWithRadius:0.1 width:80*i height:80*i],
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(146*i, 519*i, 80*i, 80*i)]}
     ];

//    //二维码
    UIImage *QRCodeImage = [UIImage QRCodeWithStr:QRCodeStr];
    [nodes addObject:@{@"value": QRCodeImage,
                       @"locationType": @"rect",
                       @"location": [NSValue valueWithCGRect:CGRectMake(154*i, 526*i, 66*i, 66*i)]}
     ];


  //箭头jiantou
  UIImage * jiantouImage = [UIImage imageNamed:@"jiantou.png"];
  [nodes addObject:@{@"value": jiantouImage,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(176*i, 609*i, 20*i, 20*i)]}
   ];
  
  //loago
  NSMutableAttributedString *logpStrAttrStr = [[NSMutableAttributedString alloc]initWithString:@"扫一扫，免费领钻石"
                                                                                       attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"FFFFFF"]}];

  [nodes addObject:@{
                     @"value": logpStrAttrStr,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(129*i, 634*i, 150*i, height*1)]}
   ];

  return @{@"width": @(375*i), @"height": @(imageHeght), @"nodes": nodes};
}

+(NSString *)getShowProductImageModelImages:(NSArray<UIImage *> *)images model:(ShareImageMakerModel *)model{
  CGFloat i = 3;// 为了图片高清 图片尺寸250 * 340
  NSMutableArray *nodes = [NSMutableArray new];
  CGFloat imageHeght = 667*i;
  CGFloat imageWidth =  375*i;
  NSString *QRCodeStr = model.QRCodeStr ;

  NSString *titleStr = model.titleStr;
  NSString *originalPrice = model.originalPrice;
  NSString *currentPrice = model.currentPrice;
  NSString *retailString = @"";
  
  originalPrice = [NSString stringWithFormat:@"%@",originalPrice];
  currentPrice = [NSString stringWithFormat:@"%@",currentPrice];
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
  
  //当前价格()
  NSMutableAttributedString *currentPriceAttrStr = [[NSMutableAttributedString alloc]initWithString:currentPrice
                                                                                        attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:22*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"#FF0050"]}];

  [nodes addObject:@{
                     @"value": currentPriceAttrStr,
                     @"location": [NSValue valueWithCGPoint:CGPointMake(18*i, 460*i+height+13*i)]}
   ];
  
  CGFloat spellPriceWidth = [currentPrice getWidthStringfontSize:22 viewWidth:200];
  
  //原来价格
  NSMutableAttributedString *originalPriceAttrStr = [[NSMutableAttributedString alloc]initWithString:originalPrice
                                                                                  attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13*i], NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"], NSStrikethroughStyleAttributeName: @1}];
  
  [nodes addObject:@{
                     @"value": originalPriceAttrStr,
                     @"location": [NSValue valueWithCGPoint:CGPointMake(18*i, 460*i+height+18*i*2+9*i)]}
   ];
  
  //二维码
  UIImage *QRCodeImage = [UIImage QRCodeWithStr:QRCodeStr];
  [nodes addObject:@{@"value": QRCodeImage,
                     @"locationType": @"rect",
                     @"location": [NSValue valueWithCGRect:CGRectMake(268*i, 457*i+height+13*i, 77*i, 77*i)]}
   ];
  
 
  
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
  NSString * path =NSHomeDirectory();
  NSString * Pathimg =[path stringByAppendingString:[NSString stringWithFormat:@"/Documents/QRCode%@.png",[model modelToJSONString].md5String]];
  if ([UIImagePNGRepresentation(image) writeToFile:Pathimg atomically:YES] == YES) {
    return Pathimg;
  }
  return @"";
}

@end

