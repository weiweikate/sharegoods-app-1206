//
//  UIButton+ImageText.m
//  crm_app_xiugou
//
//  Created by slardar chen on 2019/7/31.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "UIButton+ImageText.h"

@implementation UIButton (ImageText)
- (void)layoutButtonWithImageTitleSpace:(CGFloat)space {
  CGFloat imageWith = self.imageView.image.size.width;
  CGFloat imageHeight = self.imageView.image.size.height;
  CGFloat labelWidth = self.titleLabel.intrinsicContentSize.width;
  CGFloat labelHeight = self.titleLabel.intrinsicContentSize.height;
  
  UIEdgeInsets imageEdgeInsets = UIEdgeInsetsMake(-labelHeight-space/2.0, 0, 0, -labelWidth);
  UIEdgeInsets labelEdgeInsets = UIEdgeInsetsMake(0, -imageWith, -imageHeight-space/2.0, 0);
  self.titleEdgeInsets = labelEdgeInsets;
  self.imageEdgeInsets = imageEdgeInsets;
  self.titleLabel.textAlignment = NSTextAlignmentCenter;
}
@end
