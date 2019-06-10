//
//  ActivityCell.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActivityCell.h"
#import "UIView+SDAutoLayout.h"
#import "View/JXHeaderView.h"
#import "UIImageView+WebCache.h"

@interface ActivityCell()
@property (nonatomic,strong) UIImageView * picImg;
@property (nonatomic,strong) UIImageView * headerImg;
@property (nonatomic,strong) UILabel * nameLab;
@property (nonatomic,strong) UIImageView * guanzhu;
@property (nonatomic,strong) UILabel * guanzhuNum;

@end

@implementation ActivityCell

-(UIImageView *)picImg{
  
  if(!_picImg){
    _picImg = [[UIImageView alloc] init];
    _picImg.layer.masksToBounds = YES;
  }
  return _picImg;
}

-(UILabel *)nameLab{
  if(!_nameLab){
    _nameLab = [[UILabel alloc]init];
    _nameLab.font = [UIFont systemFontOfSize:10];
    _nameLab.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    _nameLab.text = @"zjx";
  }
  return _nameLab;
}

-(UIImageView *)headerImg{
  
  if(!_headerImg){
    _headerImg = [[UIImageView alloc] init];
    _headerImg.layer.masksToBounds = YES;
    
  }
  return _headerImg;
}

-(UIImageView *)guanzhu{
  
  if(!_guanzhu){
    _guanzhu = [[UIImageView alloc] init];
    _guanzhu.layer.masksToBounds = YES;
  }
  return _guanzhu;
}

-(UILabel *)guanzhuNum{
  if(!_guanzhuNum){
    _guanzhuNum = [[UILabel alloc]init];
    _guanzhuNum.font = [UIFont systemFontOfSize:10];
    _guanzhuNum.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    _guanzhuNum.text = @"1000";
  }
  return _nameLab;
}

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
  
  if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    self.contentView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
    [self setUI];
  }
  
  return self;
}

-(void)setUI{
  UIView*  bgView = [[UIView alloc] init];
  bgView.backgroundColor =  [UIColor colorWithRed:255/255.0 green:255/255.0 blue:255/255.0 alpha:1.0];
  [bgView.layer setCornerRadius:4.0];
  [self.contentView addSubview:bgView];
  
  [bgView addSubview:self.headerImg];
  [bgView addSubview:self.picImg];
  [bgView addSubview:self.nameLab];
  
  bgView.sd_layout
  .leftSpaceToView(self.contentView, 10)
  .rightSpaceToView(self.contentView, 10)
  .topSpaceToView(self.contentView, 5)
  .autoHeightRatio(0);
  
  //图片
  self.picImg.backgroundColor = [UIColor redColor];
  self.picImg.sd_layout.topSpaceToView(bgView, 10)
  .leftSpaceToView(bgView, 15)
  .rightSpaceToView(bgView, 15)
  .heightIs(160);
  self.picImg.layer.cornerRadius = 5;
  
  //头像
  self.headerImg.sd_layout.topSpaceToView(_picImg, 9)
  .leftSpaceToView(bgView, 0)
  .heightIs(34);
  
  //昵称
  self.nameLab.sd_layout.centerYEqualToView(self.headerImg)
  .leftSpaceToView(self.headerImg, 45)
  .rightSpaceToView(bgView, 30)
  .autoHeightRatio(0);
  

  
  //图片
  self.picImg.backgroundColor = [UIColor redColor];
  self.picImg.sd_layout.centerYEqualToView(self.headerImg)
  .leftSpaceToView(bgView, 45)
  .rightSpaceToView(bgView, 15)
  .heightIs(160);
  self.picImg.layer.cornerRadius = 5;
  
  //关注
  self.headerImg.sd_layout
  .topSpaceToView(_picImg, 9)
  .leftSpaceToView(bgView, 0)
  .heightIs(34);
  
  //关注数
  self.nameLab.sd_layout.centerYEqualToView(self.headerImg)
  .leftSpaceToView(self.headerImg, 45)
  .rightSpaceToView(bgView, 30)
  .autoHeightRatio(0);
  
  
  [bgView setupAutoHeightWithBottomView:self.headerImg bottomMargin:5];
  [self setupAutoHeightWithBottomView:bgView bottomMargin:5];
}

-(void)setModel:(JXModel *)model{
  _model = model;
;
//  [self.picImg sd_setImageWithURL:[NSURL URLWithString:[model.products[0] valueForKey: @"image"]] placeholderImage:[self createImageWithUIColor:[UIColor grayColor]]];
}



- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
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
