//
//  MBVideoImage.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/17.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MBVideoImage.h"
#import "UIView+SDAutoLayout.h"

@interface MBVideoImage()
@property (nonatomic,strong) UIImageView * downloadBtn;
@property (nonatomic,strong) UIImageView * collectionBtn;
@property (nonatomic,strong) UIImageView * zanBtn;
@property (nonatomic,strong) UILabel * downLoadNum;
@property (nonatomic,strong) UILabel * collectionNum;
@property (nonatomic,strong) UILabel * zanNum;

@property (nonatomic,strong) UIImageView *playImageView;        //播放按钮

@property (nonatomic,strong)UIView  * bottomBgView;
@property (nonatomic,strong)UILabel  * contentLab;
@property (nonatomic,strong)UITextView  * contentTextView;
@property (nonatomic,strong)UILabel  * openOrclose;
@property (nonatomic,strong)UIView  * buyBtn;

@property (nonatomic,strong)UILabel  * tag1;
@property (nonatomic,strong)UILabel  * tag2;
@property (nonatomic,strong)UILabel  * tag3;

@end

@implementation MBVideoImage

- (UIImageView *)playImageView {
  if (!_playImageView) {
    _playImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"vedio"]];
  }
  return _playImageView;
}

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
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
  
  self.bottomBgView.sd_layout.bottomEqualToView(self)
  .leftEqualToView(self).widthIs(KScreenWidth).heightIs(165);
  
  self.contentLab.sd_layout.bottomSpaceToView(self, 120)
  .leftSpaceToView(self, 15).rightSpaceToView(self, 15)
  .widthIs(KScreenWidth-30).heightIs(30);
  
  self.contentTextView.sd_layout.bottomSpaceToView(self, 120)
  .leftSpaceToView(self, 15).rightSpaceToView(self, 15)
  .widthIs(KScreenWidth-30).heightIs(105);
  
  self.openOrclose.sd_layout.bottomSpaceToView(self, 96)
  .rightSpaceToView(self, 15).widthIs(26).heightIs(19);
  
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
  UIView *tag1View = [[UIView alloc]init];
  tag1View.layer.backgroundColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0].CGColor;
  tag1View.layer.cornerRadius = 12;
  [tag1View addSubview:self.tag1];
  
  UIView *tag2View = [[UIView alloc]init];
  tag2View.layer.backgroundColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0].CGColor;
  tag2View.layer.cornerRadius = 12;
  [tag2View addSubview:self.tag2];
  
  UIView *tag3View = [[UIView alloc]init];
  tag3View.layer.backgroundColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0].CGColor;
  tag3View.layer.cornerRadius = 12;
  [tag3View addSubview:self.tag3];
  
  //标签
  [self sd_addSubviews:@[tag1View,tag2View,tag3View]];
  
  tag1View.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(self, 15)
  .heightIs(24);
  self.tag1.sd_layout.centerXEqualToView(tag1View).centerYEqualToView(tag1View)
  .heightIs(24);
  [self.tag1 setSingleLineAutoResizeWithMaxWidth:(KScreenWidth-45)/3];
  
  tag2View.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(tag1View, 15)
  .heightIs(24);
  self.tag2.sd_layout.centerXEqualToView(tag2View).centerYEqualToView(tag2View)
  .heightIs(24);
  [self.tag2 setSingleLineAutoResizeWithMaxWidth:(KScreenWidth-45)/3];
  
  tag3View.sd_layout.bottomSpaceToView(self, 66).leftSpaceToView(tag2View, 15)
  .heightIs(24);
  self.tag3.sd_layout.centerXEqualToView(tag3View).centerYEqualToView(tag3View)
  .heightIs(24);
  [self.tag3 setSingleLineAutoResizeWithMaxWidth:(KScreenWidth-45)/3];
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
    _contentLab.text = @"然而，今晚我见到了星星。我倚扶着阳台栏杆，心血来潮地抬了一下头，见到三两个星星在头顶闪耀。 我以为偌大的一块墨玉的池子里只有这三两个星星。但是几秒钟后，又多出了几个。 我努力把眼睛睁到最大，终于见到弱弱闪着的星星。我倚。然而，今晚我见到了星星。我倚扶着阳台栏杆，心血来潮地抬了一下头，见到三两个星星在头顶闪耀。 我以为偌大的一块墨玉的池子里只有这三两个星星。但是几秒钟后，又多出了几个。 我努力把眼睛睁到最大，终于见到弱弱闪着的星星。我倚。";
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
    _contentTextView.text = @"然而，今晚我见到了星星。我倚扶着阳台栏杆，心血来潮地抬了一下头，见到三两个星星在头顶闪耀。 我以为偌大的一块墨玉的池子里只有这三两个星星。但是几秒钟后，又多出了几个。 我努力把眼睛睁到最大，终于见到弱弱闪着的星星。我倚。然而，今晚我见到了星星。我倚扶着阳台栏杆，心血来潮地抬了一下头，见到三两个星星在头顶闪耀。 我以为偌大的一块墨玉的池子里只有这三两个星星。但是几秒钟后，又多出了几个。 我努力把眼睛睁到最大，终于见到弱弱闪着的星星。我倚。";
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

-(UILabel *)tag1{
  if(!_tag1){
    _tag1 = [[UILabel alloc]init];
    _tag1.textColor = [UIColor whiteColor];
    _tag1.font = [UIFont systemFontOfSize:12];
  }
  return _tag1;
}

-(UILabel *)tag2{
  if(!_tag2){
    _tag2 = [[UILabel alloc]init];
    _tag2.textColor = [UIColor whiteColor];
    _tag2.font = [UIFont systemFontOfSize:12];
  }
  return _tag2;
}

-(UILabel *)tag3{
  if(!_tag3){
    _tag3 = [[UILabel alloc]init];
    _tag3.textColor = [UIColor whiteColor];
    _tag3.font = [UIFont systemFontOfSize:12];
  }
  return _tag3;
}


-(UIView *)buyBtn{
  if(!_buyBtn){
    _buyBtn = [[UIView alloc]init];
    _buyBtn.layer.cornerRadius = 17;
    _buyBtn.backgroundColor = [UIColor colorWithRed:255/255.0 green:203/255.0 blue:2/255.0 alpha:1.0];
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

-(void)clickPlay{
  if(self.Delegate){
    [self.Delegate clickImagePlayOrPause];
  }
}

-(void)clickDownLoad{
  if(self.dataDelegate){
    [self.dataDelegate clickDownload];
  }
}

-(void)clicCollection{
  if(self.dataDelegate){
    [self.dataDelegate clicCollection];
  }
}

-(void)clickZan{
  if(self.dataDelegate){
    [self.dataDelegate clickZan];
  }
}

-(void)clickBuy{
  if(self.dataDelegate){
    [self.dataDelegate clickBuy];
  }
}

@end
