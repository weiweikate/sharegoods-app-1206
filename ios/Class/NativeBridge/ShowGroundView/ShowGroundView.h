//
//  ShowGroundView.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
NS_ASSUME_NONNULL_BEGIN

@interface ShowGroundView : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onItemPress;
@end

NS_ASSUME_NONNULL_END
