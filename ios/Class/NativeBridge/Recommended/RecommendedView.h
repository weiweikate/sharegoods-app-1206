//
//  RecommendedView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RecommendedView : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onItemPress;
@property (nonatomic, copy) RCTBubblingEventBlock onNineClick;
@property (nonatomic, copy) RCTBubblingEventBlock onAddCartClick;
@property (nonatomic, copy) RCTBubblingEventBlock onZanPress;
@property (nonatomic, copy) RCTBubblingEventBlock onDownloadPress;
@property (nonatomic, copy) RCTBubblingEventBlock onSharePress;
@property (nonatomic, copy) RCTBubblingEventBlock onPressProduct;

@property (nonatomic, copy) RCTBubblingEventBlock onScrollStateChanged;
@property (nonatomic, copy) RCTBubblingEventBlock onScrollY;
@property (nonatomic, copy) RCTBubblingEventBlock onStartRefresh;
@property (nonatomic, copy) RCTBubblingEventBlock onStartScroll;
@property (nonatomic, copy) RCTBubblingEventBlock onEndScroll;
@property (nonatomic, copy) NSString* uri;
@property (nonatomic, strong) NSDictionary* params;
@property (nonatomic, assign) NSInteger headerHeight;

-(void)replaceData:(NSInteger) index num:(NSInteger) num;

-(void)replaceItemData:(NSInteger) index data:(NSDictionary*) data;

-(void)scrollToTop;
@end

NS_ASSUME_NONNULL_END
