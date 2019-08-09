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

@property (nonatomic, copy) NSString* uri;
@property (nonatomic, strong) NSDictionary* params;
@property (nonatomic, assign) NSInteger headerHeight;
@property (nonatomic, copy) NSString* userCode;

@property (nonatomic, copy) RCTBubblingEventBlock onAttentionPress;
@property (nonatomic, copy) RCTBubblingEventBlock onBack;
@property (nonatomic, copy) RCTBubblingEventBlock onPressTag;
@property (nonatomic, copy) RCTBubblingEventBlock onSharePress;
@property (nonatomic, copy) RCTBubblingEventBlock onBuy;
@property (nonatomic, copy) RCTBubblingEventBlock onSeeUser;

@property (nonatomic, copy) RCTBubblingEventBlock onZanPress;
@property (nonatomic, copy) RCTBubblingEventBlock onDownloadPress;
@property (nonatomic, copy) RCTBubblingEventBlock onCollection;




@end

NS_ASSUME_NONNULL_END
