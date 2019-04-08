//
//  SGNetworkImageNode.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "SGNetworkImageNode.h"
//#define HAVE_CACHE_IMAGE(str) [[YYImageCache sharedCache] containsImageForKey:str] //判断是否存在缓存键值
//#define CACHE_IMAGE(str) [[YYImageCache sharedCache] getImageForKey:str]//获取缓存图片
@interface SGNetworkImageNode ()
/**本地图片*/
@property (nonatomic, strong) ASImageNode *imageNode;

@end
@implementation SGNetworkImageNode

- (instancetype)init{
  self = [super init];
  if (self) {
    [self addSubnode:self.imageNode];
  }
  return self;
}
- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize{
  return [ASInsetLayoutSpec insetLayoutSpecWithInsets:(UIEdgeInsetsZero) child: self.imageNode];
}
- (ASImageNode *)imageNode{
  if (!_imageNode) {
    _imageNode = [[ASImageNode alloc] init];
  }
  return _imageNode;
}
- (void)setURL:(NSURL *)URL{
  _URL = URL;
  @weakify(self);
  [[YYWebImageManager sharedManager] requestImageWithURL:URL options:YYWebImageOptionIgnoreFailedURL progress:^(NSInteger receivedSize, NSInteger expectedSize) {
    
  } transform:nil completion:^(UIImage * _Nullable image, NSURL * _Nonnull url, YYWebImageFromType from, YYWebImageStage stage, NSError * _Nullable error) {
    @strongify(self);
    if (error) {
      
    }else{
        self.imageNode.image = image;
    }
  }];
}
- (void)setPlaceholderColor:(UIColor *)placeholderColor{
   if (!self.imageNode.image) {
      self.imageNode.placeholderColor = placeholderColor;
   }
}
- (void)setImage:(UIImage *)image{
  self.imageNode.image = image;
}
- (void)setDefaultImage:(UIImage *)defaultImage{
  if (!self.imageNode.image) {
     self.imageNode.image = defaultImage;
  }
}
@end
