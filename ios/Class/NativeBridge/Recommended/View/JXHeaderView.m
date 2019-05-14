//
//  JXHeaderView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXHeaderView.h"
#import "UIView+SDAutoLayout.h"
#import "UIImageView+WebCache.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

@interface JXHeaderView()
@property (nonatomic,strong) UIImageView * headImg;
@property (nonatomic,strong) UILabel * nameLab;
@property (nonatomic,strong) UIButton * guanBtn;
@property (nonatomic,strong) UILabel * timeLab;

@end

@implementation JXHeaderView


-(UIImageView*)headImg{
  if (!_headImg) {
    _headImg = [[UIImageView alloc] init];
//    _headImg.image = [UIImage imageNamed:@"welcome3"];
    _headImg.layer.masksToBounds = YES;
    
  }
  return _headImg;
}

-(UILabel*)nameLab{
  if(!_nameLab){
    _nameLab = [[UILabel alloc]init];
    _nameLab.font = [UIFont systemFontOfSize:13];
    _nameLab.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    _nameLab.text = @"";
  }
  return _nameLab;
}

-(UILabel*)timeLab{
  if(!_timeLab){
    _timeLab = [[UILabel alloc]init];
    _timeLab.font = [UIFont systemFontOfSize:11];
    _timeLab.textColor = [UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1.0];
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



-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];

  }
  return  self;
}

-(void)setUI{
  [self addSubview:self.headImg];
  [self addSubview:self.nameLab];
//  [self addSubview:self.guanBtn];
  [self addSubview:self.timeLab];
  
  //头像
  self.headImg.sd_layout.leftSpaceToView(self, 10)
  .topSpaceToView(self, 0)
  .widthIs(30).heightIs(30);
  self.headImg.layer.cornerRadius = self.headImg.frame.size.width/2.0;

  //昵称
  self.nameLab.sd_layout.leftSpaceToView(_headImg, 5)
  .heightIs(15).topEqualToView(_headImg);
  [_nameLab setSingleLineAutoResizeWithMaxWidth:100];

  //关注
//  [_guanBtn setTitle:@"+关注" forState:UIControlStateNormal];
//  [_guanBtn setTitle:@"已关注" forState:UIControlStateSelected];
//  [_guanBtn addTarget:self action:@selector(tapGuanzhuBtn:) forControlEvents:UIControlEventTouchUpInside];
//
//  self.guanBtn.sd_layout.centerYEqualToView(self.headImg)
//  .rightSpaceToView(self, 20)
//  .heightIs(20)
//  .widthIs(50);
  
  //发布时间
  self.timeLab.sd_layout.leftSpaceToView(_headImg, 5)
    .topSpaceToView(self.nameLab, 2)
  .heightIs(15);
    [_timeLab setSingleLineAutoResizeWithMaxWidth:200];

}

-(void)tapGuanzhuBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
  NSLog(@"tapGuanzhuBtn");
}

-(void)setUserInfoModel:(UserInfoModel *)UserInfoModel{
    _UserInfoModel = UserInfoModel;
  
    [self.headImg sd_setImageWithURL:[NSURL URLWithString:UserInfoModel.userImg] placeholderImage:[self createImageWithUIColor:[UIColor grayColor]]];
  
    if(UserInfoModel.userName.length>13){
        self.nameLab.text = [NSString stringWithFormat:@"%@...",[UserInfoModel.userName substringToIndex:13]];
    }else{
      self.nameLab.text = UserInfoModel.userName.length>0? UserInfoModel.userName:@" ";
    }
}

-(void)setTime:(NSString *)time{
  _time = time;
  self.timeLab.text = self.time;
}

- (UIImage *)createImageWithUIColor:(UIColor *)imageColor{
  CGRect rect = CGRectMake(0, 0, 1.f, 1.f);
  UIGraphicsBeginImageContext(rect.size);
  CGContextRef context = UIGraphicsGetCurrentContext();
  CGContextSetFillColorWithColor(context, [imageColor CGColor]);
  CGContextFillRect(context, rect);
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return image;
}

@end
