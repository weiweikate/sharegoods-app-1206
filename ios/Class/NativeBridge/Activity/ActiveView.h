//
//  ActiveView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>

NS_ASSUME_NONNULL_BEGIN

@interface ActiveView : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onItemPress;
@property (nonatomic, copy) RCTBubblingEventBlock onStartRefresh;
@property (nonatomic, copy) RCTBubblingEventBlock onStartScroll;
@property (nonatomic, copy) RCTBubblingEventBlock onEndScroll;
@property (nonatomic, copy) NSString* uri;
@property (nonatomic, strong) NSDictionary* params;
@property (nonatomic, assign) NSInteger headerHeight;
@end

NS_ASSUME_NONNULL_END
