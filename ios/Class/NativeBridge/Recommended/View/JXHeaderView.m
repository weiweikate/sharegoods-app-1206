//
//  JXHeaderView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXHeaderView.h"
#import "UIView+SDAutoLayout.h"
#import "NSString+OpenAndClose.h"

@implementation JXHeaderView

-(UIImageView*)headImg{
  if (!_headImg) {
    _headImg = [[UIImageView alloc] init];
    _headImg.image = [UIImage imageNamed:@"welcome3"];
    
  }
  return _headImg;
}

-(UILabel*)nameLab{
  if(!_nameLab){
    _nameLab = [[UILabel alloc]init];
    _nameLab.font = [UIFont systemFontOfSize:13];
    _nameLab.text = @"friend";
  }
  return _nameLab;
}

-(UILabel*)timeLab{
  if(!_timeLab){
    _timeLab = [[UILabel alloc]init];
    _timeLab.font = [UIFont systemFontOfSize:11];
    _timeLab.textColor = [UIColor lightGrayColor];
    _timeLab.text = @"2小时前";
  }
  return _timeLab;
}

-(UIButton*)guanBtn{
  if(!_guanBtn){
    _guanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _guanBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [_guanBtn setTitleColor:[UIColor orangeColor] forState:UIControlStateNormal];
    _guanBtn.layer.cornerRadius = 10;
    _guanBtn.layer.borderWidth = 1;
    _guanBtn.layer.masksToBounds = YES;
  }
  return _guanBtn;
}

-(UILabel*)contentLab{
  if(!_contentLab){
    _contentLab = [[UILabel alloc]initWithFrame:CGRectMake(0, 0, 200, 0)];
    _contentLab.font = [UIFont systemFontOfSize:16];
    _contentLab.textColor = [UIColor blackColor];
    _contentLab.backgroundColor = [UIColor redColor];
    _contentLab.numberOfLines = 0;
    //调整frame
    [_contentLab sizeToFit];
  }
  return _contentLab;
}

-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];
//    self.backgroundColor = [UIColor yellowColor];

  }
  return  self;
}

-(void)setUI{
  [self addSubview:self.headImg];
  [self addSubview:self.nameLab];
  [self addSubview:self.guanBtn];
  [self addSubview:self.timeLab];

  [self addSubview:self.contentLab];
  //头像
  self.headImg.sd_layout.leftSpaceToView(self, 10)
  .topSpaceToView(self, 0)
  .widthIs(30).heightIs(30);
  
  //昵称
  self.nameLab.sd_layout.leftSpaceToView(_headImg, 5)
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
  self.timeLab.sd_layout.leftSpaceToView(_headImg, 5)
  .topSpaceToView(self.nameLab, 5)
  .heightIs(20);
  [_timeLab setSingleLineAutoResizeWithMaxWidth:200];
  
  //内容
  self.contentLab.sd_layout.topSpaceToView(self.headImg, 10)
  .leftSpaceToView(self, 20)
  .rightSpaceToView(self, 20);
  
}

-(void)tapGuanzhuBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
  NSLog(@"tapGuanzhuBtn");
}

@end
