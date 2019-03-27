//
//  SGNetworkImageNode.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "SGNetworkImageNode.h"
#define HAVE_CACHE_IMAGE(str) [[YYImageCache sharedCache] containsImageForKey:str] //判断是否存在缓存键值
#define CACHE_IMAGE(str) [[YYImageCache sharedCache] getImageForKey:str]//获取缓存图片
@interface SGNetworkImageNode ()<ASNetworkImageNodeDelegate>
/**网络图片*/
@property (nonatomic, strong) ASNetworkImageNode *netImgNode;
/**本地图片*/
@property (nonatomic, strong) ASImageNode *imageNode;

@end
@implementation SGNetworkImageNode

- (instancetype)init{
  self = [super init];
  if (self) {
    [self addSubnode:self.netImgNode];
    [self addSubnode:self.imageNode];
  }
  return self;
}
- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize{
  return [ASInsetLayoutSpec insetLayoutSpecWithInsets:(UIEdgeInsetsZero) child:HAVE_CACHE_IMAGE(self.URL.absoluteString) ? self.imageNode : self.netImgNode];
}
- (ASNetworkImageNode *)netImgNode{
  if (!_netImgNode) {
    _netImgNode = [[ASNetworkImageNode alloc] init];
    _netImgNode.delegate = self;
    _netImgNode.shouldCacheImage = NO;
  }
  return _netImgNode;
}
- (ASImageNode *)imageNode{
  if (!_imageNode) {
    _imageNode = [[ASImageNode alloc] init];
  }
  return _imageNode;
}
- (void)setURL:(NSURL *)URL{
  _URL = URL;
  if (HAVE_CACHE_IMAGE(_URL.absoluteString)) {
    self.imageNode.image = CACHE_IMAGE(_URL.absoluteString);
  } else {
    self.netImgNode.URL = _URL;
  }
}
- (void)setPlaceholderColor:(UIColor *)placeholderColor{
  self.netImgNode.placeholderColor = placeholderColor;
}
- (void)setImage:(UIImage *)image{
  self.netImgNode.image = image;
}
- (void)setDefaultImage:(UIImage *)defaultImage{
  self.netImgNode.defaultImage = defaultImage;
}
- (void)setJs_placeholderFadeDuration:(NSTimeInterval)js_placeholderFadeDuration{
  self.netImgNode.placeholderFadeDuration = js_placeholderFadeDuration;
}
- (void)imageNode:(ASNetworkImageNode *)imageNode didLoadImage:(UIImage *)image{
  [[YYImageCache sharedCache] setImage:image forKey:imageNode.URL.absoluteString];
  
}
@end
