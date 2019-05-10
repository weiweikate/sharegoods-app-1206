//
//  ShowCellNode.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowCellNode.h"
#import "SGNetworkImageNode.h"
@interface ShowCellNode()
@property(nonatomic, strong)SGNetworkImageNode *imageNode;
@property(nonatomic, strong)ASTextNode *titleNode;
@property(nonatomic, strong)SGNetworkImageNode *headerNode;
@property(nonatomic, strong)ASTextNode *userNameNode;
@property(nonatomic, strong)ASTextNode *timeNode;
@property(nonatomic, strong)ShowQuery_dataModel *model;
@property(nonatomic, strong)ASImageNode *numIconNode;
@property(nonatomic, strong)ASTextNode *numNode;
@property(nonatomic, strong)ASImageNode *numBgNode;
@property(nonatomic, strong)ASImageNode *hotNode;
@end
@implementation ShowCellNode

-(instancetype)initWithModel:(ShowQuery_dataModel *)model
{
  if (self = [super init]) {
    self.cornerRadius = 5;
    _model = model;
    [self addSubnode:self.imageNode];
    [self addSubnode:self.titleNode];
    [self addSubnode:self.userNameNode];
    [self addSubnode:self.headerNode];
    [self addSubnode:self.timeNode];
    [self addSubnode:self.numBgNode];
    [self addSubnode:self.numNode];
    [self addSubnode:self.numIconNode];
    [self addSubnode:self.hotNode];
    self.backgroundColor = [UIColor whiteColor];
  }
  return self;
}


- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize
{
  
  ASRatioLayoutSpec *ImageSpec = [ASRatioLayoutSpec ratioLayoutSpecWithRatio:1/_model.aspectRatio
                                                                       child:_imageNode];
//  _numIconNode.style.spacingBefore = 10;
//  ASStackLayoutSpec *hNumSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
//                                                                        spacing:10
//                                                                 justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsCenter
//                                                                       children:@[_numIconNode,
//                                                                                  _numNode
//                                                                                  ]];
//  _numBgNode.style.preferredSize = CGSizeMake(constrainedSize.min.width, 30);
//  hNumSpec.style.preferredSize = CGSizeMake(constrainedSize.min.width, 30);
//  ASOverlayLayoutSpec * overSpec1 =  [ASOverlayLayoutSpec overlayLayoutSpecWithChild:_numBgNode overlay: hNumSpec];
  //  ASAbsoluteLayoutSpec * overSpec1  = [ASAbsoluteLayoutSpec absoluteLayoutSpecWithChildren:@[_numBgNode, hNumSpec]];
  //  overSpec1.style.height = ASDimensionMake(30);
//  UIEdgeInsets insets = UIEdgeInsetsMake(INFINITY,0,0,0);
//  ASInsetLayoutSpec * numBgNode = [ASInsetLayoutSpec insetLayoutSpecWithInsets:insets child:overSpec1];
//  ASOverlayLayoutSpec * overSpec =  [ASOverlayLayoutSpec overlayLayoutSpecWithChild:ImageSpec overlay: numBgNode];
  _headerNode.style.spacingBefore = 10;
  _headerNode.style.preferredSize = CGSizeMake(30, 30);
  _headerNode.style.spacingAfter = 5;
  _timeNode.style.spacingAfter = 10;
  _userNameNode.style.flexShrink = 1.0;
  _userNameNode.style.flexGrow = 1.0;
  _hotNode.style.preferredSize = CGSizeMake(15, 15);
  _hotNode.style.spacingAfter = 5;
  
  
  ASStackLayoutSpec *hSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
                                                                     spacing:0
                                                              justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsCenter
                                                                    children:@[_headerNode,
                                                                               _userNameNode,
                                                                               _hotNode,
                                                                               _timeNode                                                                ]];
  hSpec.style.width = ASDimensionMake(constrainedSize.min.width);
  ASStackLayoutSpec *vSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionVertical
                                                                     spacing:10
                                                              justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsStart
                                                                    children:@[ImageSpec,
                                                                               [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 10, 0, 10) child:_titleNode],
                                                                               hSpec                                                                ]];
  
  return [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 0, 12, 0) child:vSpec];
  
}


