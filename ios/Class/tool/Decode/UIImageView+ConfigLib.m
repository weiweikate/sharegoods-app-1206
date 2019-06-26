//
//  UIImageView+ConfigLib.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/26.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "UIImageView+ConfigLib.h"

@implementation UIImageView (ConfigLib)

+ (void)load
{
  // self -> UIImage
  // 获取imageNamed
  // 获取哪个类的方法
  // SEL:获取哪个方法
  Method imageNamedMethod = class_getInstanceMethod(self, @selector(setImage:));
  // 获取xmg_imageNamed
  Method xmg_imageNamedMethod = class_getInstanceMethod(self, @selector(my_setImage:));
  // 交互方法:runtime
  
//  Method imageNamedMethod = class_getInstanceMethod(self, @selector(setImage:));
//  // 获取xmg_imageNamed
//  Method xmg_imageNamedMethod = class_getInstanceMethod(self, @selector(my_setImage:));
  
  method_exchangeImplementations(imageNamedMethod, xmg_imageNamedMethod);
}

- (void)my_setImage:(UIImage *)image{
  if ([image isKindOfClass:[YYImage class]]) {
    YYImage *image2 = (YYImage*)image;
    NSInteger num = [image2 animatedImageFrameCount];
    NSMutableArray * frames = [[NSMutableArray alloc]initWithCapacity:num];
    CGFloat animationDuration = 0.0;
    for (int i = 0; i<num; i++) {
      [frames addObject:[image2 animatedImageFrameAtIndex:i]];
      animationDuration+= [image2 animatedImageDurationAtIndex:i];
    }
    self.animationImages=frames;//将图片数组加入UIImageView动画数组中
    self.animationDuration = animationDuration;//每次动画时长
    [self startAnimating];
  }else{
    [self my_setImage:image];
    [self stopAnimating];
  }
}
-(void)dealloc{
  [self stopAnimating];
}
@end
