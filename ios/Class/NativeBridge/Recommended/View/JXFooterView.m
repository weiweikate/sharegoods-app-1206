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
#import "UIButton+TimeInterval.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

@interface JXFooterView()
@property (nonatomic, strong)UIScrollView * scrollView;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UIButton * downloadBtn;
@property (nonatomic,strong) UIButton * shareBtn;
@property (nonatomic,strong) UILabel * zanNum;
@property (nonatomic,strong) UILabel * downLoadNUm;

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

-(UIButton*)zanBtn{
  if(!_zanBtn){
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _zanBtn.timeInterval = 2;
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"zan"] forState:UIControlStateNormal];
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"yizan"] forState:UIControlStateSelected];

  }
  return _zanBtn;
}

-(UIButton*)downloadBtn{
  if(!_downloadBtn){
    _downloadBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_downloadBtn setBackgroundImage:[UIImage imageNamed:@"download"] forState:UIControlStateNormal];
  }
  return _downloadBtn;
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
    [self addSubview:self.downloadBtn];
    [self addSubview:self.downLoadNUm];
    [self addSubview:self.shareBtn];

  //点赞
  [_zanBtn addTarget:self action:@selector(tapZanBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.zanBtn.sd_layout.topSpaceToView(self.scrollView,10)
  .heightIs(25).widthIs(25)
  .leftSpaceToView(self, 30);

  self.zanNum.sd_layout.centerYEqualToView(self.zanBtn)
  .leftSpaceToView(self.zanBtn, 1)
  .widthIs(40).heightIs(25);

  //下载
  [_downloadBtn addTarget:self action:@selector(tapDownloadBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.downloadBtn.sd_layout.centerYEqualToView(self.zanNum)
  .leftSpaceToView(self.zanNum, 0)
  .widthIs(22).heightIs(22);

  self.downLoadNUm.sd_layout.centerYEqualToView(self.downloadBtn)
  .leftSpaceToView(self.downloadBtn, 1)
  .widthIs(40).heightIs(25);

  //分享/转发
  [_shareBtn addTarget:self action:@selector(tapShareBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.shareBtn.sd_layout.centerYEqualToView(self.zanBtn)
     .rightSpaceToView(self, 0)
     .widthIs(60).heightIs(25);

  [self setupAutoHeightWithBottomView:self.zanBtn bottomMargin:0];


}

-(void)setProducts:(NSArray *)products{
  _products = products;
  [self setGoodsView];
}

-(void)setDownloadCount:(NSInteger)downloadCount{
    _downloadCount = downloadCount;
  NSString * num = @"";
    if(downloadCount<999){
      num = [NSString stringWithFormat:@"%ld",downloadCount>0?downloadCount:0];
    }else if(downloadCount<100000){
      num = @"999+";
    }else{
      num = @"10w+";
    }
  self.downLoadNUm.text = num;
}

-(void)setLikesCount:(NSInteger)likesCount{
  _likesCount = likesCount;
  NSString * num = @"";
    if(likesCount<999){
      num = [NSString stringWithFormat:@"%ld",likesCount>0?likesCount:0];
    }else if(likesCount<100000){
      num = @"999+";
    }else{
      num = @"10w+";
    }
  self.zanNum.text = num;
}

-(void)setIsLike:(BOOL)isLike{
  self.zanBtn.selected = isLike;
}

-(void)setGoodsView{
    NSInteger len = self.products.count;
    CGFloat width = len>0&&len<=1?(SCREEN_WIDTH-90):(SCREEN_WIDTH-110);
  self.scrollView.sd_layout.heightIs(0);
  if(len>0){
    self.scrollView.sd_layout
    .topEqualToView(self)
    .leftSpaceToView(self, 30)
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
        [goodsImg sd_setImageWithURL:[NSURL URLWithString:[self.products[i] valueForKey:@"imgUrl"]] placeholderImage:[UIImage imageNamed:@"default_avatar"]];


        UILabel* titile = [[UILabel alloc]init];
        titile.font = [UIFont systemFontOfSize:10];
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

-(void)tapZanBtn:(NSString*)sender{
  if(self.zanBlock){
    self.zanBlock(@"");
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

  return timeSp;

}
@end
