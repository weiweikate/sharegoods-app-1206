//
//  Recommended Cell.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedCell.h"
#import "UIView+SDAutoLayout.h"
#import "View/JXHeaderView.h"
#import "View/JXBodyView.h"
#import "View/JXFooterView.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

@interface RecommendedCell()
@property (nonatomic,strong)JXHeaderView* headView;
@property (nonatomic,strong)JXBodyView* bodyView;
@property (nonatomic,strong)JXFooterView* footerView;
@property (nonatomic,strong) UILabel * contentLab;
@property (nonatomic, strong) UILabel *foldLabel;       // 展开按钮
@property (nonatomic,strong) UIImageView * jingpin;

@end

@implementation RecommendedCell

-(UIImageView*)jingpin{
  if(!_jingpin){
    _jingpin = [[UIImageView alloc] init];
    _jingpin.image = [UIImage imageNamed:@"icon_recommend"];
    _jingpin.layer.masksToBounds = YES;
  }
  return _jingpin;
}

-(UILabel *)contentLab{
    if(!_contentLab){
        _contentLab = [[UILabel alloc]init];
        _contentLab.font = [UIFont systemFontOfSize:13];
        _contentLab.textColor = [UIColor colorWithHexString:@"666666"];;
      _contentLab.userInteractionEnabled=YES;
      UITapGestureRecognizer *labelTapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(labelTouchUpInside)];
      [_contentLab sizeToFit];

      [_contentLab addGestureRecognizer:labelTapGestureRecognizer];
    }
    return _contentLab;
}


-(UILabel *)foldLabel{
    if (!_foldLabel) {
        _foldLabel = [[UILabel alloc] init];
        _foldLabel.font = [UIFont systemFontOfSize:13.f];
        _foldLabel.textColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0];
        _foldLabel.userInteractionEnabled = YES;
        UITapGestureRecognizer *foldTap =[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(foldNewsOrNoTap:)];
        [_foldLabel addGestureRecognizer:foldTap];
        _foldLabel.hidden = NO;
        [_foldLabel sizeToFit];
    }
    return _foldLabel;
}

-(JXHeaderView *)headView{
  if (!_headView) {
    _headView = [[JXHeaderView alloc] init];
    __weak RecommendedCell *weakSelf = self;
    _headView.clickHeaderImgBlock = ^(){
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate headerImgClick:weakSelf];
      }
    };
  }
  return _headView;
}
-(JXBodyView *)bodyView{
  if (!_bodyView) {
    _bodyView = [[JXBodyView alloc] init];
    __weak RecommendedCell *weakSelf = self;
    _bodyView.imgBlock =  ^(NSArray* image,NSInteger tag){
      NSLog(@"imgBlock");
      __strong RecommendedCell *strongSelf = weakSelf;
      if (strongSelf.cellDelegate) {
          [strongSelf.cellDelegate imageClick:image tag:tag];
      }
    };
  }
  return _bodyView;
}

-(JXFooterView *)footerView{
  if (!_footerView) {
    _footerView = [[JXFooterView alloc] init];
    __weak RecommendedCell *weakSelf = self;
    _footerView.clickGoods = ^(GoodsDataModel* goods){
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate clickGood:goods cell:weakSelf];
      }
    };

    _footerView.zanBlock =  ^(NSString* a){
      NSLog(@"zanClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate zanClick:weakSelf];
      }
//      weakSelf.footerView.isLike = weakSelf.model.like;
//      weakSelf.footerView.likesCount = weakSelf.model.likesCount;
    };

    _footerView.collectionBlock = ^(NSString* a){
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate collectionClick:weakSelf];
      }
//      weakSelf.footerView.isCollect = weakSelf.model.collect;
//      weakSelf.footerView.collectCount = weakSelf.model.collectCount;
    };

    _footerView.downloadBlock =  ^(NSString* a){
      NSLog(@"downloadClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate downloadClick:weakSelf];
      }
      weakSelf.footerView.downloadCount = weakSelf.model.downloadCount;
    };

    _footerView.shareBlock =  ^(NSString* a){
      NSLog(@"shareClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate shareClick:weakSelf];
      }
    };
    _footerView.addCarBlock = ^(GoodsDataModel* a){
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate addCar:a cell:weakSelf];
      }
    };
  }
  return _footerView;
}

