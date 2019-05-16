//
//  RecTypeCellTableViewCell.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/5.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecTypeCell.h"
#import "UIView+SDAutoLayout.h"
#import "View/JXHeaderView.h"
#import "UIImageView+WebCache.h"

@interface RecTypeCell()

@property (nonatomic,strong)JXHeaderView* headView;
@property (nonatomic,strong) UILabel * contentLab;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UIButton * shareBtn;
@property (nonatomic,strong) UILabel * zanNum;
@property (nonatomic,strong) UIImageView * picImg;

@end

@implementation RecTypeCell

-(UILabel *)contentLab{
  if(!_contentLab){
    _contentLab = [[UILabel alloc]init];
    _contentLab.font = [UIFont systemFontOfSize:13];
    _contentLab.textColor = [UIColor colorWithRed:102/255.0 green:102/255.0 blue:102/255.0 alpha:1.0];
    _contentLab.userInteractionEnabled=YES;
    UITapGestureRecognizer *labelTapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(labelTouchUpInside)];
    
    [_contentLab addGestureRecognizer:labelTapGestureRecognizer];
  }
  return _contentLab;
}

-(JXHeaderView *)headView{
  if (!_headView) {
    _headView = [[JXHeaderView alloc] init];
  }
  return _headView;
}

-(UIImageView *)picImg{
  
  if(!_picImg){
    _picImg = [[UIImageView alloc] init];
    _picImg.layer.masksToBounds = YES;

  }
  return _picImg;
}


-(UILabel *)zanNum{
  if(!_zanNum){
    _zanNum = [[UILabel alloc]init];
    _zanNum.font = [UIFont systemFontOfSize:10];
    _zanNum.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
  }
  return _zanNum;
}

-(UIButton*)zanBtn{
  if(!_zanBtn){
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"zan"] forState:UIControlStateNormal];
    
  }
  return _zanBtn;
}

-(UIButton*)shareBtn{
  if(!_shareBtn){
    _shareBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_shareBtn setImage:[UIImage imageNamed:@"fenxiang"] forState:UIControlStateNormal];
  }
  return _shareBtn;
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
  
  [bgView addSubview:self.headView];
  [bgView addSubview:self.picImg];
  [bgView addSubview:self.contentLab];
  [bgView addSubview:self.zanBtn];
  [bgView addSubview:self.zanNum];
  [bgView addSubview:self.shareBtn];
  
  bgView.sd_layout
  .leftSpaceToView(self.contentView, 0)
  .rightSpaceToView(self.contentView, 0)
  .topSpaceToView(self.contentView, 5)
  .autoHeightRatio(0);
  
  self.headView.sd_layout
  .topSpaceToView(bgView, 9)
  .leftSpaceToView(bgView, 0)
  .rightSpaceToView(bgView, 5)
  .heightIs(34);
  

  
  //图片
  self.picImg.backgroundColor = [UIColor redColor];
  self.picImg.sd_layout.topSpaceToView(self.headView, 10)
  .leftSpaceToView(bgView, 45)
  .rightSpaceToView(bgView, 15)
  .heightIs(160);
  self.picImg.layer.cornerRadius = 5;
  
  //内容
  self.contentLab.sd_layout.topSpaceToView(self.picImg, 8)
  .leftSpaceToView(bgView, 45)
  .rightSpaceToView(bgView, 30)
  .autoHeightRatio(0);
  [self.contentLab setMaxNumberOfLinesToShow:2];
  
  //点赞
  [_zanBtn addTarget:self action:@selector(tapZanBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.zanBtn.sd_layout.topSpaceToView(self.contentLab,10)
  .leftSpaceToView(bgView, 45)
   .widthIs(25).heightIs(25);

  self.zanNum.sd_layout.centerYEqualToView(self.zanBtn)
  .leftSpaceToView(self.zanBtn, 1)
  .widthIs(40).heightIs(25);
  
  //分享/转发
  [_shareBtn addTarget:self action:@selector(tapShareBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.shareBtn.sd_layout.centerYEqualToView(self.zanBtn)
  .rightSpaceToView(bgView,15)
  .widthIs(60).heightIs(25);
  
  [bgView setupAutoHeightWithBottomView:self.shareBtn bottomMargin:5];
  [self setupAutoHeightWithBottomView:bgView bottomMargin:5];
}

-(void)setModel:(JXModelData *)model{
  _model = model;
  self.headView.UserInfoModel = model.userInfoVO;
  if(model.like){
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"yizan"] forState:UIControlStateNormal];
    
  }else{
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"zan"] forState:UIControlStateNormal];
  }
  NSString * num = @"";
    if(model.likesCount<999){
      num = [NSString stringWithFormat:@"%ld",model.likesCount];
    }else if(model.likesCount<100000){
      num = @"999+";
    }else{
      num = @"10w+";
    }
  _zanNum.text = num;
  [self.picImg sd_setImageWithURL:[NSURL URLWithString:[model.products[0] valueForKey: @"imgUrl"]] placeholderImage:[UIImage imageNamed:@"default_avatar"]];
  self.contentLab.text = model.content;
  
}


-(void)tapZanBtn:(UIButton*)sender{
  if(self.recTypeDelegate){
    [self.recTypeDelegate zanBtnClick:self];
  }
}

-(void)tapShareBtn:(UIButton*)sender{
  if(self.recTypeDelegate){
    [self.recTypeDelegate shareBtnClick:self];
  }
}

-(void)labelTouchUpInside{
  if(self.recTypeDelegate){
    [self.recTypeDelegate clickLabel:self];
  }
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
