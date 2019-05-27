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
@property(nonatomic, strong)ASTextNode *hotNumNode;
@property(nonatomic, strong)ShowQuery_dataModel *model;
@property(nonatomic, strong)ASImageNode *numIconNode;
@property(nonatomic, strong)ASTextNode *numNode;
@property(nonatomic, strong)ASImageNode *numBgNode;
@property(nonatomic, strong)ASImageNode *hotNode;
@property(nonatomic, strong)NSMutableDictionary *aspectRatioDic;
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
//    [self addSubnode:self.numBgNode];
//    [self addSubnode:self.numNode];
//    [self addSubnode:self.numIconNode];
    [self addSubnode:self.hotNode];
    [self addSubnode:self.hotNumNode];
    self.backgroundColor = [UIColor whiteColor];
  }
  return self;
}


- (ASLayoutSpec *)layoutSpecThatFits:(ASSizeRange)constrainedSize
{
  CGFloat aspectRatio = 1;
  if([self.aspectRatioDic valueForKey:@"width"]&&[self.aspectRatioDic valueForKey:@"height"]){
    CGFloat width = [[self.aspectRatioDic valueForKey:@"width"] floatValue];
    CGFloat height = [[self.aspectRatioDic valueForKey:@"height"] floatValue];
    aspectRatio = height/width;
  }
  ASRatioLayoutSpec *ImageSpec = [ASRatioLayoutSpec ratioLayoutSpecWithRatio:aspectRatio
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
                                            children:@[ImageSpec,
                                                      [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 10, 0, 10) child:_titleNode],
                                                          hSpec                                                                ]];
  
    return [ASInsetLayoutSpec insetLayoutSpecWithInsets:UIEdgeInsetsMake(0, 0, 12, 0) child:vSpec];
}


- (SGNetworkImageNode *)imageNode
{
  if (!_imageNode) {
    CGFloat itemWidth=  [UIScreen mainScreen].bounds.size.width / 2.0 * [UIScreen mainScreen].scale;
    NSString * showImage = @"";
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    if([_model.resource[0] valueForKey:@"url"]){
       showImage = [_model.resource[0] valueForKey:@"url"];
        self.aspectRatioDic = [self getURLParameters:showImage];
    }
    
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
    if(_model.pureContent_1){
    _titleNode.attributedText = [[NSAttributedString alloc]initWithString:_model.pureContent_1 attributes:@{
                                                                                                            NSFontAttributeName: [UIFont systemFontOfSize:12],
                                                                                                            NSForegroundColorAttributeName: [UIColor colorWithHexString:@"333333"]
                                                                                                            }];
      }
  }
  return _titleNode;
}

- (SGNetworkImageNode *)headerNode
{
  if (!_headerNode) {
    _headerNode = [SGNetworkImageNode new];
    _headerNode.defaultImage = [UIImage imageNamed:@"default_avatar"];
    if(_model.userInfoVO && [_model.userInfoVO valueForKey:@"userImg"]){
      _headerNode.URL = [NSURL URLWithString:[_model.userInfoVO valueForKey:@"userImg"]];
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
      if(_model.hotCount<999){
        num = [NSString stringWithFormat:@"%ld",_model.hotCount];
      }else if(_model.hotCount<100000){
        num = @"999+";
      }else{
        num = @"10w+";
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


-(NSMutableDictionary*)aspectRatioDic{
  if(!_aspectRatioDic){
    _aspectRatioDic = [NSMutableDictionary new];
  }
  return _aspectRatioDic;
}

/**
 *  截取URL中的参数
 *
 *  @return NSMutableDictionary parameters
 */
- (NSMutableDictionary *)getURLParameters:(NSString *)urlStr {
  
  // 查找参数
  NSRange range = [urlStr rangeOfString:@"?"];
  if (range.location == NSNotFound) {
    return nil;
  }
  
  // 以字典形式将参数返回
  NSMutableDictionary *params = [NSMutableDictionary dictionary];
  
  // 截取参数
  NSString *parametersString = [urlStr substringFromIndex:range.location + 1];
  
  // 判断参数是单个参数还是多个参数
  if ([parametersString containsString:@"&"]) {
    
    // 多个参数，分割参数
    NSArray *urlComponents = [parametersString componentsSeparatedByString:@"&"];
    
    for (NSString *keyValuePair in urlComponents) {
      // 生成Key/Value
      NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
      NSString *key = [pairComponents.firstObject stringByRemovingPercentEncoding];
      NSString *value = [pairComponents.lastObject stringByRemovingPercentEncoding];
      
      // Key不能为nil
      if (key == nil || value == nil) {
        continue;
      }
      
      id existValue = [params valueForKey:key];
      
      if (existValue != nil) {
        
        // 已存在的值，生成数组
        if ([existValue isKindOfClass:[NSArray class]]) {
          // 已存在的值生成数组
          NSMutableArray *items = [NSMutableArray arrayWithArray:existValue];
          [items addObject:value];
          
          [params setValue:items forKey:key];
        } else {
          
          // 非数组
          [params setValue:@[existValue, value] forKey:key];
        }
        
      } else {
        
        // 设置值
        [params setValue:value forKey:key];
      }
    }
  } else {
    // 单个参数
    
    // 生成Key/Value
    NSArray *pairComponents = [parametersString componentsSeparatedByString:@"="];
    
    // 只有一个参数，没有值
    if (pairComponents.count == 1) {
      return nil;
    }
    
    // 分隔值
    NSString *key = [pairComponents.firstObject stringByRemovingPercentEncoding];
    NSString *value = [pairComponents.lastObject stringByRemovingPercentEncoding];
    
    // Key不能为nil
    if (key == nil || value == nil) {
      return nil;
    }
    
    // 设置值
    [params setValue:value forKey:key];
  }
  
  return params;
}

@end