- (void)awakeFromNib {
    [super awakeFromNib];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
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
  [bgView addSubview:self.bodyView];
  [bgView addSubview:self.footerView];
  [bgView addSubview:self.contentLab];
  [bgView addSubview:self.foldLabel];
  [bgView addSubview:self.jingpin];

  bgView.sd_layout
    .leftSpaceToView(self.contentView, 0)
    .rightSpaceToView(self.contentView, 0)
    .topSpaceToView(self.contentView, 5)
    .autoHeightRatio(0);

  self.headView.sd_layout
  .topSpaceToView(bgView, 9)
  .leftSpaceToView(bgView, 5)
  .rightSpaceToView(bgView, 5)
  .heightIs(34);

    //内容
  self.contentLab.sd_layout.topSpaceToView(self.headView, 0)
  .leftSpaceToView(bgView, 15)
  .rightSpaceToView(bgView, 15)
  .autoHeightRatio(0);
  [self.contentLab setMaxNumberOfLinesToShow:2];

  self.foldLabel.sd_layout.topSpaceToView(self.contentLab, 5)
  .leftSpaceToView(bgView, 45)
  .widthIs(40)
  .heightIs(20);

  //九宫格图片
  self.bodyView.sd_layout
  .topSpaceToView(self.contentLab, 0)
  .leftSpaceToView(bgView, 15);

    //
  self.footerView.sd_layout
  .topSpaceToView(self.bodyView, 10)
  .leftSpaceToView(bgView, 15)
  .rightSpaceToView(bgView, 0);

  self.jingpin.sd_layout.topSpaceToView(bgView, 5)
  .rightSpaceToView(bgView, 15)
  .widthIs(50).heightIs(50);

  [bgView setupAutoHeightWithBottomView:self.footerView bottomMargin:5];
  [self setupAutoHeightWithBottomView:bgView bottomMargin:5];
}

-(void)setModel:(JXModelData *)model{
  _model = model;
  self.headView.UserInfoModel = model.userInfoVO;
  self.headView.time = model.publishTimeStr;
  self.headView.hotCount = model.hotCount;

  if(model.showType==3){
    self.bodyView.imageType = YES;
  }else{
    self.bodyView.imageType = NO;
  }
  self.bodyView.sources = model.resource;
  if((model.createSource&&(model.createSource==2||model.createSource==4))){
    self.headView.type = NO;
    self.jingpin.hidden = NO;
  }else{
    self.headView.type = YES;
    self.jingpin.hidden = YES;
  }

    self.contentLab.text = model.content;
    if(model.content.length>0){
      self.contentLab.sd_layout.topSpaceToView(self.headView, 3);
      self.bodyView.sd_layout.topSpaceToView(self.contentLab, 6);

    }else{
      self.contentLab.sd_layout.topSpaceToView(self.headView, 0);
      self.bodyView.sd_layout.topSpaceToView(self.contentLab, 3);
    }

    self.footerView.products = model.products;
    self.footerView.downloadCount = model.downloadCount;
    self.footerView.likesCount = model.likesCount;
    self.footerView.shareCount = model.shareCount;
    self.footerView.collectCount = model.collectCount;
    self.footerView.isLike = model.like;
    self.footerView.isCollect = model.collect;

    self.foldLabel.sd_layout.heightIs(0);
    self.foldLabel.hidden = YES;

}

/**
 *  折叠展开按钮的点击事件
 *
 *  @param recognizer 点击手势
 */
- (void)foldNewsOrNoTap:(UITapGestureRecognizer *)recognizer{
    if(recognizer.state == UIGestureRecognizerStateEnded){

        if (self.cellDelegate && [self.cellDelegate respondsToSelector:@selector(clickFoldLabel:)]) {

            [self.cellDelegate clickFoldLabel:self];
        }
    }
}

-(void)labelTouchUpInside{
  if (self.cellDelegate) {
    [self.cellDelegate labelClick:self];
  }
}
/*
 * 返回结果即为包含每行文字的数组，行数即为count数
 * 该方法主要是预先的计算出文本在UIlable等控件中的显示情况，
 */
- (NSArray *)getSeparatedLinesFromLabel:(NSString *)string font:(UIFont *)font andLableWidth:(CGFloat)lableWidth{
  CTFontRef myFont = CTFontCreateWithName(( CFStringRef)([font fontName]), [font pointSize], NULL);
  NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc] initWithString:string];
  [attStr addAttribute:(NSString *)kCTFontAttributeName value:(__bridge  id)myFont range:NSMakeRange(0, attStr.length)];
  CFRelease(myFont);
  CTFramesetterRef frameSetter = CTFramesetterCreateWithAttributedString(( CFAttributedStringRef)attStr);
  CGMutablePathRef path = CGPathCreateMutable();
  CGPathAddRect(path, NULL, CGRectMake(0,0,lableWidth,100000));
  CTFrameRef frame = CTFramesetterCreateFrame(frameSetter, CFRangeMake(0, 0), path, NULL);
  NSArray *lines = ( NSArray *)CTFrameGetLines(frame);
  NSMutableArray *linesArray = [[NSMutableArray alloc]init];
  for (id line in lines) {
    CTLineRef lineRef = (__bridge  CTLineRef )line;
    CFRange lineRange = CTLineGetStringRange(lineRef);
    NSRange range = NSMakeRange(lineRange.location, lineRange.length);
    NSString *lineString = [string substringWithRange:range];
    CFAttributedStringSetAttribute((CFMutableAttributedStringRef)attStr, lineRange, kCTKernAttributeName, (CFTypeRef)([NSNumber numberWithFloat:0.0]));
    CFAttributedStringSetAttribute((CFMutableAttributedStringRef)attStr, lineRange, kCTKernAttributeName, (CFTypeRef)([NSNumber numberWithInt:0.0]));
    [linesArray addObject:lineString];
  }

  CGPathRelease(path);
  CFRelease( frame );
  CFRelease(frameSetter);
  return (NSArray *)linesArray;
}
@end
