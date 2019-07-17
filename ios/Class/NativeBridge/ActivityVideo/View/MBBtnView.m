//
//  MBBtnView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MBBtnView.h"
#import "UIView+SDAutoLayout.h"

@interface MBBtnView()
@property (nonatomic,strong) UIImageView * downloadBtn;
@property (nonatomic,strong) UIImageView * collectionBtn;
@property (nonatomic,strong) UIImageView * zanBtn;
@property (nonatomic,strong) UILabel * downLoadNum;
@property (nonatomic,strong) UILabel * collectionNum;
@property (nonatomic,strong) UILabel * zanNum;

@property (nonatomic) UIImageView *playImageView;        //播放按钮

@end

@implementation MBBtnView
- (UIImageView *)playerImage {
  if (!_playerImage) {
    _playerImage = [[UIImageView alloc] init];
  }
  return _playImageView;
}

- (UIImageView *)playImageView {
  if (!_playImageView) {
    _playImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"vedio"]];
    _playImageView.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickPlay)];
    [_playImageView addGestureRecognizer:tapGesture];
  }
  return _playImageView;
}

- (instancetype)init {
  self = [super init];
  
  if (self) {
    [self setUI];
  }
  
  return self;
}

-(void)setUI{
  
  UIView * downloadView = [[UIView alloc]init];
  [downloadView addSubview:self.downloadBtn];
  [downloadView addSubview:self.downLoadNum];
  
  UIView * collectionView = [[UIView alloc]init];
  [collectionView addSubview:self.collectionBtn];
  [collectionView addSubview:self.collectionNum];
  
  UIView * zanView = [[UIView alloc]init];
  [zanView addSubview:self.zanBtn];
  [zanView addSubview:self.zanNum];
  
  [self sd_addSubviews:@[downloadView,collectionView,zanView,self.playImageView]];
  
  self.playImageView.sd_layout.centerXEqualToView(self).centerYEqualToView(self)
  .widthIs(80).heightIs(80);
  
  collectionView.sd_layout.centerYEqualToView(self)
  .rightSpaceToView(self, 20).widthIs(32);
  
  self.collectionBtn.sd_layout.centerXEqualToView(collectionView)
  .topEqualToView(collectionView).widthIs(30).heightIs(30);
  
  self.collectionNum.sd_layout.centerXEqualToView(self.collectionBtn)
  .topSpaceToView(self.collectionBtn, 7).widthIs(30).heightIs(20);
  
  [collectionView setupAutoHeightWithBottomView:self.collectionNum bottomMargin:2];

  downloadView.sd_layout.centerXEqualToView(collectionView)
  .bottomSpaceToView(collectionView,15).widthIs(32);
  
  self.downloadBtn.sd_layout.centerXEqualToView(downloadView)
  .topEqualToView(downloadView).widthIs(30).heightIs(30);
  
  self.downLoadNum.sd_layout.centerXEqualToView(self.downloadBtn)
  .topSpaceToView(self.downloadBtn, 7).widthIs(30).heightIs(20);

  [downloadView setupAutoHeightWithBottomView:self.downLoadNum bottomMargin:2];
  
  zanView.sd_layout.centerXEqualToView(collectionView)
  .topSpaceToView(collectionView,15).widthIs(32);
  
  self.zanBtn.sd_layout.centerXEqualToView(zanView)
  .topEqualToView(zanView).widthIs(30).heightIs(30);
  
  self.zanNum.sd_layout.centerXEqualToView(self.zanBtn)
  .topSpaceToView(self.zanBtn, 7).widthIs(30).heightIs(20);

  [zanView setupAutoHeightWithBottomView:self.zanNum bottomMargin:2];
}


#pragma mark - Custom Accessors

-(UIImageView*)downloadBtn{
  if (!_downloadBtn) {
    _downloadBtn = [[UIImageView alloc] init];
    _downloadBtn.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickDownLoad)];
    [_downloadBtn addGestureRecognizer:tapGesture];
    _downloadBtn.layer.masksToBounds = YES;
    _downloadBtn.image = [UIImage imageNamed:@"hot"];
    
  }
  return _downloadBtn;
}

-(UILabel *)downLoadNum{
  if(!_downLoadNum){
    _downLoadNum = [[UILabel alloc]init];
    _downLoadNum.font = [UIFont systemFontOfSize:13];
    _downLoadNum.textColor =[UIColor whiteColor];
    _downLoadNum.text = @"14万";
  }
  return _downLoadNum;
}

-(UIImageView*)collectionBtn{
  if (!_collectionBtn) {
    _collectionBtn = [[UIImageView alloc] init];
    _collectionBtn.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clicCollection)];
    [_collectionBtn addGestureRecognizer:tapGesture];
    _collectionBtn.layer.masksToBounds = YES;
    _collectionBtn.image = [UIImage imageNamed:@"hot"];
  }
  return _collectionBtn;
}

-(UILabel *)collectionNum{
  if(!_collectionNum){
    _collectionNum = [[UILabel alloc]init];
    _collectionNum.font = [UIFont systemFontOfSize:13];
    _collectionNum.textColor =[UIColor whiteColor];
    _collectionNum.text = @"14万";
    
  }
  return _collectionNum;
}

-(UIImageView*)zanBtn{
  if (!_zanBtn) {
    _zanBtn = [[UIImageView alloc] init];
    _zanBtn.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickZan)];
    [_zanBtn addGestureRecognizer:tapGesture];
    _zanBtn.layer.masksToBounds = YES;
    _zanBtn.image = [UIImage imageNamed:@"hot"];
  }
  return _zanBtn;
}

-(UILabel *)zanNum{
  if(!_zanNum){
    _zanNum = [[UILabel alloc]init];
    _zanNum.font = [UIFont systemFontOfSize:13];
    _zanNum.textColor =[UIColor whiteColor];
    _zanNum.text = @"14万";
    
  }
  return _zanNum;
}


-(void)clickPlay{
  
}
-(void)clickDownLoad{
  
}

-(void)clicCollection{
  
}

-(void)clickZan{
  
}
@end
