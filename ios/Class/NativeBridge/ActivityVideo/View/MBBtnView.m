//
//  MBBtnView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MBBtnView.h"
#import "UIView+SDAutoLayout.h"
#import "NSString+UrlAddParams.h"
#import "MBProgressHUD+PD.h"
#import "AppDelegate.h"   //需要引入这个头文件

@interface MBBtnView()
@property (nonatomic,strong) UIButton * downloadBtn;
@property (nonatomic,strong) UIButton * collectionBtn;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UILabel * downLoadNum;
@property (nonatomic,strong) UILabel * collectionNum;
@property (nonatomic,strong) UILabel * zanNum;

@property (nonatomic,strong)UIView  * bottomBgView;
@property (nonatomic,strong)UILabel  * contentLab;
@property (nonatomic,strong)UITextView  * contentTextView;
@property (nonatomic,strong)UILabel  * openOrclose;
@property (nonatomic,strong)UIView  * buyBtn;

@property (nonatomic,strong)UIButton  * tag1;
@property (nonatomic,strong)UIButton  * tag2;
@property (nonatomic,strong)UIButton  * tag3;

@end

@implementation MBBtnView

- (UIImageView *)playImageView {
  if (!_playImageView) {
    _playImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"vedio"]];
  }
  return _playImageView;
}

- (instancetype)init {
  self = [super init];
  
  if (self) {
    [self setUI];
    [self addEven];
  }
  
  return self;
}

-(void)addEven{
  UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickPlay)];
  [self addGestureRecognizer:tapGesture];
  self.userInteractionEnabled = YES;
  self.playImageView.hidden = NO;
}

-(void)setUI{
  UIView *lineview = [[UIView alloc]init];
  lineview.backgroundColor = [UIColor colorWithRed:229/255.0 green:229/255.0 blue:229/255.0 alpha:1.0];
  
  UILabel *text = [[UILabel alloc]init];
  text.text = @"立即购买";
  text.textColor = [UIColor whiteColor];
  text.font = [UIFont systemFontOfSize:12];
  
  UIView * downloadView = [[UIView alloc]init];
  [downloadView addSubview:self.downloadBtn];
  [downloadView addSubview:self.downLoadNum];
  
  UIView * collectionView = [[UIView alloc]init];
  [collectionView addSubview:self.collectionBtn];
  [collectionView addSubview:self.collectionNum];
  
  UIView * zanView = [[UIView alloc]init];
  [zanView addSubview:self.zanBtn];
  [zanView addSubview:self.zanNum];
  
  [self.buyBtn addSubview:text];
  [self sd_addSubviews:@[downloadView,
                         collectionView,
                         zanView,
                         self.playImageView,
                         self.bottomBgView,
                         self.contentLab,
                         self.contentTextView,
                         self.openOrclose,
                         lineview,
                         self.buyBtn]];
  
  
  self.playImageView.sd_layout.centerXEqualToView(self).centerYEqualToView(self)
  .widthIs(60).heightIs(60);
  
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
  
  
  self.bottomBgView.sd_layout.bottomEqualToView(self)
  .leftEqualToView(self).widthIs(KScreenWidth).heightIs(165);
  
  self.contentLab.sd_layout.bottomSpaceToView(self, 120)
  .leftSpaceToView(self, 15).rightSpaceToView(self, 15)
  .widthIs(KScreenWidth-30).heightIs(30);
  
  self.contentTextView.sd_layout.bottomSpaceToView(self, 120)
  .leftSpaceToView(self, 15).rightSpaceToView(self, 15)
  .widthIs(KScreenWidth-30).heightIs(105);
  
  self.openOrclose.sd_layout.bottomSpaceToView(self, 96)
  .rightSpaceToView(self, 15).widthIs(30).heightIs(19);
  
  [self setTagView];
  
  lineview.sd_layout.bottomSpaceToView(self, 55)
  .widthIs(KScreenWidth).heightIs(1);
  
 self.buyBtn.sd_layout.bottomSpaceToView(self, 10)
  .rightSpaceToView(self, 20).widthIs(90).heightIs(34);
  
  text.sd_layout.centerYEqualToView(self.buyBtn).centerXEqualToView(self.buyBtn)
  .heightIs(20);
  [text setSingleLineAutoResizeWithMaxWidth:90];
}

