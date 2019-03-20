//
//  MRBannerViewManeger.m
//  slardarProject
//
//  Created by slardar chen on 2018/11/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MRBannerViewManager.h"
#import "TYCyclePagerView.h"
#import "UIImageView+WebCache.h"

@implementation MRBannerViewManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(imgUrlArray, NSArray)
RCT_EXPORT_VIEW_PROPERTY(tittleArray, NSArray)
RCT_EXPORT_VIEW_PROPERTY(autoInterval,CGFloat)
RCT_EXPORT_VIEW_PROPERTY(itemWidth,CGFloat)
RCT_EXPORT_VIEW_PROPERTY(itemSpace,CGFloat)
RCT_EXPORT_VIEW_PROPERTY(autoLoop,BOOL)
RCT_EXPORT_VIEW_PROPERTY(itemRadius,CGFloat)
RCT_EXPORT_VIEW_PROPERTY(onDidSelectItemAtIndex, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDidScrollToIndex, RCTBubblingEventBlock)

- (UIView *)view{
  MRBannerView *pagerView = [[MRBannerView alloc]init];
  return pagerView;
}

@end

static CGFloat initAutoInterval = 0;

@interface MRBannerView()<TYCyclePagerViewDataSource,TYCyclePagerViewDelegate>
@property (nonatomic,strong) TYCyclePagerView* pgView;

@end

@implementation MRBannerView

- (instancetype)init{
  if (self = [super init]) {
    TYCyclePagerView *View = [[TYCyclePagerView alloc] init];
    View.delegate = self;
    View.dataSource = self;
    View.autoScrollInterval = 5.0;
    View.isInfiniteLoop = true;
    [View registerClass:[MRBannerViewCell class] forCellWithReuseIdentifier:@"MRBannerViewCell"];
    [self addSubview:View];
    _pgView = View;
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _pgView.frame = self.bounds;
}

- (void)setImgUrlArray:(NSArray *)imgUrlArray{
  _imgUrlArray = [imgUrlArray copy];
  [_pgView updateData];
}

- (void)setAutoInterval:(CGFloat)autoInterval{
  _pgView.autoScrollInterval = autoInterval;
  initAutoInterval = autoInterval;
}

- (void)setAutoLoop:(BOOL)autoLoop{
  _pgView.autoScrollInterval = autoLoop && initAutoInterval ? initAutoInterval : 0;
}

- (NSInteger)numberOfItemsInPagerView:(TYCyclePagerView *)pageView{
  return _imgUrlArray.count;
}

- (__kindof UICollectionViewCell *)pagerView:(TYCyclePagerView *)pagerView cellForItemAtIndex:(NSInteger)index{
  MRBannerViewCell *cell = [pagerView dequeueReusableCellWithReuseIdentifier:@"MRBannerViewCell" forIndex:index];
  if (_itemRadius) {
    cell.layer.masksToBounds = YES;
    cell.layer.cornerRadius = _itemRadius;
  }
  NSString *tempUrlString = _imgUrlArray[index];
  [cell.imgView sd_setImageWithURL:[NSURL URLWithString: [tempUrlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]] placeholderImage:nil];
  if (_tittleArray && _tittleArray.count>index) {
    cell.tittleLabel.text = _tittleArray[index];
  }
  return cell;
}
- (TYCyclePagerViewLayout *)layoutForPagerView:(TYCyclePagerView *)pageView {
  TYCyclePagerViewLayout *layout = [[TYCyclePagerViewLayout alloc]init];
  if (_itemSpace && _itemWidth) {
    layout.itemSize = CGSizeMake(_itemWidth, CGRectGetHeight(pageView.frame));
    layout.itemSpacing = _itemSpace;
  }else{
    layout.itemSize = CGSizeMake(CGRectGetWidth(pageView.frame), CGRectGetHeight(pageView.frame));
  }
  return layout;
}

- (void)pagerView:(TYCyclePagerView *)pageView didScrollFromIndex:(NSInteger)fromIndex toIndex:(NSInteger)toIndex{
  if (_onDidScrollToIndex) {
    _onDidScrollToIndex(@{@"index":[NSNumber numberWithInteger:toIndex]});
  }
}

- (void)pagerView:(TYCyclePagerView *)pageView didSelectedItemCell:(__kindof UICollectionViewCell *)cell atIndex:(NSInteger)index{
  if (_onDidSelectItemAtIndex) {
    _onDidSelectItemAtIndex(@{@"index":[NSNumber numberWithInteger:index]});
  }
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
