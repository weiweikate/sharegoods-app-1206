//
//  RCTAsyncLocalStorage+ex.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <React/RCTAsyncLocalStorage.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTAsyncLocalStorage (ex)
-(void)getItems:(NSArray<NSString *> *)keys;
-(void)getItem:(NSArray<NSString *> *)key;
- (NSDictionary *)_ensureSetup;
@end

NS_ASSUME_NONNULL_END