- (SGNetworkImageNode *)imageNode
{
  if (!_imageNode) {
    CGFloat itemWidth=  [UIScreen mainScreen].bounds.size.width / 2.0 * [UIScreen mainScreen].scale;
    NSString * showImage = _model.showImage;
    if ([showImage containsString:@"sharegoodsmall"]) {
      showImage = [NSString stringWithFormat:@"%@?x-oss-process=image/resize,m_lfit,w_%0.0lf,h_%0.0lf",showImage,itemWidth,itemWidth/_model.aspectRatio];
    }
    _imageNode = [SGNetworkImageNode new];
    _imageNode.placeholderColor = [UIColor colorWithHexString:@"f4f4f4"];
    _imageNode.URL = [NSURL URLWithString:showImage];
    _imageNode.cornerRadius = 5;
    _imageNode.clipsToBounds = YES;

  }
  return _imageNode;
}

- (ASTextNode *)titleNode
{
  if (!_titleNode) {
    _titleNode = [ASTextNode new];
    _titleNode.maximumNumberOfLines = 2;
    _titleNode.attributedText = [[NSAttributedString alloc]initWithString:_model.pureContent_1 attributes:@{
                                                                                                            NSFontAttributeName: [UIFont systemFontOfSize:12],
                                                                                                            NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]
                                                                                                            }];
  }
  return _titleNode;
}

- (SGNetworkImageNode *)headerNode
{
  if (!_headerNode) {
    _headerNode = [SGNetworkImageNode new];
    _headerNode.defaultImage = [UIImage imageNamed:@"default_avatar"];
    _headerNode.URL = [NSURL URLWithString:_model.userHeadImg];
    _headerNode.cornerRadius = 15;
    _headerNode.clipsToBounds = YES;
  }
  return _headerNode;
}

- (ASTextNode *)userNameNode
{
  if (!_userNameNode) {
    _userNameNode = [ASTextNode new];
    _userNameNode.maximumNumberOfLines = 1;
    NSString * userName = @"";
    if (_model.userName) {
      userName = _model.userName;
    }
    _userNameNode.attributedText = [[NSAttributedString alloc]initWithString:userName
                                                                  attributes:@{
                                                                               NSFontAttributeName: [UIFont systemFontOfSize:11],
                                                                               NSForegroundColorAttributeName: [UIColor colorWithHexString:@"666666"]
                                                                               }];
  }
  return _userNameNode;
}


- (ASTextNode *)timeNode
{
  if (!_timeNode) {
    _timeNode = [ASTextNode new];
    _timeNode.maximumNumberOfLines = 1;
    NSString * time = @"";
    if (_model.time) {
      time = _model.time;
    }
    _timeNode.attributedText = [[NSAttributedString alloc]initWithString:time
                                                              attributes:@{
                                                                           NSFontAttributeName: [UIFont systemFontOfSize:11],
                                                                           NSForegroundColorAttributeName: [UIColor colorWithHexString:@"999999"]
                                                                           }];
  }
  return _timeNode;
}


- (ASImageNode *)numIconNode
{
  if (!_numIconNode) {
    _numIconNode = [ASImageNode new];
    _numIconNode.image = [UIImage imageNamed:@"see_white"];
  }
  return _numIconNode;
}


- (ASImageNode *)numBgNode
{
  if (!_numBgNode) {
    _numBgNode = [ASImageNode new];
    _numBgNode.image = [UIImage imageNamed:@"show_mask"];
  }
  return _numBgNode;
}

- (ASImageNode *)hotNode
{
  if (!_hotNode) {
    _hotNode = [ASImageNode new];
    _hotNode.image = [UIImage imageNamed:@"hot"];
  }
  return _hotNode;
}


- (ASTextNode *)numNode
{
  if (!_numNode) {
    _numNode = [ASTextNode new];
    _numNode.maximumNumberOfLines = 1;
    NSString * click = _model.click > 999999 ?
    @"999999+" :
    [NSString stringWithFormat:@"%ld", (long)_model.click];
    _numNode.attributedText = [[NSAttributedString alloc]initWithString:click attributes:@{
                                                                                           NSFontAttributeName: [UIFont systemFontOfSize:10],
                                                                                           NSForegroundColorAttributeName: [UIColor colorWithHexString:@"ffffff"]
                                                                                           }];
  }
  return _numNode;
}


@end
