//
//  RCTAsyncLocalStorage+ex.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RCTAsyncLocalStorage+ex.h"
#import "YYKit.h"
#import <React/RCTUtils.h>

@implementation RCTAsyncLocalStorage (ex)

-(void)getItems:(NSArray<NSString *> *)keys
{
 NSDictionary *errorOut =  [self _ensureSetup];
//  if (errorOut) {
//    //    callback(@[@[errorOut], (id)kCFNull]);
//    return;
//  }
//  NSMutableArray<NSDictionary *> *errors;
//  NSMutableArray<NSArray<NSString *> *> *result = [[NSMutableArray alloc] initWithCapacity:keys.count];
//  for (NSString *key in keys) {
//    id keyError;
//    id value =[self performSelectorWithArgs:selector, key, &keyError ];
//    [result addObject:@[key, RCTNullIfNil(value)]];
//
////        RCTAppendError(keyError, &errors);
//  }
//  NSLog(@"%@", result);
//    callback(@[RCTNullIfNil(errors), result]);
}
-(void)getItem:(NSArray<NSString *> *)key{
  NSLog(@"1111");
}
@end
