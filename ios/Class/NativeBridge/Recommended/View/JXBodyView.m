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

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

//http://ww1.sinaimg.cn/crop.0.0.375.375.1024/6204ece1jw8ev8vuty1r2j20af0afq4h.jpg
@interface JXBodyView()
@property (nonatomic,strong) NSMutableArray *itemsArr;
@property (nonatomic,strong) NSMutableArray *actionSheetArr;
@property (nonatomic, strong) NSArray *imageViewsArray;

@end

@implementation JXBodyView

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
}



-(void)setSources:(NSArray<SourcesModel *> *)sources{
  
  NSMutableArray * arr = [NSMutableArray new];
  for(int i=0;i<sources.count;i++){
    if(sources[i].type==2){
      if(arr.count>9) return;
      [arr addObject:sources[i]];
    }
  }
  _sources = arr;
  for (long i=_sources.count; i<self.imageViewsArray.count; i++) {
    UIImageView *imageView = [self.imageViewsArray objectAtIndex:i];
    imageView.hidden = YES;
  }
    if (_sources.count == 0) {
      self.height_sd = 0;
      self.fixedHeight = @(0);
      return;
    }
  
        CGFloat itemW = [self itemWidthForPicPathArray:_sources];
        CGFloat itemH = 0;
        if (_sources.count < 3) {
            itemH = 140;
        } else {
            itemH = itemW;
        }
        long perRowItemCount = [self perRowItemCountForPicPathArray:_sources];
        CGFloat margin = 5;
        
        [_sources enumerateObjectsUsingBlock:^(SourcesModel *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            long columnIndex = idx % perRowItemCount;
            long rowIndex = idx / perRowItemCount;
            UIImageView *imageView = [self->_imageViewsArray objectAtIndex:idx];
            imageView.backgroundColor = [UIColor colorWithHexString:@"a5adb3"];
          [imageView sd_setImageWithURL:[NSURL URLWithString:_sources[idx].url] placeholderImage:[UIImage imageNamed:@"default_avatar"]];
          
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
  if(self.imgBlock){
    self.imgBlock(self.sources,tap.view.tag);
  }
    
}

- (CGFloat)itemWidthForPicPathArray:(NSArray *)array
{
  if (array.count == 1){
      return (SCREEN_WIDTH-190);
  }else if(array.count==4||array.count==2) {
      return (SCREEN_WIDTH-95)/2;
    } else {
      CGFloat w =  (SCREEN_WIDTH-105)/3;
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
