//
//  GongMaoVC.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/5.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JRBaseVC.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
NS_ASSUME_NONNULL_BEGIN

@interface GongMaoVC : UIViewController
@property(nonatomic, copy)NSString *url;
@property(nonatomic, copy)RCTPromiseResolveBlock resolver;
@property(nonatomic, copy)NSString *webConstTitle;
@end

NS_ASSUME_NONNULL_END
