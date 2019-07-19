//
//  JXBodyView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXBodyView.h"
#import "UIView+SDAutoLayout.h"
//#import "KNPhotoBrowser.h"
#import "UIImageView+WebCache.h"
#import "NSString+UrlAddParams.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

//http://ww1.sinaimg.cn/crop.0.0.375.375.1024/6204ece1jw8ev8vuty1r2j20af0afq4h.jpg
@interface JXBodyView()
@property (nonatomic,strong) NSMutableArray *itemsArr;
@property (nonatomic,strong) NSMutableArray *actionSheetArr;
@property (nonatomic, strong) NSArray *imageViewsArray;
@property (nonatomic,strong) UIView *bgView;
@property (nonatomic,strong) UIImageView *bgImage;

@end

@implementation JXBodyView

-(UIView *)bgView{
  if(!_bgView){
    _bgView = [[UIView alloc]init];
    _bgView.hidden = YES;
    _bgView.layer.cornerRadius = 5;
    _bgView.backgroundColor = [UIColor colorWithRed:0/255.0 green:0/255.0 blue:0/255.0 alpha:0.1];
  }
  return _bgView;
}

-(UIImageView *)bgImage{
  if(!_bgImage){
    _bgImage = [[UIImageView alloc]init];
    _bgImage.hidden = YES;
    _bgImage.image = [UIImage imageNamed:@"vedio"];
  }
  return _bgImage;
}

- (NSMutableArray *)itemsArr{
    if (!_itemsArr) {
        _itemsArr = [NSMutableArray array];
    }
    return _itemsArr;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
      [self setUp];
//      [self setUI];
  }
  return self;
}

// the first imageView is outside of the Window
- (void)setUp{
    NSMutableArray *temp = [NSMutableArray new];

    for (int i = 0; i < 9; i++) {
        UIImageView *imageView = [UIImageView new];
        [self addSubview:imageView];
        imageView.userInteractionEnabled = YES;
        imageView.clipsToBounds = YES;
        imageView.contentMode = UIViewContentModeScaleAspectFill;
        //设置圆角
        imageView.layer.cornerRadius = 5;
        //将多余的部分切掉
        imageView.layer.masksToBounds = YES;
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapImageView:)];
        [imageView addGestureRecognizer:tap];
        tap.view.tag = i;
        [temp addObject:imageView];
    }
    self.imageViewsArray = [temp copy];
  
  [self addSubview:self.bgView];
  [self.bgView addSubview:self.bgImage];

  self.bgView.sd_layout
  .leftEqualToView(self)
  .topEqualToView(self)
  .widthIs(SCREEN_WIDTH-158).heightIs(SCREEN_WIDTH-158);

  self.bgImage.sd_layout
  .centerYEqualToView(self.bgView)
  .centerXEqualToView(self.bgView)
  .widthIs(53).heightIs(53);
}


-(void)setImageType:(BOOL)imageType{
  _imageType = imageType;
  if(imageType){
    self.bgView.hidden = NO;
    self.bgImage.hidden = NO;
  }else{
    self.bgView.hidden = YES;
    self.bgImage.hidden = YES;
  }
}

