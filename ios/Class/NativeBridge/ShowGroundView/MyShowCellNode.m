//
//  MyShowCellNode.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/6/20.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MyShowCellNode.h"
#import "SGNetworkImageNode.h"
#define SGNetworkImageNodeNum   6
@interface MyShowCellNode()
@property(nonatomic, strong)ShowQuery_dataModel *model;
@property(nonatomic, assign)NSInteger index;
@property(nonatomic, strong)ASDisplayNode *imageNode;
@property(nonatomic, strong)ASImageNode *statusImgNode;
@property(nonatomic, strong)ASTextNode *titleNode;
@property(nonatomic, strong)ASTextNode *statusNode;
@property(nonatomic, strong)ASButtonNode *deleteBtnNode;
@end
@implementation MyShowCellNode
-(instancetype)initWithModel:(ShowQuery_dataModel *)model index:(NSInteger)index{
  if (self = [super init]) {
    _model = model;
    _index = index;
    if (index%2) {
      [self setMask];
    }
    [self addSubnode:self.imageNode];
    [self addSubnode:self.statusImgNode];
    [self addSubnode:self.titleNode];
    [self addSubnode:self.statusNode];
    [self addSubnode:self.deleteBtnNode];
    self.backgroundColor = [UIColor whiteColor];
    self.cornerRadius = 5;
    self.clipsToBounds = YES;
  }
  return self;
}

- (void)deletBtnTap{
  if (self.deletBtnTapBlock) {
    self.deletBtnTapBlock(self.model, self.index);
  }
}

- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize
{
  ASRatioLayoutSpec *ImageSpec = [ASRatioLayoutSpec ratioLayoutSpecWithRatio:self.model.aspectRatio_show
                                                                       child:_imageNode];
  //已屏蔽，返回下面的布局
  CGFloat width = constrainedSize.max.width;
  self.statusImgNode.style.preferredSize = CGSizeMake(width/3*2, width/3*2);
  ASStackLayoutSpec *textInsetSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
                                                                             spacing:0
                                                                      justifyContent:ASStackLayoutJustifyContentCenter
                                                                          alignItems:ASStackLayoutAlignItemsCenter children:@[self.statusImgNode]];
  ASOverlayLayoutSpec *OverlayLayoutSpec =  [ASOverlayLayoutSpec overlayLayoutSpecWithChild:ImageSpec overlay:textInsetSpec];
 
  self.deleteBtnNode.style.preferredSize = CGSizeMake(15, 15);
  
  ASInsetLayoutSpec *titleSpec =  [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(10, 10, 10, 10) child:_titleNode];
  
  ASStackLayoutSpec * bottomSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
                                                                           spacing:0
                                                                    justifyContent:ASStackLayoutJustifyContentSpaceBetween
                                                                        alignItems:ASStackLayoutAlignItemsStart children:@[self.statusNode, self.deleteBtnNode]];
  bottomSpec.style.width = ASDimensionMake(constrainedSize.max.width);
  ASInsetLayoutSpec *bottomSpec2 =  [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 10, 10, 10) child:bottomSpec];
   //未屏蔽返回 spec
  ASStackLayoutSpec * spec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionVertical spacing:0 justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsStart children:@[OverlayLayoutSpec,titleSpec,  bottomSpec2]];
  return spec;
}

- (ASDisplayNode *)imageNode
{
  if (!_imageNode) {
    if (_index < SGNetworkImageNodeNum) {
      SGNetworkImageNode * imageNode = [SGNetworkImageNode new];
      imageNode.defaultImage = [UIImage imageWithColor:[UIColor whiteColor]];
      imageNode.URL = [NSURL URLWithString:self.model.showImage_oss];
      _imageNode = imageNode;
    }else{
      ASNetworkImageNode * imageNode = [ASNetworkImageNode new];
      imageNode.defaultImage = [UIImage imageWithColor:[UIColor whiteColor]];
      imageNode.URL = [NSURL URLWithString:self.model.showImage_oss];
      _imageNode = imageNode;
    }
  }
  return _imageNode;
}

- (ASTextNode *)titleNode
{
  if (!_titleNode) {
    _titleNode = [ASTextNode new];
    _titleNode.maximumNumberOfLines = 2;
    if(_model.title){
      _titleNode.attributedText = [[NSAttributedString alloc]initWithString:_model.title attributes:@{
                                                                                                      NSFontAttributeName: [UIFont systemFontOfSize:12],
                                                                                                    NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]
                                                                                                      }];
    }
  }
  return _titleNode;
}

- (ASTextNode *)statusNode
{
  if (!_statusNode) {
    _statusNode = [ASTextNode new];
    _statusNode.attributedText = [[NSAttributedString alloc]initWithString:@"审核中" attributes:@{
                                                                                                      NSFontAttributeName: [UIFont systemFontOfSize:12],
                                                                                                      NSForegroundColorAttributeName: [UIColor colorWithHexString:@"#3187FF"]
                                                                                                      }];
  }
  return _statusNode;
}

- (ASButtonNode *)deleteBtnNode
{
  if (!_deleteBtnNode) {
    _deleteBtnNode = [ASButtonNode new];
    [_deleteBtnNode setImage:[UIImage imageNamed:@"icon_delete"] forState:0];
    [_deleteBtnNode addTarget:self action:@selector(deletBtnTap) forControlEvents:ASControlNodeEventTouchUpInside];
  }
  return _deleteBtnNode;
}

- (ASImageNode *)statusImgNode
{
  if (!_statusImgNode) {
    _statusImgNode = [ASImageNode new];
    _statusImgNode.image = [UIImage imageNamed:@"pingbi"];
     self.statusImgNode.hidden = YES;
  }
  return _statusImgNode;
}

- (void)setMask{
  self.statusImgNode.hidden = NO;
  self.imageNode.alpha = 0.5;
  self.titleNode.alpha = 0.5;
  self.statusNode.alpha = 0.5;
}
@end
