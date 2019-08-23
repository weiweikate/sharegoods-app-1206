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
#import "NetWorkTool.h"

@interface MBVideoHeaderView()
@property (nonatomic,strong) UIImageView * goBackImg;
@property (nonatomic,strong) UIImageView * headImg;
@property (nonatomic,strong) UILabel * nameLab;
@property (nonatomic,strong) UIButton * guanBtn;
@property (nonatomic,strong) UILabel * hotLab;
@property (nonatomic,strong) UIImageView * shareImg;
@property (nonatomic,strong) UIView * hgImg;

@end

@implementation MBVideoHeaderView
-(UIImageView*)goBackImg{
  if (!_goBackImg) {
    _goBackImg = [[UIImageView alloc] init];
    _goBackImg.userInteractionEnabled = YES;//打开用户交互
    _goBackImg.image = [UIImage imageNamed:@"videoGoback"];
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(goBack)];
    [_goBackImg addGestureRecognizer:tapGesture];
    _goBackImg.layer.masksToBounds = YES;
    
  }
  return _goBackImg;
}

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
    _shareImg.image = [UIImage imageNamed:@"videoShare"];
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
    _nameLab.text = @"";
  }
  return _nameLab;
}

-(UILabel*)hotLab{
  if(!_hotLab){
    _hotLab = [[UILabel alloc]init];
    _hotLab.font = [UIFont systemFontOfSize:11];
    _hotLab.textColor =[UIColor whiteColor];
    _hotLab.text = @"";
  }
  return _hotLab;
}