-(void)setSources:(NSArray<SourcesModel *> *)sources{

  NSMutableArray * arr = [NSMutableArray new];
  for(int i=0;i<sources.count;i++){
    if(self.imageType){
      if(sources[i].type==5){
        if(arr.count>1) break;
        [arr addObject:sources[i]];
      }
    }else{
      if(sources[i].type==2){
        if(arr.count>9) break;
        [arr addObject:sources[i]];
      }
    }
  }
  _sources = arr;
  for (long i=_sources.count; i<self.imageViewsArray.count; i++) {
    UIImageView *imageView = [self.imageViewsArray objectAtIndex:i];
    imageView.hidden = YES;
  }
    if (_sources.count == 0) {
      self.bgView.hidden = YES;
      self.bgImage.hidden = YES;
      self.height_sd = 0;
      self.fixedHeight = @(0);
      return;
    }
  
        CGFloat itemW = [self itemWidthForPicPathArray:_sources];
        CGFloat itemH = 0;
        if (_sources.count < 2) {
            itemH = itemW;
        } else {
            itemH = itemW;
        }
        long perRowItemCount = [self perRowItemCountForPicPathArray:_sources];
        CGFloat margin = 5;

        [_sources enumerateObjectsUsingBlock:^(SourcesModel *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {

            long columnIndex = idx % perRowItemCount;
            long rowIndex = idx / perRowItemCount;
            UIImageView *imageView = [self->_imageViewsArray objectAtIndex:idx];
            imageView.backgroundColor = [UIColor colorWithHexString:@"f5f5f5"];

          NSString * showImage = _sources[idx].url?_sources[idx].url:@"";
          [imageView setImageWithURL:[NSURL URLWithString:[showImage getUrlAndWidth:itemW height:itemH]] placeholder:[UIImage imageWithColor:[UIColor colorWithHexString:@"f5f5f5"]]];

            imageView.hidden = NO;
            imageView.frame = CGRectMake(columnIndex * (itemW + margin), rowIndex * (itemH + margin), itemW, itemH);
        }];
  
        CGFloat w = perRowItemCount * itemW + (perRowItemCount - 1) * margin;
        int columnCount = ceilf(_sources.count * 1.0 / perRowItemCount);
        CGFloat h = columnCount * itemH + (columnCount - 1) * margin;
        self.width_sd = w;
        self.height_sd = h;
        self.fixedHeight = @(h);
        self.fixedWidth = @(w);
}


#pragma mark - private actions

- (void)tapImageView:(UITapGestureRecognizer *)tap
{
  if(self.imgBlock&&!self.imageType){
    self.imgBlock(self.sources,tap.view.tag);
  }

}

- (CGFloat)itemWidthForPicPathArray:(NSArray *)array
{
  if (array.count == 1){
      if(self.imageType){
      
      }
      return (SCREEN_WIDTH-158);
  }else if(array.count==4||array.count==2) {
      return (SCREEN_WIDTH-161)/2;
    } else {
      CGFloat w =  (SCREEN_WIDTH-60)/3;
      return w;
    }
}

- (NSInteger)perRowItemCountForPicPathArray:(NSArray *)array
{
    if (array.count <= 4) {
      return array.count==4? 2 : array.count;
    } else {
        return 3;
    }
}



//-(void)setUI{
////    CGFloat viewWidth = self.frame.size.width;
//
//    // NineSquare view as a base view
//    NSLog(@"setUI=%@",self.urlArr);
//
//    for (NSInteger i = 0 ;i < self.urlArr.count; i ++) {
//        UIImageView *imageView = [[UIImageView alloc] init];
//        imageView.userInteractionEnabled = YES;
//        [imageView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(imageViewDidClick:)]];
//        imageView.tag = i + 1;
//        [imageView sd_setImageWithURL:_urlArr[i] placeholderImage:[self createImageWithUIColor:[UIColor grayColor]]];
//        imageView.backgroundColor = [UIColor grayColor];
//        if(self.urlArr.count<3){
//            CGFloat width = (SCREEN_WIDTH-80 - 40) / self.urlArr.count;
//            NSInteger row = i / 3;
//            NSInteger col = i % 3;
//            CGFloat x = 10 + col * (10 + width);
//            CGFloat y = 10 + row * (10 + width);
//            imageView.frame = CGRectMake(x, y, width, width);
//
//        }else{
//            CGFloat width = (SCREEN_WIDTH-80 - 40) / 3;
//            NSInteger row = i / 3;
//            NSInteger col = i % 3;
//            CGFloat x = 10 + col * (10 + width);
//            CGFloat y = 10 + row * (10 + width);
//            imageView.frame = CGRectMake(x, y, width, width);
//        }
//
//
//        KNPhotoItems *items = [[KNPhotoItems alloc] init];
//        items.url = [self.urlArr[i] stringByReplacingOccurrencesOfString:@"thumbnail" withString:@"bmiddle"];
//        items.sourceView = imageView;
//        [self.itemsArr addObject:items];
//
//        [self addSubview:imageView];
//        [self setupAutoHeightWithBottomView:imageView bottomMargin:10];
//
//    }
//}
//
//- (void)imageViewDidClick:(UITapGestureRecognizer *)tap{
//        KNPhotoBrowser *photoBrower = [[KNPhotoBrowser alloc] init];
//        photoBrower.itemsArr = [self.itemsArr copy];
//        photoBrower.isNeedPageControl = true;
//        photoBrower.isNeedPageNumView = true;
//        photoBrower.isNeedRightTopBtn = true;
//        photoBrower.isNeedPictureLongPress = true;
//        photoBrower.isNeedPrefetch = true;
//        photoBrower.currentIndex = tap.view.tag;
//        photoBrower.delegate = self;
//        [photoBrower present];
//}
//

@end
