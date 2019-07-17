//
//  MBVideoHeaderView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MBVideoHeaderView.h"
#import "UIView+SDAutoLayout.h"
#import "UIImageView+WebCache.h"
#import "NSString+UrlAddParams.h"
#import "UIImage+Util.h"

@interface MBVideoHeaderView()
@property (nonatomic,strong) UIImageView * headImg;
@property (nonatomic,strong) UILabel * nameLab;
@property (nonatomic,strong) UIButton * guanBtn;
@property (nonatomic,strong) UILabel * timeLab;
@property (nonatomic,strong) UIImageView * shareImg;
@property (nonatomic,strong) UIView * hgImg;

@end

@implementation MBVideoHeaderView
-(UIImageView*)headImg{
  if (!_headImg) {
    _headImg = [[UIImageView alloc] init];
    _headImg.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickHeaderImg)];
    [_headImg addGestureRecognizer:tapGesture];
    _headImg.layer.masksToBounds = YES;
    
  }
  return _headImg;
}

-(UIView*)hgImg{
  if (!_hgImg) {
    _hgImg = [[UIView alloc] init];
    CAGradientLayer *gradient = [CAGradientLayer layer];
    //设置开始和结束位置(通过开始和结束位置来控制渐变的方向)
//    gradient.locations = @[@(1.0f), @(0)];
    gradient.startPoint = CGPointMake(0, 0);
    gradient.endPoint = CGPointMake(0, 1.0);
    gradient.colors = @[(__bridge id)RGBA(0, 0, 0, 1).CGColor, (__bridge id)RGBA(0, 0, 0, 0).CGColor];
    gradient.frame = CGRectMake(0, 0, KScreenWidth, 100);
    [_hgImg.layer insertSublayer:gradient atIndex:0];
  }
  return _hgImg;
}

-(UIImageView*)shareImg{
  if (!_shareImg) {
    _shareImg = [[UIImageView alloc] init];
//    _shareImg.image = [uii]
    _shareImg.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickShareImg)];
    [_shareImg addGestureRecognizer:tapGesture];
    _shareImg.layer.masksToBounds = YES;
    
  }
  return _shareImg;
}

-(UILabel*)nameLab{
  if(!_nameLab){
    _nameLab = [[UILabel alloc]init];
    _nameLab.font = [UIFont systemFontOfSize:13];
    _nameLab.textColor =[UIColor whiteColor];
    _nameLab.text = @"123";
  }
  return _nameLab;
}

-(UILabel*)timeLab{
  if(!_timeLab){
    _timeLab = [[UILabel alloc]init];
    _timeLab.font = [UIFont systemFontOfSize:11];
    _timeLab.textColor =[UIColor whiteColor];
    _timeLab.text = @"msmmsmmsmmsmms";
  }
  return _timeLab;
}

-(UIButton*)guanBtn{
  if(!_guanBtn){
    _guanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _guanBtn.titleLabel.font = [UIFont systemFontOfSize:13];
    [_guanBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _guanBtn.backgroundColor = [UIColor colorWithHexString:@"#FF9502"];
    _guanBtn.layer.masksToBounds = YES;
  }
  return _guanBtn;
}



-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];
    
  }
  return  self;
}

-(void)setUI{
  [self addSubview:self.hgImg];
  [self addSubview:self.headImg];
  [self addSubview:self.nameLab];
  [self addSubview:self.guanBtn];
  [self addSubview:self.timeLab];
  
  //背景
  self.hgImg.sd_layout.leftEqualToView(self)
  .topSpaceToView(self, 0)
  .widthIs(KScreenWidth).heightIs(100);
  
  //头像
  self.headImg.sd_layout.leftSpaceToView(self, 10)
  .topSpaceToView(self, kStatusBarHeight+7)
  .widthIs(30).heightIs(30);
  self.headImg.layer.cornerRadius = self.headImg.frame.size.width/2.0;
  
  //昵称
  self.nameLab.sd_layout.leftSpaceToView(_headImg, 10)
  .heightIs(15).topEqualToView(_headImg);
  [_nameLab setSingleLineAutoResizeWithMaxWidth:200];
  
  //关注
    [_guanBtn setTitle:@"+关注" forState:UIControlStateNormal];
    [_guanBtn setTitle:@"已关注" forState:UIControlStateSelected];
    [_guanBtn addTarget:self action:@selector(tapGuanzhuBtn:) forControlEvents:UIControlEventTouchUpInside];
  
    self.guanBtn.sd_layout.centerYEqualToView(self.headImg)
    .rightSpaceToView(self, 20)
    .heightIs(20)
    .widthIs(50);
  
  //发布时间
  self.timeLab.sd_layout.leftSpaceToView(_headImg, 10)
  .topSpaceToView(self.nameLab, 2)
  .heightIs(15);
  [_timeLab setSingleLineAutoResizeWithMaxWidth:200];
  
}

-(void)clickHeaderImg{
  
}

-(void)clickShareImg{
  
}

-(void)tapGuanzhuBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
}

-(void)setType:(BOOL)type{
  _type = type;
  if(type){
    self.nameLab.sd_layout.topEqualToView(self.headImg);
    self.timeLab.sd_layout.heightIs(15);
  }else{
    self.nameLab.sd_layout.topSpaceToView(self, 7.5);
    self.timeLab.sd_layout.heightIs(0);
  }
}

-(void)setTime:(NSString *)time{
  _time = time;
  self.timeLab.text = self.time;
}


@end