-(void)setTagView{
  //标签
  [self sd_addSubviews:@[self.tag1,self.tag2,self.tag3]];
  self.tag1.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(self, 15);
  [self.tag1 setupAutoSizeWithHorizontalPadding:8 buttonHeight:24];
  
  self.tag2.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(self.tag1, 15);
  [self.tag2 setupAutoSizeWithHorizontalPadding:8 buttonHeight:24];
  
  self.tag3.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(self.tag2, 15);
  [self.tag3 setupAutoSizeWithHorizontalPadding:8 buttonHeight:24];
  
}

#pragma mark - Custom Accessors

-(UIButton*)downloadBtn{
  if (!_downloadBtn) {
    _downloadBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_downloadBtn addTarget:self action:@selector(clickDownLoad:) forControlEvents:UIControlEventTouchUpInside];
    [_downloadBtn setBackgroundImage:[UIImage imageNamed:@"videoDownload"] forState:UIControlStateNormal];
  }
  return _downloadBtn;
}

-(UILabel *)downLoadNum{
  if(!_downLoadNum){
    _downLoadNum = [[UILabel alloc]init];
    _downLoadNum.font = [UIFont systemFontOfSize:13];
    _downLoadNum.textColor =[UIColor whiteColor];
    _downLoadNum.textAlignment = NSTextAlignmentCenter;

  }
  return _downLoadNum;
}

-(UIButton*)collectionBtn{
  if (!_collectionBtn) {
    _collectionBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_collectionBtn addTarget:self action:@selector(clicCollection:) forControlEvents:UIControlEventTouchUpInside];
    
    [_collectionBtn setBackgroundImage:[UIImage imageNamed:@"videoCollectNo"] forState:UIControlStateNormal];
    [_collectionBtn setBackgroundImage:[UIImage imageNamed:@"videoCollect"] forState:UIControlStateSelected];
    
  }
  return _collectionBtn;
}

-(UILabel *)collectionNum{
  if(!_collectionNum){
    _collectionNum = [[UILabel alloc]init];
    _collectionNum.font = [UIFont systemFontOfSize:13];
    _collectionNum.textColor =[UIColor whiteColor];
    _collectionNum.textAlignment = NSTextAlignmentCenter;
  }
  return _collectionNum;
}

-(UIButton*)zanBtn{
  if (!_zanBtn) {
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_zanBtn addTarget:self action:@selector(clickZan:) forControlEvents:UIControlEventTouchUpInside];
    
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"videoZanNo"] forState:UIControlStateNormal];
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"videoZan"] forState:UIControlStateSelected];
  }
  return _zanBtn;
}

-(UILabel *)zanNum{
  if(!_zanNum){
    _zanNum = [[UILabel alloc]init];
    _zanNum.font = [UIFont systemFontOfSize:13];
    _zanNum.textColor =[UIColor whiteColor];
    _zanNum.textAlignment = NSTextAlignmentCenter;

  }
  return _zanNum;
}

-(UIView *)bottomBgView{
  if(!_bottomBgView){
    _bottomBgView = [[UIView alloc]init];
    CAGradientLayer *gradient = [CAGradientLayer layer];
    //设置开始和结束位置(通过开始和结束位置来控制渐变的方向)
    //    gradient.locations = @[@(1.0f), @(0)];
    gradient.startPoint = CGPointMake(0, 0);
    gradient.endPoint = CGPointMake(0, 1.0);
    gradient.colors = @[(__bridge id)RGBA(0, 0, 0, 0).CGColor, (__bridge id)RGBA(0, 0, 0, 1).CGColor];
    gradient.frame = CGRectMake(0, 0, KScreenWidth, 165);
    [_bottomBgView.layer insertSublayer:gradient atIndex:0];
  }
  return _bottomBgView;
}

