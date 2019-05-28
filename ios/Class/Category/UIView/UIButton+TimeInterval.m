//
//  UIButton+TimeInterval.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "UIButton+TimeInterval.h"
#import <objc/runtime.h>
#define defaultInterval 1  //默认时间间隔

@interface UIButton ()

/**
 *  bool YES 忽略点击事件   NO 允许点击事件
 */
@property (nonatomic, assign) BOOL isIgnoreEvent;

@end

@implementation UIButton (TimeInterval)

/**
 应用启动时，hook住所有按钮的event
 */
+ (void)load{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    SEL selA = @selector(sendAction:to:forEvent:);
    SEL selB = @selector(mySendAction:to:forEvent:);
    Method methodA =   class_getInstanceMethod(self,selA);
    Method methodB = class_getInstanceMethod(self, selB);
    BOOL isAdd = class_addMethod(self, selA, method_getImplementation(methodB), method_getTypeEncoding(methodB));
    if (isAdd) {
      class_replaceMethod(self, selB, method_getImplementation(methodA), method_getTypeEncoding(methodA));
    }else{
      method_exchangeImplementations(methodA, methodB);
    }
  });
}

- (void)mySendAction:(SEL)action to:(id)target forEvent:(UIEvent *)event
{  
  self.timeInterval = self.timeInterval == 0 ? defaultInterval : self.timeInterval;
  if (self.isIgnoreEvent){
    return;
  }else if (self.timeInterval > 0){
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(self.timeInterval * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [self setIsIgnoreEvent:NO];
    });
  }
  
  self.isIgnoreEvent = YES;
  // 这里看上去会陷入递归调用死循环，但在运行期此方法是和sendAction:to:forEvent:互换的，相当于执行sendAction:to:forEvent:方法，所以并不会陷入死循环。
  [self mySendAction:action to:target forEvent:event];

  
}

// MARK: - 运行时设置分类属性
- (NSTimeInterval)timeInterval
{
  return [objc_getAssociatedObject(self, _cmd) doubleValue];
}
- (void)setTimeInterval:(NSTimeInterval)timeInterval
{
  objc_setAssociatedObject(self, @selector(timeInterval), @(timeInterval), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
- (BOOL)isIgnoreEvent{
  return [objc_getAssociatedObject(self, _cmd) boolValue];
}
- (void)setIsIgnoreEvent:(BOOL)isIgnoreEvent{
  objc_setAssociatedObject(self, @selector(isIgnoreEvent), @(isIgnoreEvent), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

@end
