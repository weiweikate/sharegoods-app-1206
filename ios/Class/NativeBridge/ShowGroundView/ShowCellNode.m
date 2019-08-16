//
//  ShowCellNode.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowCellNode.h"
#import "SGNetworkImageNode.h"
#import "NSString+UrlAddParams.h"
#define SGNetworkImageNodeNum   6
@interface ShowCellNode()
@property(nonatomic, strong)ASDisplayNode *imageNode;
@property(nonatomic, assign)NSInteger index;
@property(nonatomic, strong)ASTextNode *titleNode;
@property(nonatomic, strong)ASDisplayNode *headerNode;
@property(nonatomic, strong)ASTextNode *userNameNode;
@property(nonatomic, strong)ASTextNode *hotNumNode;
@property(nonatomic, strong)ShowQuery_dataModel *model;
@property(nonatomic, strong)ASImageNode *numIconNode;
@property(nonatomic, strong)ASTextNode *numNode;
@property(nonatomic, strong)ASImageNode *numBgNode;
@property(nonatomic, strong)ASImageNode *hotNode;
@property(nonatomic, strong)ASImageNode *videoImgNode;

@end
@implementation ShowCellNode

-(instancetype)initWithModel:(ShowQuery_dataModel *)model index: (NSInteger)index
{
  if (self = [super init]) {
    self.cornerRadius = 5;
    _index = index;
    _model = model;
    [self addSubnode:self.imageNode];
    [self addSubnode:self.videoImgNode];
    [self addSubnode:self.titleNode];
    [self addSubnode:self.userNameNode];
    [self addSubnode:self.headerNode];
    [self addSubnode:self.hotNode];
    [self addSubnode:self.hotNumNode];
    self.backgroundColor = [UIColor whiteColor];
    if(_model.showType==3){
      self.videoImgNode.hidden = NO;
    }
  }
  return self;
}


- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize
{
  ASRatioLayoutSpec *ImageSpec = [ASRatioLayoutSpec ratioLayoutSpecWithRatio:1/self.model.aspectRatio_show
                                                                       child:_imageNode];
  
  //已屏蔽，返回下面的布局
  self.videoImgNode.style.preferredSize = CGSizeMake(50, 50);
  ASStackLayoutSpec *textInsetSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
                                                                             spacing:0
                                                                      justifyContent:ASStackLayoutJustifyContentCenter
                                                                          alignItems:ASStackLayoutAlignItemsCenter children:@[self.videoImgNode]];
  ASOverlayLayoutSpec *OverlayLayoutSpec =  [ASOverlayLayoutSpec overlayLayoutSpecWithChild:ImageSpec overlay:textInsetSpec];
  
  _headerNode.style.spacingBefore = 10;
  _headerNode.style.preferredSize = CGSizeMake(30, 30);
  _headerNode.style.spacingAfter = 5;
  _userNameNode.style.flexShrink = 1.0;
  _userNameNode.style.flexGrow = 1.0;
  _hotNode.style.preferredSize = CGSizeMake(15, 15);
  _hotNode.style.spacingAfter = 5;
  _hotNumNode.style.spacingAfter = 10;

  
  ASStackLayoutSpec *hSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionHorizontal
                                                                     spacing:0
                                                              justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsCenter
                                                                    children:@[_headerNode,
                                                                               _userNameNode,
                                                                               _hotNode,
                                                                               _hotNumNode
                                                                ]];
  hSpec.style.width = ASDimensionMake(constrainedSize.min.width);
    ASStackLayoutSpec *vSpec = [ASStackLayoutSpec stackLayoutSpecWithDirection:ASStackLayoutDirectionVertical
                                            spacing:_titleNode.attributedText.length>0?10:0
                                      justifyContent:ASStackLayoutJustifyContentStart alignItems:ASStackLayoutAlignItemsStart
                                            children:@[OverlayLayoutSpec,
                                                      [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 10, 0, 10) child:_titleNode],
                                                          hSpec                                                                ]];
  
    return [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 0, 12, 0) child:vSpec];
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
    if(_model.pureContent_1){
    _titleNode.attributedText = [[NSAttributedString alloc]initWithString:_model.pureContent_1 attributes:@{
                                                                                                            NSFontAttributeName: [UIFont systemFontOfSize:12],
                                                                                                            NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]
                                                                                                            }];
      }
  }
  return _titleNode;
}

- (ASDisplayNode *)headerNode
{
  if (!_headerNode) {
     NSString *urlStr = @"";
    if(_model.userInfoVO && [_model.userInfoVO valueForKey:@"userImg"]){
      urlStr = [[_model.userInfoVO valueForKey:@"userImg"] getUrlAndWidth:30 height:30];
    }
    if (_index < SGNetworkImageNodeNum) {
      SGNetworkImageNode * imageNode = [SGNetworkImageNode new];
      imageNode.URL = [NSURL URLWithString:urlStr];
      imageNode.defaultImage = [UIImage imageNamed:@"default_avatar"];
      _headerNode = imageNode;
    }else{
      ASNetworkImageNode * imageNode = [ASNetworkImageNode new];
      imageNode.URL = [NSURL URLWithString:urlStr];
      imageNode.defaultImage = [UIImage imageNamed:@"default_avatar"];
      _headerNode = imageNode;
    }
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
    if (_model.userInfoVO.userName) {
      userName = _model.userInfoVO.userName;
    }
    _userNameNode.attributedText = [[NSAttributedString alloc]initWithString:userName
                                                                  attributes:@{
                                                                               NSFontAttributeName: [UIFont systemFontOfSize:11],
                                                                               NSForegroundColorAttributeName: [UIColor colorWithHexString:@"666666"]
                                                                               }];
  }
  return _userNameNode;
}


- (ASTextNode *)hotNumNode

{
  if (!_hotNumNode) {
    _hotNumNode = [ASTextNode new];
    _hotNumNode.maximumNumberOfLines = 1;
    NSString * num = @"";
    if (_model.hotCount) {
      if(_model.hotCount<=999){
        num = [NSString stringWithFormat:@"%ld",_model.hotCount>0?_model.hotCount:0];
      }else if(_model.hotCount<10000){
        num = [NSString stringWithFormat:@"%ldK+",_model.hotCount>0?_model.hotCount/1000:0];
      }else if(_model.hotCount<100000){
        num = [NSString stringWithFormat:@"%ldW+",_model.hotCount>0?_model.hotCount/10000:0];
      }else{
        num = @"10W+";
      }
    }
    _hotNumNode.attributedText = [[NSAttributedString alloc]initWithString:num
                                                              attributes:@{
                                                                           NSFontAttributeName: [UIFont systemFontOfSize:11],
                                                                           NSForegroundColorAttributeName: [UIColor colorWithHexString:@"999999"]
                                                                           }];
  }
  return _hotNumNode;
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

- (ASImageNode *)videoImgNode
{
  if (!_videoImgNode) {
    _videoImgNode = [ASImageNode new];
    _videoImgNode.image = [UIImage imageNamed:@"video"];
    _videoImgNode.hidden = YES;
  }
  return _videoImgNode;
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
