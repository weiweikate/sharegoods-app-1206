//
//  MineCollectCell.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/7/31.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MineCollectCell.h"
#import <SDAutoLayout.h>
@interface MineCollectCell()
@property(nonatomic, strong)UIImageView *imgView;
@property(nonatomic, strong)UILabel *titleLb;
@property(nonatomic, strong)UIButton *btn;
@property(nonatomic, strong)UIImageView *userHeaderImgView;
@property(nonatomic, strong)UILabel *userNameLb;
@end

@implementation MineCollectCell
- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.contentView.backgroundColor = [UIColor whiteColor];
    self.contentView.layer.cornerRadius = 5;
    self.contentView.clipsToBounds = YES;
    [self setUI];
    [self setConstraint];
  }
  return self;
}

- (void)setUI
{
  _imgView = [UIImageView new];
  _userHeaderImgView = [UIImageView new];
  _userHeaderImgView.layer.cornerRadius = 10;
  _userHeaderImgView.clipsToBounds = YES;
  
  _titleLb = [UILabel new];
  _titleLb.font = [UIFont systemFontOfSize:13];
  _titleLb.textColor = [UIColor colorWithHexString:@"333333"];
  
  
  _userNameLb = [UILabel new];
  _userNameLb.font = [UIFont systemFontOfSize:11];
  _userNameLb.textColor = [UIColor colorWithHexString:@"666666"];
  
  _btn = [UIButton new];
  [_btn setImage:[UIImage imageNamed:@"showCollect"] forState: UIControlStateSelected];
  [_btn setImage:[UIImage imageNamed:@"showCollectNo"] forState: 0];
  [_btn addTarget:self action:@selector(btnTap:) forControlEvents:UIControlEventTouchUpInside];
  
  [self.contentView sd_addSubviews:@[_imgView,
                                     _titleLb,
                                     _userNameLb,
                                     _userHeaderImgView,
                                     _btn]];
}

- (void)setConstraint
{
  
  _imgView.sd_layout
  .topSpaceToView(self.contentView, 0)
  .leftSpaceToView(self.contentView, 0)
  .rightSpaceToView(self.contentView, 0);
  
  _titleLb.sd_layout
  .leftSpaceToView(self.contentView, 10)
  .rightSpaceToView(self.contentView, 10)
  .autoHeightRatio(0)
  .topSpaceToView(_imgView, 10);
  
  _userHeaderImgView.sd_layout
  .heightIs(20)
  .widthIs(20)
  .leftSpaceToView(self.contentView, 10)
  .bottomSpaceToView(self.contentView, 10);
  
  _btn.sd_layout
  .heightIs(40)
  .widthIs(35)
  .rightSpaceToView(self.contentView, 0)
  .centerYEqualToView(_userHeaderImgView);
  
  _userNameLb.sd_layout
  .heightIs(20)
  .centerYEqualToView(_userHeaderImgView)
  .leftSpaceToView(_userHeaderImgView, 5)
  .rightSpaceToView(_btn, 10);
  
  _btn.imageView.sd_layout
  .heightIs(20)
  .widthIs(20)
  .centerXEqualToView(_btn)
  .centerYEqualToView(_btn);
  
  [_titleLb setMaxNumberOfLinesToShow:2];
  
}

- (void)setModel:(ShowQuery_dataModel *)model
{
  _model = model;
  _imgView.sd_layout.autoHeightRatio(1/model.aspectRatio_show);
  [_imgView setImageURL:[NSURL URLWithString:model.showImage_oss]];
  _titleLb.text = model.pureContent_1;
  _userNameLb.text = model.userInfoVO.userName;
  [_userHeaderImgView setImageWithURL:[NSURL URLWithString: model.userHeadImg_oss] placeholder:[UIImage imageNamed:@"default_avatar"]];
  _btn.selected = YES;
}

- (void)btnTap:(UIButton *)b
{
  b.selected = !b.selected;
}
@end
