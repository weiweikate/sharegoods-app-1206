//
//  MRBannerViewManeger.h
//  slardarProject
//
//  Created by slardar chen on 2018/11/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN
/**
 js中引入 var RCTMRBannerView = requireNativeComponent('MRBannerView3', null)中模块MRBannerView3来源
 类中RCT_EXPORT_MODULE()
 无参数,类名MRBannerView3Manager-Manager=MRBannerView3
 有参数,不要带Manager,RCT_EXPORT_MODULE(MRBannerView4)=MRBannerView4
 */
@interface MRBannerViewManager : RCTViewManager

@end


@interface MRBannerView : UIView
/**图片url数组*/
@property (nonatomic, copy) NSArray *imgUrlArray;
/**tittle数组*/
@property (nonatomic, copy) NSArray *tittleArray;
/**滚动间隔*/
@property (nonatomic, assign) CGFloat autoInterval;
/**卡片宽*/
@property (nonatomic, assign) CGFloat itemWidth;
/**视图间距*/
@property (nonatomic, assign) CGFloat itemSpace;
/**圆角*/
@property (nonatomic, assign) CGFloat itemRadius;
/**循环*/
@property (nonatomic, assign) BOOL autoLoop;
/**点击事件*/
@property (nonatomic, copy) RCTBubblingEventBlock onDidSelectItemAtIndex;
/**滚动事件*/
@property (nonatomic, copy) RCTBubblingEventBlock onDidScrollToIndex;

@end


@interface MRBannerViewCell : UICollectionViewCell
@property (nonatomic, strong) UIImageView *imgView;
@property (nonatomic, strong) UILabel *tittleLabel;
@end

NS_ASSUME_NONNULL_END
