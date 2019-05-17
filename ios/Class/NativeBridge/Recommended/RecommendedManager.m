//
//  RecommendedManager.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedManager.h"
#import "RecommendedView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RecommendedManager

RCT_EXPORT_MODULE(ShowRecommendView)


RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNineClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onZanPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDownloadPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSharePress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAddCartClick, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onScrollStateChanged, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollY, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(userIsLogin, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onStartScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEndScroll, RCTBubblingEventBlock)

- (UIView *)view
{
  RecommendedView *view = [[RecommendedView alloc]init];
  return view;
}

RCT_EXPORT_METHOD(replaceData:(nonnull NSNumber *)reactTag
                  index:(NSInteger) index
                  num:(NSInteger) num){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RecommendedView *> *viewRegistry) {
    RecommendedView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RecommendedView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view replaceData:index num:num];
    }
  }];
}

RCT_EXPORT_METHOD(replaceItemData:(nonnull NSNumber *)reactTag
                  index:(NSInteger) index
                  data:(id) data){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RecommendedView *> *viewRegistry) {
    RecommendedView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RecommendedView class]]) {
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
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RecommendedView *> *viewRegistry) {
    RecommendedView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RecommendedView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCUIWebView, got: %@", view);
    } else {
      [view scrollToTop];
    }
  }];
}

@end
