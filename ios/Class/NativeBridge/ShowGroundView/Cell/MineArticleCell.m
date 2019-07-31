//
//  MineArticleCell.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/7/31.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MineArticleCell.h"
#import <SDAutoLayout.h>
#import "NetWorkTool.h"
#import "MBProgressHUD+PD.h"
@interface MineArticleCell()
@property(nonatomic, strong)UIImageView *imgView;
@property(nonatomic, strong)UILabel *titleLb;
@property(nonatomic, strong)UILabel *statusLb;
@property(nonatomic, strong)UIImageView *maskImgView;
@property(nonatomic, strong)UIButton *btn;
@end

@implementation MineArticleCell
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
  
  _titleLb = [UILabel new];
  _titleLb.font = [UIFont systemFontOfSize:13];
  _titleLb.textColor = [UIColor colorWithHexString:@"333333"];
  
  _statusLb = [UILabel new];
  _statusLb.font = [UIFont systemFontOfSize:12];
  
  _maskImgView = [UIImageView new];
  _maskImgView.image = [UIImage imageNamed:@"pingbi"];
  _maskImgView.hidden = YES;
  
  _btn = [UIButton new];
  [_btn setImage:[UIImage imageNamed:@"icon_delete"] forState:0];
  [_btn addTarget:self action:@selector(btnTap:) forControlEvents:UIControlEventTouchUpInside];
  
  [self.contentView sd_addSubviews:@[_imgView,
                                     _titleLb,
                                     _statusLb,
                                     _maskImgView,
                                     _btn]];
}

- (void)setConstraint
{
  _statusLb.sd_layout
  .heightIs(35)
  .widthIs(200)
  .leftSpaceToView(self.contentView, 10)
  .bottomSpaceToView(self.contentView, 0);
  
  _btn.sd_layout
  .heightIs(35)
  .widthIs(35)
  .rightSpaceToView(self.contentView, 10)
  .centerYEqualToView(_statusLb);
  
  _imgView.sd_layout
  .topSpaceToView(self.contentView, 0)
  .leftSpaceToView(self.contentView, 0)
  .rightSpaceToView(self.contentView, 0);
  
  _titleLb.sd_layout
  .leftSpaceToView(self.contentView, 10)
  .rightSpaceToView(self.contentView, 10)
  .autoHeightRatio(0)
  .topSpaceToView(_imgView, 10);
  
  [_titleLb setMaxNumberOfLinesToShow:2];
  
  _maskImgView.sd_layout
  .centerXEqualToView(_imgView)
  .centerYEqualToView(_imgView)
  .heightIs(120)
  .widthIs(120);
  
}

- (void)setModel:(ShowQuery_dataModel *)model
{
  _model = model;
  _imgView.sd_layout.autoHeightRatio(1/model.aspectRatio_show);
  [_imgView setImageURL:[NSURL URLWithString:model.showImage_oss]];
  _titleLb.text = model.pureContent_1;
  
  NSString * statusStr = @"";
  NSString * color = @"#999999";
  if(self.model.status==1){
    statusStr = @"已发布";
    color = @"#FF0050";
  }else if (self.model.status==2){
    statusStr = @"审核中";
    color = @"#3187FF";
  }else if (self.model.status==3){
    statusStr = @"已屏蔽";
    color = @"#999999";
  }else if (self.model.status==5){
    statusStr = @"转码中";
    color = @"#3187FF";
  }
  
  _statusLb.text = statusStr;
  _statusLb.textColor = [UIColor colorWithHexString:color];
  if (model.status==3||model.status==4) {
    _statusLb.alpha = 0.5;
    _imgView.alpha = 0.5;
    _titleLb.alpha = 0.5;
    _maskImgView.hidden = NO;
  }else{
    _statusLb.alpha = 1;
    _imgView.alpha = 1;
    _titleLb.alpha = 1;
    _maskImgView.hidden = YES;
  }
}

- (void)btnTap:(UIButton *)b
{
  
  UIAlertController *alterController = [UIAlertController alertControllerWithTitle:@"温馨提示"
                                                                           message:@"确定删除这条动态吗？"
                                                                    preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"再想想"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                         
                                                       }];
  UIAlertAction *actionSubmit = [UIAlertAction actionWithTitle:@"狠心删除"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                         [self deletehData];
                                                       }];
  [alterController addAction:actionSubmit];
  [alterController addAction:actionCancel];
  [self.currentViewController_XG  presentViewController:alterController animated:YES completion:nil];
}

/**
 删除文章数据
 */
- (void)deletehData
{
  if(_model.showNo){
    __weak MineArticleCell * weak_self  = self;
    [NetWorkTool requestWithURL:@"/social/show/content/delete@POST" params:@{@"showNo": _model.showNo}  toModel:nil success:^(NSDictionary* result) {
      if (weak_self.deleteBlock) {
        weak_self.deleteBlock(weak_self.model);
      }
    } failure:^(NSString *msg, NSInteger code) {
      [MBProgressHUD showSuccess:msg];
    } showLoading:@""];
  }
}
@end
