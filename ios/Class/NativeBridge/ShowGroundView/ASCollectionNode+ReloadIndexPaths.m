//
//  ASCollectionNode+ReloadIndexPaths.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/28.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ASCollectionNode+ReloadIndexPaths.h"

@implementation ASCollectionNode (ReloadIndexPaths)
+ (void)load
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    
    NSArray *selStringsArray = @[@"reloadData", @"reloadItemsAtIndexPaths:"];
    
    [selStringsArray enumerateObjectsUsingBlock:^(NSString *selString, NSUInteger idx, BOOL *stop) {
      NSString *mySelString = [@"js_" stringByAppendingString:selString];
      
      Method originalMethod = class_getInstanceMethod(self, NSSelectorFromString(selString));
      Method myMethod = class_getInstanceMethod(self, NSSelectorFromString(mySelString));
      method_exchangeImplementations(originalMethod, myMethod);
    }];
  });
}
- (void)setJs_reloadIndexPaths:(NSArray *)js_reloadIndexPaths{
  objc_setAssociatedObject(self, @selector(js_reloadIndexPaths), js_reloadIndexPaths, OBJC_ASSOCIATION_COPY_NONATOMIC);
}
- (NSArray *)js_reloadIndexPaths{
  return objc_getAssociatedObject(self, _cmd);
}

- (void)js_reloadData
{
  self.js_reloadIndexPaths = [self.indexPathsForVisibleItems copy];
  [self js_reloadData];
}
- (void)js_reloadItemsAtIndexPaths:(NSArray*)indexPaths
{
  self.js_reloadIndexPaths = [indexPaths copy];
  [self js_reloadItemsAtIndexPaths: indexPaths];
}

@end
