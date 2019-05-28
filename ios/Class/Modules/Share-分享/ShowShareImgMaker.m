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
@end

