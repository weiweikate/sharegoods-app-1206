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
@property (nonatomic,strong) UIView * contentLabView;


@end

@implementation RecTypeCell

-(UILabel *)contentLab{
  if(!_contentLab){
    _contentLab = [[UILabel alloc]init];
    _contentLab.font = [UIFont systemFontOfSize:13];
    _contentLab.textColor = [UIColor colorWithHexString:@"666666"];
    _contentLab.userInteractionEnabled=YES;
    _contentLab.numberOfLines = 1;
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
    _picImg.clipsToBounds = YES;
    _picImg.contentMode = UIViewContentModeScaleAspectFill;


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
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"yizan"] forState:UIControlStateSelected];
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
  
  self.contentLabView = [[UIView alloc] init];
  self.contentLabView.backgroundColor = [UIColor colorWithHexString:@"F7F7F7"];
  [bgView.layer setCornerRadius:4.0];
  [self.contentView addSubview:bgView];
  
  [bgView addSubview:self.headView];
  [bgView addSubview:self.contentLabView];
  [bgView addSubview:self.zanBtn];
  [bgView addSubview:self.zanNum];
  [bgView addSubview:self.shareBtn];
  [self.contentLabView addSubview:self.picImg];
  [self.contentLabView addSubview:self.contentLab];

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
  
  //内容背景
  self.contentLabView.sd_layout.topSpaceToView(self.headView,10 )
  .leftSpaceToView(bgView, 45)
  .rightSpaceToView(bgView, 10);
  
  [self.contentLabView setupAutoHeightWithBottomView:_contentLab bottomMargin:10];
  
  //图片
  self.picImg.sd_layout.topSpaceToView(self.contentLabView, 0)
  .leftSpaceToView(self.contentLabView, 0)
  .rightSpaceToView(self.contentLabView, 0)
  .autoHeightRatio(0.56);
  self.picImg.layer.cornerRadius = 5;
  
  self.contentLab.sd_layout.topSpaceToView(self.picImg,10)
  .leftSpaceToView(self.contentLabView, 10).rightSpaceToView(self.contentLabView, 10)
  .heightIs(20);
  
  //点赞
  [_zanBtn addTarget:self action:@selector(tapZanBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.zanBtn.sd_layout.topSpaceToView(self.contentLabView,10)
  .leftSpaceToView(bgView, 45)
   .widthIs(26).heightIs(26);

  self.zanNum.sd_layout.centerYEqualToView(self.zanBtn)
  .leftSpaceToView(self.zanBtn, 1)
  .widthIs(40).heightIs(26);
  
  //分享/转发
  [_shareBtn addTarget:self action:@selector(tapShareBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.shareBtn.sd_layout.centerYEqualToView(self.zanBtn)
  .rightSpaceToView(bgView,15)
  .widthIs(70).heightIs(26);
  
  [bgView setupAutoHeightWithBottomView:self.shareBtn bottomMargin:5];
  [self setupAutoHeightWithBottomView:bgView bottomMargin:5];
}

-(void)setModel:(JXModelData *)model{
  _model = model;
  self.headView.UserInfoModel = model.userInfoVO;
  _zanBtn.selected = model.like;
  _zanNum.text =  [self zanNumWithFormat:self.model.likesCount];
  
  NSString* imageUrl = [[NSString alloc]init];
  for(SourcesModel *obj in model.resource){
    if(obj.type==1){
      imageUrl= [obj valueForKey: @"url"];
    }
  }
  if(imageUrl.length>0){
  
  [self.picImg sd_setImageWithURL:[NSURL URLWithString:imageUrl] placeholderImage:[UIImage imageWithColor:[UIColor colorWithHexString:@"f5f5f5"]]];
    self.contentLab.text = model.title;
  }else{
    self.picImg.sd_layout.autoHeightRatio(0);
    self.contentLab.text = model.title;
  }
}


-(void)tapZanBtn:(UIButton*)sender{
  if(self.recTypeDelegate){
    [self.recTypeDelegate zanBtnClick:self];
  }
  self.zanBtn.selected = !self.zanBtn.selected;
  self.zanNum.text = [self zanNumWithFormat:self.model.likesCount];
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

-(NSString*)zanNumWithFormat:(NSInteger)count{
  NSString * num = @"";
  if(count<999){
    num = [NSString stringWithFormat:@"%ld",count>0?count:0];
  }else if(count<100000){
    num = @"999+";
  }else{
    num = @"10w+";
  }
  return num;
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
