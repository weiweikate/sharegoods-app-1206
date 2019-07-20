//
//  ActivetyViewManager.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActivetyViewManager.h"
#import "ActiveView.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation ActivetyViewManager

RCT_EXPORT_MODULE(MrShowVideoListView)

RCT_EXPORT_VIEW_PROPERTY(onItemPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStartRefresh, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(uri, NSString)
RCT_EXPORT_VIEW_PROPERTY(params, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(headerHeight, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onStartScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEndScroll, RCTBubblingEventBlock)

- (UIView *)view
{
  ActiveView *view = [[ActiveView alloc]init];
  return view;
}


RCT_EXPORT_METHOD(replaceItemData:(nonnull NSNumber *)reactTag
                  index:(NSInteger) index
                  data:(id) data){
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, ActiveView *> *viewRegistry) {
    ActiveView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[ActiveView class]]) {
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

@end