-(UILabel *)contentLab{
  if(!_contentLab){
    _contentLab = [[UILabel alloc]init];
    _contentLab.font = [UIFont systemFontOfSize:13];
    _contentLab.textColor = [UIColor whiteColor];
    _contentLab.hidden = NO;
  }
  return _contentLab;
}

-(UITextView *)contentTextView{
  if(!_contentTextView){
    _contentTextView = [[UITextView alloc]init];
    _contentTextView.backgroundColor = [UIColor clearColor];
    _contentTextView.font = [UIFont systemFontOfSize:13];
    _contentTextView.textColor = [UIColor whiteColor];
    [_contentTextView setEditable:NO];
    _contentTextView.hidden = YES;
  }
  return _contentTextView;
}


-(UILabel *)openOrclose{
  if(!_openOrclose){
    _openOrclose = [[UILabel alloc]init];
    _openOrclose.font = [UIFont systemFontOfSize:13];
    _openOrclose.textColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0];
    _openOrclose.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickOpenOrColse)];
    [_openOrclose addGestureRecognizer:tapGesture];
    _openOrclose.text = @"展开";
    
  }
  return _openOrclose;
}

-(UIButton *)tag1{
  if(!_tag1){
    _tag1 = [[UIButton alloc]init];
    _tag1.backgroundColor = [UIColor colorWithHexString:@"#FF0050"];
    _tag1.titleLabel.font = [UIFont systemFontOfSize:12];
    [_tag1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _tag1.layer.cornerRadius = 12;
    _tag1.layer.masksToBounds = YES;
    _tag1.tag = 1;
    [_tag1 addTarget:self action:@selector(clickTag:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _tag1;
}

-(UIButton *)tag2{
  if(!_tag2){
    _tag2 = [[UIButton alloc]init];
    _tag2.backgroundColor = [UIColor colorWithHexString:@"#FF0050"];
    _tag2.titleLabel.font = [UIFont systemFontOfSize:12];
    [_tag2 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _tag2.layer.cornerRadius = 12;
    _tag2.layer.masksToBounds = YES;
    _tag2.tag = 2;
    [_tag2 addTarget:self action:@selector(clickTag:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _tag2;
}

-(UIButton *)tag3{
  if(!_tag3){
    _tag3 = [[UIButton alloc]init];
    _tag3.backgroundColor = [UIColor colorWithHexString:@"#FF0050"];
    _tag3.titleLabel.font = [UIFont systemFontOfSize:12];
    [_tag3 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _tag3.layer.cornerRadius = 12;
    _tag3.layer.masksToBounds = YES;
    _tag3.tag = 3;
    [_tag3 addTarget:self action:@selector(clickTag:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _tag3;
}


-(UIView *)buyBtn{
  if(!_buyBtn){
    _buyBtn = [[UIView alloc]init];
    _buyBtn.layer.cornerRadius = 17;
    _buyBtn.backgroundColor = [UIColor colorWithHexString:@"FF9502"];
    _buyBtn.userInteractionEnabled = YES;//打开用户交互
    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickBuy)];
    [_buyBtn addGestureRecognizer:tapGesture];
    
  }
  return _buyBtn;
}

-(void)clickOpenOrColse{
  if([self.openOrclose.text isEqualToString:@"展开"]){
    self.openOrclose.text = @"收起";
    self.contentLab.hidden = YES;
    self.contentTextView.hidden = NO;
  }else{
    self.openOrclose.text = @"展开";
    self.contentLab.hidden = NO;
    self.contentTextView.hidden = YES;
  }
}

#pragma arguments - dataDelegate
  //点击购买按钮并返回代理方法
-(void)clickBuy{
  if(self.dataDelegate){
    [self.dataDelegate clickBuy:self.model];
  }
}
  //点击播放按钮并返回代理方法
-(void)clickPlay{
  AppDelegate *myDelegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  
  if(myDelegate.AFNetworkStatus==1&&[NSString stringWithStorgeKey:@"playVideo"]){
    [self showVideoPlayAlterWith];
  }else if(myDelegate.AFNetworkStatus==0){
    [MBProgressHUD showSuccess:@"似乎已断开与互联网的连接"];
  }else{
      if(self.dataDelegate){
        self.playImageView.hidden = self.playImageView.isHidden?NO:YES;
        [self.dataDelegate clickPlayOrPause];
      }
  }
}

  //点击下载按钮并返回代理方法
-(void)clickDownLoad:(UIButton*)sender{
  AppDelegate *myDelegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  if(self.isLogin){
    if(myDelegate.AFNetworkStatus==1&&[NSString stringWithStorgeKey:@"downloadVideo"]){
      [self showDownloadAlterWith:sender];
    }else if(myDelegate.AFNetworkStatus==0){
      [MBProgressHUD showSuccess:@"似乎已断开与互联网的连接"];
    }else{
      MBModelData* modeltemp = self.model;
      modeltemp.downloadCount++;
      self.downLoadNum.text = [NSString stringWithNumber:modeltemp.downloadCount];
      if(self.dataDelegate){
        [self.dataDelegate clickDownload:modeltemp];
      }
    }
  }else{
    if(self.dataDelegate){
      [self.dataDelegate clickDownload:self.model];
    }
  }
}
  //点击收藏按钮并返回代理方法
-(void)clicCollection:(UIButton*)sender{
  MBModelData* modeltemp = self.model;
  if(self.isLogin){
    if(sender.selected){
      modeltemp.collectCount--;
    }else{
     modeltemp.collectCount++;
    }
    sender.selected = !sender.selected;
    self.collectionNum.text = [NSString stringWithNumber:modeltemp.collectCount];
    modeltemp.collect = sender.selected;
  }
  if(self.dataDelegate){
    [self.dataDelegate clicCollection:modeltemp];
  }
}
  //点击点赞按钮并返回代理方法
-(void)clickZan:(UIButton*)sender{
  MBModelData* modeltemp = self.model;
  if(sender.selected){
    modeltemp.likesCount--;
  }else{
    modeltemp.likesCount++;
  }
  sender.selected = !sender.selected;
  self.zanNum.text = [NSString stringWithNumber:modeltemp.likesCount];
  modeltemp.like = sender.selected;  
  if(self.dataDelegate){
    [self.dataDelegate clickZan:self.model];
  }
}
  //点击标签按钮并返回代理方法
-(void)clickTag:(UIButton*)sender{
  if(self.dataDelegate){
    [self.dataDelegate clickTag:self.model index:sender.tag];
  }
}

#pragma arguments - setModel

-(void)setModel:(MBModelData *)model{
  _model = model;
  self.downLoadNum.text = [NSString stringWithNumber:model.downloadCount];
  self.collectionNum.text = [NSString stringWithNumber:model.collectCount];
  self.collectionBtn.selected = model.collect;
  self.zanNum.text = [NSString stringWithNumber:model.likesCount];
  self.zanBtn.selected = model.like;
  
  if(model.content.length>0){
    self.contentLab.text = model.content?model.content:@"";
    self.contentTextView.text = model.content?model.content:@"";
    self.contentLab.hidden = NO;
    self.contentTextView.hidden = YES;
    self.openOrclose.hidden = NO;
  }else{
    self.contentLab.text = @"";
    self.contentTextView.text = @"";
    self.contentLab.hidden = YES;
    self.contentTextView.hidden = YES;
    self.openOrclose.hidden = YES;
  }

  if(model.products.count>0){
    self.buyBtn.hidden = NO;
  }else{
    self.buyBtn.hidden = YES;
  }
  
  if(self.contentLab.isHidden){
    self.openOrclose.text = @"展开";
    self.contentLab.hidden = NO;
    self.contentTextView.hidden = YES;
  }
  if(model.showTags){
    if([model.showTags count]>=1){
      NSString *tag1Text = [NSString stringWithFormat:@"#%@",model.showTags.firstObject?[model.showTags.firstObject valueForKey:@"name"]:@""];
      [self.tag1 setTitle:tag1Text forState:UIControlStateNormal];
      self.tag1.hidden = NO;
    }else{
      self.tag1.hidden = YES;
    }

    if([model.showTags count]>=2){
      NSString *tag2Text = [NSString stringWithFormat:@"#%@",model.showTags[1]?[model.showTags[1] valueForKey:@"name"]:@""];
      [self.tag2 setTitle:tag2Text forState:UIControlStateNormal];
      self.tag2.hidden = NO;
    }else{
      self.tag2.hidden = YES;
    }

    if([model.showTags count]>=3){
      NSString *tag3Text = [NSString stringWithFormat:@"#%@",model.showTags[2]?[model.showTags[2] valueForKey:@"name"]:@""];
      [self.tag3 setTitle:tag3Text forState:UIControlStateNormal];

      self.tag3.hidden = NO;
    }else{
      self.tag3.hidden = YES;
    }
  }
}

-(void)showDownloadAlterWith:(UIButton*)sender{
  __weak typeof(self) weakSelf = self;
  UIAlertController *alterController = [UIAlertController alertControllerWithTitle:@"温馨提示"
                                                                           message:@"您当前处于2G/3G/4G环境 继续下载将使用流量"
                                                                    preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"返回"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                         
                                                       }];
  UIAlertAction *actionSubmit = [UIAlertAction actionWithTitle:@"继续下载"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                  [self saveDate:@"downloadVideo"];
                                                         MBModelData* modeltemp = weakSelf.model;
                                                         modeltemp.downloadCount++;
                                                         weakSelf.downLoadNum.text = [NSString stringWithNumber:modeltemp.downloadCount];
                                                         if(weakSelf.dataDelegate){
                                                           [weakSelf.dataDelegate clickDownload:modeltemp];
                                                         }
                                                       }];
  [alterController addAction:actionCancel];
  [alterController addAction:actionSubmit];
  [self.currentViewController_XG presentViewController:alterController animated:YES completion:^{}];
}

-(void)showVideoPlayAlterWith{
  __weak typeof(self) weakSelf = self;
  UIAlertController *alterController = [UIAlertController alertControllerWithTitle:@"温馨提示"
                                                                           message:@"您当前处于2G/3G/4G环境                       继续播放将使用流量"
                                                                    preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *actionCancel = [UIAlertAction actionWithTitle:@"返回"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                         
                                                       }];
  UIAlertAction *actionSubmit = [UIAlertAction actionWithTitle:@"继续播放"
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                        [self saveDate:@"playVideo"]; if(weakSelf.dataDelegate){
                                                           weakSelf.playImageView.hidden = weakSelf.playImageView.isHidden?NO:YES;
                                                           [weakSelf.dataDelegate clickPlayOrPause];
                                                         }
                                                       }];
  [alterController addAction:actionCancel];
  [alterController addAction:actionSubmit];
  [self.currentViewController_XG presentViewController:alterController animated:YES completion:^{}];
}

-(void)saveDate:(NSString*)key{
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  NSDateFormatter *format = [[NSDateFormatter alloc]init];
  [format setDateFormat:@"yyyy-MM-dd"];
  NSString *nowDate = [format stringFromDate:[NSDate date]];
  [userDefaults setObject:nowDate forKey:key];
  [userDefaults synchronize];
}
@end
