//
//  ASDK_ShowGround.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/27.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
NS_ASSUME_NONNULL_BEGIN

@interface ASDK_ShowGround : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onItemPress;
@property (nonatomic, copy) RCTBubblingEventBlock onStartRefresh;
@property (nonatomic, copy) RCTBubblingEventBlock onStartScroll;
@property (nonatomic, copy) RCTBubblingEventBlock onEndScroll;
@property (nonatomic, copy) RCTBubblingEventBlock onScrollStateChanged;
@property (nonatomic, copy) RCTBubblingEventBlock onScrollY;
@property (nonatomic, copy) RCTBubblingEventBlock goBack;

@property (nonatomic, copy) NSString* uri;
@property(nonatomic, strong)NSString *userType;
@property (nonatomic, copy) NSString* type;
@property (nonatomic, strong) NSDictionary* params;
@property (nonatomic, assign) NSInteger headerHeight;
-(void)replaceData:(NSInteger) index num:(NSInteger) num;
-(void)addDataToTopData:(NSDictionary*)data;

-(void)replaceItemData:(NSInteger)index data:(NSDictionary *)data;
-(void)scrollToTop;

@end

NS_ASSUME_NONNULL_END