-(UIButton*)guanBtn{
  if(!_guanBtn){
    _guanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    //关注
    [_guanBtn setBackgroundImage:[UIImage imageNamed:@"vGuanzhu"] forState:UIControlStateNormal];
    [_guanBtn setBackgroundImage:[self createImageWithColor:[UIColor colorWithHexString:@"FFF5CC"]] forState:UIControlStateSelected];
    
    [_guanBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [_guanBtn setTitleColor:[UIColor colorWithHexString:@"FF9502"] forState:UIControlStateSelected];
    
    [_guanBtn setTitle:@"关注" forState:UIControlStateNormal];
    [_guanBtn setTitle:@"已关注" forState:UIControlStateSelected];
    
    _guanBtn.titleLabel.font = [UIFont systemFontOfSize:13];
    _guanBtn.layer.cornerRadius = 14;
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
  UIImageView *hotImage = [[UIImageView alloc]initWithImage:[UIImage imageNamed:@"videoHot"]];
  
  [self addSubview:self.hgImg];
  [self addSubview:self.goBackImg];
  [self addSubview:self.headImg];
  [self addSubview:self.nameLab];
  [self addSubview:self.guanBtn];
  [self addSubview:self.shareImg];
  [self addSubview:self.hotLab];
  [self addSubview:hotImage];
  //背景
  self.hgImg.sd_layout.leftEqualToView(self)
  .topSpaceToView(self, 0)
  .widthIs(KScreenWidth).heightIs(100);
  
  //返回
  self.goBackImg.sd_layout.leftSpaceToView(self, 15)
  .topSpaceToView(self, kStatusBarHeight+7)
  .widthIs(20).heightIs(20);
  
  
  //头像
  self.headImg.sd_layout.leftSpaceToView(self.goBackImg, 10)
  .centerYEqualToView(self.goBackImg)
  .widthIs(30).heightIs(30);
  self.headImg.layer.cornerRadius = self.headImg.frame.size.width/2.0;
  
  //昵称
  self.nameLab.sd_layout.leftSpaceToView(_headImg, 10)
  .heightIs(15).topEqualToView(self.headImg);
  [_nameLab setSingleLineAutoResizeWithMaxWidth:150];
  
  //热度
  hotImage.sd_layout.leftSpaceToView(_headImg, 10)
  .topSpaceToView(self.nameLab, 2)
  .heightIs(15).widthIs(15);
  
  self.hotLab.sd_layout.leftSpaceToView(hotImage, 2)
  .centerYEqualToView(hotImage)
  .heightIs(15);
  [self.hotLab setSingleLineAutoResizeWithMaxWidth:150];
  
  //关注
    [_guanBtn addTarget:self action:@selector(tapGuanzhuBtn:) forControlEvents:UIControlEventTouchUpInside];
  
    self.guanBtn.sd_layout.centerYEqualToView(self.headImg)
    .rightSpaceToView(self, 50)
    .heightIs(28)
    .widthIs(65);
  
  self.shareImg.sd_layout.centerYEqualToView(self.headImg)
  .rightSpaceToView(self, 18)
  .heightIs(20)
  .widthIs(20);
  
  
}

-(void)clickHeaderImg{
  if(self.dataDelegate){
    [self.dataDelegate headerClick:self.model];
  }
}

  //分享
-(void)clickShareImg{
  if(self.dataDelegate){
    [self.dataDelegate shareClick:self.model];
  }
}

  //关注
-(void)tapGuanzhuBtn:(UIButton*)sender{
  MBModelData* modeltemp = self.model;
  if(self.isLogin){
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary* dic = [[NSMutableDictionary alloc]init];
  
    if(modeltemp.userInfoVO&&modeltemp.userInfoVO.userNo&&[defaults dictionaryForKey:@"guanzhu"]){
      [dic setValuesForKeysWithDictionary:[defaults dictionaryForKey:@"guanzhu"]];
      [dic setObject:sender.isSelected?@"NO":@"YES" forKey:modeltemp.userInfoVO.userNo];
      [defaults setObject:dic forKey:@"guanzhu"];
      [defaults synchronize];
    }else{
      [dic setObject:sender.isSelected?@"NO":@"YES" forKey:modeltemp.userInfoVO.userNo];
      [defaults setObject:dic forKey:@"guanzhu"];
      [defaults synchronize];
    }
    sender.selected = !sender.selected;
    if(sender.selected){
      [self follow:modeltemp.userInfoVO.userNo];
    }else{
      [self cancelFollow:modeltemp.userInfoVO.userNo];
    }
    modeltemp.attentionStatus = sender.selected;
  }
  if(self.dataDelegate){
    [self.dataDelegate guanzhuClick:modeltemp];
  }
}

  //返回
-(void)goBack{
  if(self.dataDelegate){
    [self.dataDelegate goBack];
  }
}

-(void)setModel:(MBModelData *)model{
  _model = model;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  if(model.userInfoVO){
    self.nameLab.text = model.userInfoVO.userName?model.userInfoVO.userName:@"";
    
    [self.headImg sd_setImageWithURL:[NSURL URLWithString:[model.userInfoVO.userImg getUrlAndWidth:30 height:30]] placeholderImage:[UIImage imageNamed:@"default_avatar"]];
    
    if(model.userInfoVO.userNo){
      NSMutableDictionary* dic = [[NSMutableDictionary alloc]init];
      if(model.userInfoVO.userNo&&[defaults dictionaryForKey:@"guanzhu"]){
        [dic setValuesForKeysWithDictionary:[defaults dictionaryForKey:@"guanzhu"]];
        if([dic valueForKey:model.userInfoVO.userNo]&&[[dic valueForKey:model.userInfoVO.userNo] isEqualToString:@"YES"]){
          self.guanBtn.selected = YES;
        }else{
          self.guanBtn.selected = NO;
        }
      }else{
        self.guanBtn.selected = model.attentionStatus!=0?YES:NO;
      }
    }
  }
  if(model.hotCount){
    self.hotLab.text = [NSString stringWithFormat:@"%@人气值",[NSString stringWithNumber:model.hotCount]];
  }
}


#pragma arguments - Networking

  //关注请求
-(void)follow:(NSString*)userNo{
  [NetWorkTool requestWithURL:@"/social/show/user/follow@POST" params:@{@"userNo":userNo} toModel:nil success:^(NSDictionary* result) {
    NSLog(@"success");
  } failure:^(NSString *msg, NSInteger code) {
    NSLog(@"failure");
  } showLoading:nil];
}

  //取消关注
-(void)cancelFollow:(NSString*)userNo{
  [NetWorkTool requestWithURL:@"/social/show/user/cancel/follow@POST" params:@{@"userNo":userNo} toModel:nil success:^(NSDictionary* result) {
    NSLog(@"success");
  } failure:^(NSString *msg, NSInteger code) {
    NSLog(@"failure");
  } showLoading:nil];
}

//UIColor 转UIImage（UIImage+YYAdd.m也是这种实现）
- (UIImage*) createImageWithColor: (UIColor*) color
{
  CGRect rect=CGRectMake(0.0f, 0.0f, 65.0f, 28.0f);
  UIGraphicsBeginImageContext(rect.size);
  CGContextRef context = UIGraphicsGetCurrentContext();
  CGContextSetFillColorWithColor(context, [color CGColor]);
  CGContextFillRect(context, rect);
  UIImage *theImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return theImage;
}
@end
