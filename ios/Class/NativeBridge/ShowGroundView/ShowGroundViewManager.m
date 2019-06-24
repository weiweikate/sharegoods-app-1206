//
//  ShowGroundViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowGroundViewManager.h"
#import "ShowGroundView.h"
#import "ASDK_ShowGround.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
@implementation ShowGroundViewManager
RCT_EXPORT_MODULE(ShowGroundView)


RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(type, NSString)

RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onScrollStateChanged, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollY, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStartScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEndScroll, RCTBubblingEventBlock)
- (UIView *)view
{
  ASDK_ShowGround *view = [[ASDK_ShowGround alloc] init];
  return view;
}

RCT_EXPORT_METHOD(replaceData:(nonnull NSNumber *)reactTag
                  index:(NSInteger) index
                  num:(NSInteger) num){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, ASDK_ShowGround *> *viewRegistry) {
    ASDK_ShowGround *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[ASDK_ShowGround class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view replaceData:index num:num];
    }
  }];
}

RCT_EXPORT_METHOD(addDataToTop:(nonnull NSNumber *)reactTag
                  data:(id) data){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, ASDK_ShowGround *> *viewRegistry) {
    ASDK_ShowGround *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[ASDK_ShowGround class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view addDataToTopData:[self convertjsonStringToDict:data]];
    }
  }];
}

RCT_EXPORT_METHOD(replaceItemData:(nonnull NSNumber *)reactTag
                  index:(NSInteger) index
                  data:(id) data){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, ASDK_ShowGround *> *viewRegistry) {
    ASDK_ShowGround *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[ASDK_ShowGround class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view replaceItemData:index data:[self convertjsonStringToDict:data]];
    }
  }];
}


- (NSDictionary *)convertjsonStringToDict:(NSString *)jsonString{
  NSDictionary *retDict = nil;
  if ([jsonString isKindOfClass:[NSString class]]) {
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    retDict = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:NULL];
    return  retDict;
  }else{
    return retDict;
  }
  
}

RCT_EXPORT_METHOD(scrollToTop:(nonnull NSNumber *)reactTag){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, ASDK_ShowGround *> *viewRegistry) {
    ASDK_ShowGround *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[ASDK_ShowGround class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view scrollToTop];
    }
  }];
}

@end
