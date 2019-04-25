//
//  JXFooterView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXFooterView.h"
#import "UIView+SDAutoLayout.h"

@interface JXFooterView()
@property (nonatomic, strong)UIView* bgView;
@end

@implementation JXFooterView

-(UIView*)bgView{
  if(!_bgView){
    _bgView = [[UIView alloc]init];
  }
  return _bgView;
}

-(UIImageView*)goodsImg{
  if (!_goodsImg) {
    _goodsImg = [[UIImageView alloc] init];
    _goodsImg.image = [UIImage imageNamed:@"welcome3"];
    
  }
  return _goodsImg;
}

-(UILabel*)titile{
  if(!_titile){
    _titile = [[UILabel alloc]init];
    _titile.font = [UIFont systemFontOfSize:10];
    _titile.textColor = [UIColor grayColor];
    _titile.text = @"kskkskkskkskkskkskkskkskskskkskskskks";
  }
  return _titile;
}

-(UILabel*)price{
  if(!_price){
    _price = [[UILabel alloc]init];
    _price.font = [UIFont systemFontOfSize:10];
    _price.textColor = [UIColor lightGrayColor];
    _price.text = @"999_000";
  }
  return _price;
}

-(UIButton*)shopCarBtn{
  if(!_shopCarBtn){
    _shopCarBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _shopCarBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [_shopCarBtn setImage:[UIImage imageNamed:@"welcome4"] forState:UIControlStateNormal];
    _shopCarBtn.layer.cornerRadius = 10;
    _shopCarBtn.layer.borderWidth = 1;
    _shopCarBtn.layer.masksToBounds = YES;
  }
  return _shopCarBtn;
}

-(UIButton*)zanBtn{
  if(!_zanBtn){
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _zanBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [_zanBtn setImage:[UIImage imageNamed:@"welcome4"] forState:UIControlStateNormal];
    _zanBtn.layer.cornerRadius = 10;
    _zanBtn.layer.borderWidth = 1;
    _zanBtn.layer.masksToBounds = YES;
  }
  return _zanBtn;
}

-(UIButton*)downloadBtn{
  if(!_downloadBtn){
    _downloadBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _downloadBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [_downloadBtn setImage:[UIImage imageNamed:@"welcome4"] forState:UIControlStateNormal];
    _downloadBtn.layer.cornerRadius = 10;
    _downloadBtn.layer.borderWidth = 1;
    _downloadBtn.layer.masksToBounds = YES;
  }
  return _downloadBtn;
}

-(UIButton*)shareBtn{
  if(!_shareBtn){
    _shareBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _shareBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [_shareBtn setImage:[UIImage imageNamed:@"welcome4"] forState:UIControlStateNormal];
    _shareBtn.layer.cornerRadius = 10;
    _shareBtn.layer.borderWidth = 1;
    _shareBtn.layer.masksToBounds = YES;
  }
  return _zanBtn;
}
-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];
//    self.backgroundColor = [UIColor greenColor];

  }
  return  self;
}

-(void)setUI{
  [self setGoodsView];
  [self addSubview:self.zanBtn];
  [self addSubview:self.downloadBtn];
  [self addSubview:self.shareBtn];

  //商品
  self.bgView.sd_layout.topEqualToView(self)
  .leftSpaceToView(self, 15)
  .rightSpaceToView(self, 15)
  .bottomEqualToView(self);
  
  //点赞
  self.zanBtn.sd_layout.topSpaceToView(self.bgView, 10)
  .leftSpaceToView(self, 20)
  .widthIs(50).heightIs(50);
  
  //下载
  self.zanBtn.sd_layout.topSpaceToView(self.bgView, 10)
  .leftSpaceToView(self.zanBtn, 20)
  .widthIs(50).heightIs(50);
  
  //分享/转发
  self.zanBtn.sd_layout.topSpaceToView(self.bgView, 10)
  .rightSpaceToView(self, 20)
  .widthIs(50).heightIs(50);
  
}

-(void)setGoodsView{
  [self.bgView addSubview:self.goodsImg];
  [self.bgView addSubview:self.titile];
  [self.bgView addSubview:self.price];
  [self.bgView addSubview:self.shopCarBtn];
  
  //商品图片
  self.goodsImg.sd_layout.topSpaceToView(self.bgView, 10)
  .leftSpaceToView(self.bgView, 20)
  .widthIs(50).heightIs(50);
  
  //标题
  self.titile.sd_layout.topEqualToView(self.goodsImg)
  .leftSpaceToView(self.goodsImg, 10)
  .heightIs(20);
  [_titile setSingleLineAutoResizeWithMaxWidth:200];
  
  //价格
  self.price.sd_layout.bottomEqualToView(self.goodsImg)
  .leftSpaceToView(self.goodsImg, 10)
  .heightIs(20);
  [_price setSingleLineAutoResizeWithMaxWidth:200];

  //购物车
  self.shopCarBtn.sd_layout.bottomSpaceToView(self.bgView, 10)
  .rightSpaceToView(self, 20)
  .widthIs(50).heightIs(50);
}


-(void)tapGuanzhuBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
  NSLog(@"tapGuanzhuBtn");
}
@end
