//
//  JXFooterView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXFooterView.h"
#import "UIView+SDAutoLayout.h"
#import "UIImageView+WebCache.h"
#import "NSString+UrlAddParams.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

@interface JXFooterView()
@property (nonatomic, strong)UIScrollView * scrollView;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UIButton * downloadBtn;
@property (nonatomic,strong) UIButton * collectionBtn;
@property (nonatomic,strong) UIButton * shareBtn;
@property (nonatomic,strong) UILabel * zanNum;
@property (nonatomic,strong) UILabel * downLoadNUm;
@property (nonatomic,strong) UILabel * collectionNum;

@end

@implementation JXFooterView

-(UIScrollView *)scrollView{
    if(!_scrollView){
      _scrollView = [[UIScrollView alloc] init];
      _scrollView.showsHorizontalScrollIndicator = NO;//不显示水平拖地的条
      _scrollView.showsVerticalScrollIndicator=NO;//不显示垂直拖动的条
      _scrollView.pagingEnabled = YES;//允许分页滑动
      _scrollView.bounces = NO;//到边了就不能再拖地
    }
    return _scrollView;
}

-(UILabel *)zanNum{
    if(!_zanNum){
        _zanNum = [[UILabel alloc]init];
        _zanNum.font = [UIFont systemFontOfSize:10];
        _zanNum.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    }
    return _zanNum;
}

-(UILabel *)downLoadNUm{
    if(!_downLoadNUm){
        _downLoadNUm = [[UILabel alloc]init];
        _downLoadNUm.font = [UIFont systemFontOfSize:10];
        _downLoadNUm.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    }
    return _downLoadNUm;

}

-(UILabel *)collectionNum{
  if(!_collectionNum){
    _collectionNum = [[UILabel alloc]init];
    _collectionNum.font = [UIFont systemFontOfSize:10];
    _collectionNum.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
  }
  return _collectionNum;
  
}

-(UIButton*)zanBtn{
  if(!_zanBtn){
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"zan"] forState:UIControlStateNormal];
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"yizan"] forState:UIControlStateSelected];

  }
  return _zanBtn;
}


-(UIButton*)downloadBtn{
  if(!_downloadBtn){
    _downloadBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_downloadBtn setBackgroundImage:[UIImage imageNamed:@"showDownload"] forState:UIControlStateNormal];
  }
  return _downloadBtn;
}

-(UIButton*)collectionBtn{
  if(!_collectionBtn){
    _collectionBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_collectionBtn setBackgroundImage:[UIImage imageNamed:@"showCollectNo"] forState:UIControlStateNormal];
    [_collectionBtn setBackgroundImage:[UIImage imageNamed:@"showCollect"] forState:UIControlStateSelected];
    
  }
  return _collectionBtn;
}

-(UIButton*)shareBtn{
  if(!_shareBtn){
    _shareBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_shareBtn setImage:[UIImage imageNamed:@"fenxiang"] forState:UIControlStateNormal];
  }
  return _shareBtn;
}

-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];
  }
  return  self;
}

