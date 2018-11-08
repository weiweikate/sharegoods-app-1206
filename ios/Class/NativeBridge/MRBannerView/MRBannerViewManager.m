//
//  MRBannerViewManeger.m
//  slardarProject
//
//  Created by slardar chen on 2018/11/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MRBannerViewManager.h"
#import "UIImageView+WebCache.h"
@interface MRBannerViewManager()<TYCyclePagerViewDataSource,TYCyclePagerViewDelegate>
@property (nonatomic, strong) MRBannerView *swiperView;
@end

@implementation MRBannerViewManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(imgUrlArray, NSArray)
RCT_EXPORT_VIEW_PROPERTY(tittleArray, NSArray)
RCT_EXPORT_VIEW_PROPERTY(autoInterval,CGFloat)
RCT_EXPORT_VIEW_PROPERTY(autoLoop,BOOL)

RCT_EXPORT_VIEW_PROPERTY(onDidSelectItemAtIndex, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDidScrollToIndex, RCTBubblingEventBlock)

- (UIView *)view{
  MRBannerView *pagerView = [[MRBannerView alloc]init];
  pagerView.autoScrollInterval = 5.0;
  pagerView.isInfiniteLoop = true;
  pagerView.dataSource = self;
  pagerView.delegate = self;
  [pagerView registerClass:[MRBannerViewCell class] forCellWithReuseIdentifier:@"cellId"];
  _swiperView = pagerView;
  return _swiperView;
}

- (NSInteger)numberOfItemsInPagerView:(TYCyclePagerView *)pageView{
  return _swiperView.imgUrlArray.count;
}

- (__kindof UICollectionViewCell *)pagerView:(TYCyclePagerView *)pagerView cellForItemAtIndex:(NSInteger)index{
  MRBannerViewCell *cell = [pagerView dequeueReusableCellWithReuseIdentifier:@"cellId" forIndex:index];
  [cell.imgView sd_setImageWithURL:[NSURL URLWithString:_swiperView.imgUrlArray[index]] placeholderImage:nil];
  if (_swiperView.tittleArray && _swiperView.tittleArray.count>index) {
    cell.tittleLabel.text = _swiperView.tittleArray[index];
  }
  return cell;
}
- (TYCyclePagerViewLayout *)layoutForPagerView:(TYCyclePagerView *)pageView {
  TYCyclePagerViewLayout *layout = [[TYCyclePagerViewLayout alloc]init];
  layout.itemSize = CGSizeMake(CGRectGetWidth(pageView.frame)*0.8, CGRectGetHeight(pageView.frame));
  layout.itemSpacing = 15;
  return layout;
}

- (void)pagerView:(TYCyclePagerView *)pageView didScrollFromIndex:(NSInteger)fromIndex toIndex:(NSInteger)toIndex{
  if (_swiperView.onDidScrollToIndex) {
    _swiperView.onDidScrollToIndex(@{@"index":[NSNumber numberWithInteger:toIndex]});
  }
}

- (void)pagerView:(TYCyclePagerView *)pageView didSelectedItemCell:(__kindof UICollectionViewCell *)cell atIndex:(NSInteger)index{
  if (_swiperView.onDidSelectItemAtIndex) {
    _swiperView.onDidSelectItemAtIndex(@{@"index":[NSNumber numberWithInteger:index]});
  }
}
@end


@implementation MRBannerView
- (void)setImgUrlArray:(NSArray *)imgUrlArray{
  _imgUrlArray = [imgUrlArray copy];
  [self reloadData];
}

- (void)setAutoInterval:(CGFloat)autoInterval{
  self.autoScrollInterval = autoInterval;
}

- (void)setAutoLoop:(BOOL)autoLoop{
  self.isInfiniteLoop = autoLoop;
}


@end

@implementation MRBannerViewCell
- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.backgroundColor = [UIColor clearColor];
    
    UIImageView *imgView = [[UIImageView alloc]init];
    imgView.contentMode = UIViewContentModeScaleAspectFill;
    [self addSubview:imgView];
    _imgView = imgView;
    
    UILabel *tittleLabel = [[UILabel alloc] init];
    tittleLabel.font = [UIFont systemFontOfSize:14];
    tittleLabel.textColor = [UIColor whiteColor];
    [self addSubview:tittleLabel];
    _tittleLabel = tittleLabel;
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _imgView.frame = self.bounds;
  _tittleLabel.frame = CGRectMake(35, self.bounds.size.height - 23, self.bounds.size.width - 35 * 2, 14);
}

@end
