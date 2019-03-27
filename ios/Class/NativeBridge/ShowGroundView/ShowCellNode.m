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
@property(nonatomic, strong)ShowQuery_dataModel *model;
@end
@implementation ShowCellNode

-(instancetype)initWithModel:(ShowQuery_dataModel *)model
{
  if (self = [super init]) {
    self.cornerRadius = 5;
    self.neverShowPlaceholders = YES;
    _model = model;
    _imageNode = [SGNetworkImageNode new];
    _imageNode.placeholderColor = [UIColor colorWithHexString:@"f4f4f4"];
    _imageNode.URL = [NSURL URLWithString:model.showImage];
    [self addSubnode:_imageNode];
  }
  return self;
}

- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize
{
  return [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsZero
                                                child:[ASRatioLayoutSpec ratioLayoutSpecWithRatio:1/_model.aspectRatio
                                                                                            child:_imageNode]];
}


@end