-(void)setUI{
    [self addSubview:self.scrollView];
    [self addSubview:self.zanBtn];
    [self addSubview:self.zanNum];
    [self addSubview:self.collectionBtn];
    [self addSubview:self.collectionNum];
    [self addSubview:self.downloadBtn];
    [self addSubview:self.downLoadNUm];
    [self addSubview:self.shareBtn];

  //点赞
  [_zanBtn addTarget:self action:@selector(tapZanBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.zanBtn.sd_layout.topSpaceToView(self.scrollView,10)
  .heightIs(26).widthIs(26)
  .leftSpaceToView(self, 0);

  self.zanNum.sd_layout.centerYEqualToView(self.zanBtn)
  .leftSpaceToView(self.zanBtn, 1)
  .widthIs(40).heightIs(26);

  //收藏
  [_collectionBtn addTarget:self action:@selector(tapCollectionBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.collectionBtn.sd_layout.centerYEqualToView(self.zanNum)
  .leftSpaceToView(self.zanNum, 10)
  .heightIs(26).widthIs(26);
  
  self.collectionNum.sd_layout.centerYEqualToView(self.collectionBtn)
  .leftSpaceToView(self.collectionBtn, 1)
  .widthIs(40).heightIs(26);
  
  //下载
  [_downloadBtn addTarget:self action:@selector(tapDownloadBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.downloadBtn.sd_layout.centerYEqualToView(self.zanNum)
  .leftSpaceToView(self.collectionNum, 10)
  .widthIs(26).heightIs(26);

  self.downLoadNUm.sd_layout.centerYEqualToView(self.downloadBtn)
  .leftSpaceToView(self.downloadBtn, 1)
  .widthIs(40).heightIs(26);

  //分享/转发
  [_shareBtn addTarget:self action:@selector(tapShareBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.shareBtn.sd_layout.centerYEqualToView(self.zanBtn)
     .rightSpaceToView(self, 10)
     .widthIs(70).heightIs(30);

  [self setupAutoHeightWithBottomView:self.zanBtn bottomMargin:10];
}


-(void)setProducts:(NSArray *)products{
  _products = products;
  [self setGoodsView];
}

- (void)setType:(BOOL)type{
  _type = type;
  if(type){
    self.downloadBtn.hidden = YES;
    self.downLoadNUm.hidden = YES;
    
  }else{
    self.downloadBtn.hidden = NO;
    self.downLoadNUm.hidden = NO;
  }
}

-(void)setDownloadCount:(NSInteger)downloadCount{
    _downloadCount = downloadCount;
  self.downLoadNUm.text = [NSString stringWithNumber:downloadCount];
}

-(void)setLikesCount:(NSInteger)likesCount{
  _likesCount = likesCount;
  self.zanNum.text = [NSString stringWithNumber:likesCount];
}

-(void)setCollectCount:(NSInteger)collectCount{
  _collectCount = collectCount;
  self.collectionNum.text = [NSString stringWithNumber:collectCount];
}

-(void)setIsLike:(BOOL)isLike{
  _isLike = isLike;
  self.zanBtn.selected = isLike;
}

-(void)setIsCollect:(BOOL)isCollect{
  _isCollect = isCollect;
  self.collectionBtn.selected = isCollect;
}

-(void)setGoodsView{
    NSInteger len = self.products.count;
    CGFloat width = len>0&&len<=1?(SCREEN_WIDTH-55):(SCREEN_WIDTH-90);
  self.scrollView.sd_layout.heightIs(0);
  if(len>0){
    self.scrollView.sd_layout
    .topEqualToView(self)
    .leftSpaceToView(self, 0)
    .rightSpaceToView(self, 0)
    .heightIs(72);

    //移除scrollview子视图
    for(UIView *view in [self.scrollView subviews]){
      [view removeFromSuperview];
    }
      self.scrollView.contentSize = len>0&&len<=1?CGSizeMake(width*len, 70):CGSizeMake(width*len+10*len, 70);
    for (int i=0; i<len; i++) {
        UIView *bgView = [[UIView alloc] init];
        bgView.userInteractionEnabled = YES;
        //设置圆角
        bgView.layer.cornerRadius = 5;
        //将多余的部分切掉
        bgView.layer.masksToBounds = YES;
        CGFloat spaceWith = 10*i;
        bgView.frame = CGRectMake((width)*i+spaceWith, 0, width, 70);
        bgView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
      UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickGoods:)];
      [bgView addGestureRecognizer:tapGesture];
      tapGesture.view.tag = 10+i;
        UIImageView* goodsImg = [[UIImageView alloc] init];
        //设置圆角
        goodsImg.layer.cornerRadius = 5;
        //将多余的部分切掉
        goodsImg.layer.masksToBounds = YES;
        goodsImg.image = [UIImage imageNamed:@"welcome3"];
        [goodsImg setImageWithURL:[NSURL URLWithString:[self.products[i] valueForKey:@"imgUrl"]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"f5f5f5"]]];

        UILabel* titile = [[UILabel alloc]init];
        titile.font = [UIFont systemFontOfSize:12];
        titile.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        titile.text = [self.products[i] valueForKey:@"name"];


        UILabel* price = [[UILabel alloc]init];
        price.font = [UIFont systemFontOfSize:10];
        price.textColor = [UIColor lightGrayColor];
//      if([self.products[i][@"price"] && self.products[i][@"originalPrice"]){
      price.attributedText = [self getPriceAttribute:[self getCurrentPrice:self.products[i]] oldPrice:[self.products[i] valueForKey:@"originalPrice"]];
//        }

        UIButton* shopCarBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        shopCarBtn.tag = i+1;
        shopCarBtn.titleLabel.font = [UIFont systemFontOfSize:12];
        [shopCarBtn setImage:[UIImage imageNamed:@"jiarugouwuche"] forState:UIControlStateNormal];
        //加入购物车
        [shopCarBtn addTarget:self action:@selector(addCarBtn:) forControlEvents:UIControlEventTouchUpInside];

        [bgView sd_addSubviews:@[goodsImg,titile,price,shopCarBtn]];
        //商品图片
        goodsImg.sd_layout.topSpaceToView(bgView, 5)
        .leftSpaceToView(bgView, 5)
        .widthIs(60).heightIs(60);

        //标题
        titile.sd_layout.topSpaceToView(bgView, 10)
        .leftSpaceToView(goodsImg, 10)
        .rightSpaceToView(bgView, 10)
        .heightIs(20);

        //购物车
        shopCarBtn.sd_layout.bottomSpaceToView(bgView, 5)
        .rightSpaceToView(bgView, 10)
        .widthIs(20).heightIs(20);

        //价格
        price.sd_layout.bottomEqualToView(goodsImg)
        .leftSpaceToView(goodsImg, 10)
        .rightSpaceToView(shopCarBtn, 1)
        .heightIs(21);

        [_scrollView addSubview:bgView];

    }
  }
}

-(void)clickGoods:(UITapGestureRecognizer*)tag{
  if(self.clickGoods){
    self.clickGoods(self.products[tag.view.tag-10]);
  }
}

-(void)tapZanBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
  if(self.zanBlock){
    self.zanBlock(@"");
  }
}

-(void)tapCollectionBtn:(UIButton*)sender{
  sender.selected = !sender.selected;
  if(self.collectionBlock){
    self.collectionBlock(@"");
  }
}

-(void)tapDownloadBtn:(UIButton*)sender{
  if(self.downloadBlock){
    self.downloadBlock(@"");

  }
}

-(void)tapShareBtn:(UIButton*)sender{
  if(self.shareBlock){
    self.shareBlock(@"");
  }
}

-(void)addCarBtn:(UIButton*)sender{
  if(self.addCarBlock){
    self.addCarBlock(self.products[sender.tag-1]);
  }
}

-(NSMutableAttributedString *)getPriceAttribute:(NSString*)price oldPrice:(NSString*)oldPrice{
    CGFloat priceF = [price floatValue];
    CGFloat oldPriceF = [oldPrice floatValue];
  NSString *str = price.length>0?[NSString stringWithFormat:@"¥%@",[self decimalNumberWithDouble: priceF]]:@"";
  NSString *oldStr = [NSString stringWithFormat:@"¥%@",[self decimalNumberWithDouble: oldPriceF]] ;
    NSInteger len = str.length;
    NSString * string = [NSString stringWithFormat:@"%@  %@",str,oldStr];
    NSMutableAttributedString *attrStr = [[NSMutableAttributedString alloc]
                                          initWithString:string];

  if(price.length>0){
    [attrStr addAttribute:NSForegroundColorAttributeName value:[UIColor redColor] range:NSMakeRange(0, len)];
    [attrStr addAttribute:NSFontAttributeName value:[UIFont boldSystemFontOfSize:15] range:NSMakeRange(1, len)];
    [attrStr addAttribute:NSStrikethroughStyleAttributeName value:@(1) range:NSMakeRange(len+2, oldStr.length)];
  }
    return attrStr;
}

-(NSString *)decimalNumberWithDouble:(CGFloat)conversionValue{
  NSString *doubleString        = [NSString stringWithFormat:@"%.2lf", conversionValue];
  NSDecimalNumber *decNumber    = [NSDecimalNumber decimalNumberWithString:doubleString];
  return [decNumber stringValue];
}

-(NSString*)getCurrentPrice:(GoodsDataModel*)model{
  if(model.promotionResult){
    ActityModel* groupModel =  model.promotionResult.groupActivity;
    ActityModel* singleModel =  model.promotionResult.singleActivity;
    ActityModel* selectModel = [ActityModel new];
    if(groupModel.type){
      selectModel=groupModel;
    }else{
      selectModel=singleModel;
    }
    if(([self getNowTimestamp]< [selectModel.endTime integerValue]+500)&&([self getNowTimestamp]>[selectModel.startTime integerValue])){
      return model.promotionMinPrice>0? [NSString stringWithFormat:@"%lf" ,model.promotionMinPrice]:@"";
    }
  }
  return model.minPrice>0?[NSString stringWithFormat:@"%lf" ,model.minPrice]:@"";
}

-(NSInteger)getNowTimestamp{

  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];

  [formatter setDateStyle:NSDateFormatterMediumStyle];

  [formatter setTimeStyle:NSDateFormatterShortStyle];

  [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"]; // ----------设置你想要的格式,hh与HH的区别:分别表示12小时制,24小时制

  //设置时区,这个对于时间的处理有时很重要

  NSTimeZone* timeZone = [NSTimeZone timeZoneWithName:@"Asia/Beijing"];

  [formatter setTimeZone:timeZone];

  NSDate *datenow = [NSDate date];//现在时间

  //时间转时间戳的方法:
  NSInteger timeSp = [[NSNumber numberWithDouble:[datenow timeIntervalSince1970]] integerValue];

  return timeSp*1000;

}
@end
