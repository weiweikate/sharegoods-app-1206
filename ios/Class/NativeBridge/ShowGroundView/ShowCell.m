//
//  ShowCell.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/20.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowCell.h"
#import  <SDAutoLayout.h>
@interface ShowCell()
@property(nonatomic, strong)UIImageView *imageView;
@property(nonatomic, strong)UILabel *numLb;
@property(nonatomic, strong)UIImageView *headimgView;
@property(nonatomic, strong)UILabel *titleLb;
@property(nonatomic, strong)UILabel *timeLb;
@property(nonatomic, strong)UILabel *authorLb;
@end
@implementation ShowCell

- (UIImageView *)imageView
{
  if (!_imageView) {
    _imageView = [UIImageView  new];
    [self.contentView addSubview:_imageView];
    _imageView.sd_layout
    .spaceToSuperView(UIEdgeInsetsMake(0, 0, 90, 0));
  }
  return _imageView;
}

- (UIImageView *)headimgView
{
  if (!_headimgView) {
    _headimgView = [UIImageView  new];
    _headimgView.layer.cornerRadius = 15;
    _headimgView.clipsToBounds = YES;
    [self.contentView addSubview:_headimgView];
    _headimgView.sd_layout
    .leftSpaceToView(self.contentView, 10)
    .bottomSpaceToView(self.contentView, 8)
    .heightIs(30)
    .widthIs(30);
  }
  return _headimgView;
}

- (UILabel *)titleLb
{
  if (!_titleLb) {
    _titleLb = [UILabel new];
    _titleLb.textColor = [UIColor colorWithHexString:@"333333"];
    _titleLb.font = [UIFont systemFontOfSize:12];
    [self.contentView addSubview:_titleLb];
    _titleLb.sd_layout
    .topSpaceToView(self.imageView, 10)
    .leftSpaceToView(self.contentView, 10)
    .rightSpaceToView(self.contentView, 14)
    .autoHeightRatio(0);
    [_titleLb setMaxNumberOfLinesToShow:2];
  }
  return _titleLb;
}

- (UILabel *)authorLb
{
  if (!_authorLb) {
    _authorLb = [UILabel new];
    _authorLb.textColor = [UIColor colorWithHexString:@"666666"];
    _authorLb.font = [UIFont systemFontOfSize:11];
    [self.contentView addSubview:_authorLb];
    _authorLb.sd_layout
    .centerYEqualToView(self.headimgView)
    .leftSpaceToView(self.headimgView, 6)
    .heightIs(20)
    .rightSpaceToView(self.timeLb, 3);
  }
  return _authorLb;
}


- (UILabel *)timeLb
{
  if (!_timeLb) {
    _timeLb = [UILabel new];
    _timeLb.textColor = [UIColor colorWithHexString:@"999999"];
    _timeLb.font = [UIFont systemFontOfSize:11];
    [self.contentView addSubview:_timeLb];
    _timeLb.sd_layout
    .centerYEqualToView(self.headimgView)
    .rightSpaceToView(self.contentView, 14)
    .heightIs(20);
    [_timeLb setSingleLineAutoResizeWithMaxWidth:80];
  }
  return _timeLb;
}

- (UILabel *)numLb
{
  if (!_numLb) {
    UIImageView *seeImgView = [UIImageView new];
    seeImgView.image = [UIImage imageNamed:@"see_white"];
    [self.imageView addSubview:seeImgView];
    seeImgView.sd_layout
    .heightIs(10)
    .widthIs(15)
    .leftSpaceToView(self.imageView, 10)
    .bottomSpaceToView(self.imageView, 10);
    
    _numLb = [UILabel new];
    _numLb.textColor = [UIColor colorWithHexString:@"FFFFFF"];
    _numLb.font = [UIFont systemFontOfSize:10];
    [self.imageView addSubview:_numLb];
    _numLb.sd_layout
    .centerYEqualToView(seeImgView)
    .rightSpaceToView(self.imageView, 14)
    .heightIs(20)
    .leftSpaceToView(seeImgView, 3);
  }
  return _numLb;
}

- (void)setModel:(ShowQuery_dataModel *)model
{
  _model = model;
  [self.imageView setImageWithURL:[NSURL URLWithString:model.showImage]
                      placeholder:[UIImage imageNamed:@""]];
  [self.headimgView setImageWithURL:[NSURL URLWithString:model.userHeadImg]
                        placeholder:[UIImage imageNamed:@""]];
  self.titleLb.text = model.title;
  self.timeLb.text = model.time;
  self.authorLb.text = model.userName;
  self.numLb.text = model.readNumber > 999999 ?
                    @"999999+" :
                    [NSString stringWithFormat:@"%ld", model.readNumber];
}
@end
