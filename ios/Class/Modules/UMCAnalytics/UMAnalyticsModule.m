
#import <UMAnalytics/MobClick.h>
#import "UMAnalyticsModule.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

@implementation UMAnalyticsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(onEvent:(NSString *)eventId)
{
  if (eventId == nil || [eventId isKindOfClass:[NSNull class]]) {
    return;
  }
  [MobClick event:eventId];
}

RCT_EXPORT_METHOD(onEventWithLabel:(NSString *)eventId eventLabel:(NSString *)eventLabel)
{
  if (eventId == nil || [eventId isKindOfClass:[NSNull class]]) {
    return;
  }
  if ([eventLabel isKindOfClass:[NSNull class]]) {
    eventLabel = nil;
  }
  [MobClick event:eventId label:eventLabel];

}

RCT_EXPORT_METHOD(onEventWithMap:(NSString *)eventId parameters:(NSDictionary *)parameters)
{
  if (eventId == nil || [eventId isKindOfClass:[NSNull class]]) {
    return;
  }
  if (parameters == nil && [parameters isKindOfClass:[NSNull class]]) {
    parameters = nil;
  }
  [MobClick event:eventId attributes:parameters];
}

RCT_EXPORT_METHOD(onEventWithMapAndCount:(NSString *)eventId parameters:(NSDictionary *)parameters eventNum:(int)eventNum)
{
  if (eventId == nil || [eventId isKindOfClass:[NSNull class]]) {
    return;
  }
  if (parameters == nil && [parameters isKindOfClass:[NSNull class]]) {
    parameters = nil;
  }
  
  [MobClick event:eventId attributes:parameters counter:eventNum];
}

RCT_EXPORT_METHOD(onPageStart:(NSString *)pageName)
{
  if (pageName == nil || [pageName isKindOfClass:[NSNull class]]) {
    return;
  }
  [MobClick beginLogPageView:pageName];
}

RCT_EXPORT_METHOD(onPageEnd:(NSString *)pageName)
{
  if (pageName == nil || [pageName isKindOfClass:[NSNull class]]) {
    return;
  }
  [MobClick endLogPageView:pageName];
}

RCT_EXPORT_METHOD(profileSignInWithPUID:(NSString *)puid)
{
  if (puid == nil || [puid isKindOfClass:[NSNull class]]) {
    return;
  }
  [MobClick profileSignInWithPUID:puid];
}

RCT_EXPORT_METHOD(profileSignInWithPUIDWithProvider:(NSString *)provider puid:(NSString *)puid)
{
  if (provider == nil && [provider isKindOfClass:[NSNull class]]) {
    provider = nil;
  }
  if (puid == nil || [puid isKindOfClass:[NSNull class]]) {
    return;
  }
  
  [MobClick profileSignInWithPUID:puid provider:provider];
}

RCT_EXPORT_METHOD(profileSignOff)
{
  [MobClick profileSignOff];
}

@end
