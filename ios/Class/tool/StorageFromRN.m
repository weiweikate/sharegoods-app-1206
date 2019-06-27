//
//  StorageFromRN.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/1/23.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "StorageFromRN.h"
#import "NSDictionary+Util.h"
#import <RNCAsyncStorage/RNCAsyncStorage.h>

static NSString *const RCTStorageDirectory = @"RCTAsyncLocalStorage_V1";
static NSString *const RCTManifestFileName = @"manifest.json";
static NSString *const ProductHost = @"https://api.sharegoodsmall.com/gateway";

static NSString *RCTGetStorageDirectory()
{
  static NSString *storageDirectory = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
#if TARGET_OS_TV
    storageDirectory = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
#else
    storageDirectory = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
#endif
    storageDirectory = [storageDirectory stringByAppendingPathComponent:RCTStorageDirectory];
  });
  return storageDirectory;
}

@implementation StorageFromRN
+(NSString *)getItem:(NSString *)key{
  NSString * path = [NSString stringWithFormat:@"%@/%@",RCTGetStorageDirectory(), RCTManifestFileName];
  NSData *data = [[NSData alloc] initWithContentsOfFile:path];
  if (data) {
    NSDictionary * dic = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
    return dic[key];
  }
  return nil;
}

+ (NSDictionary *)configDic
{
  NSString * HostJson = [StorageFromRN getItem:@"@mr/hostJson"];
  NSDictionary *dic = @{};
  if (HostJson) {
    dic =  [NSDictionary dictionaryWithJsonString:HostJson];
  }
  return dic;
}

+(NSString *)getHost
{
  NSDictionary *dic = [self configDic];
  NSString * path = dic[@"host"];
  if (path==nil || path.length == 0) {
    path = ProductHost;
  }
  return path;
}

+(NSString *)getSG_Token{
   NSString * token = [StorageFromRN getItem:@"@mr/userToken"];
  if (token) {
    token = [token stringByReplacingOccurrencesOfString:@"\"" withString:@""];
    return token;
  }
  return @"";
}

+(NSString *)getGongMao
{
  NSDictionary *dic = [self configDic];
  NSString * path = dic[@"gongmao"];
  if (path==nil || path.length == 0) {
    path = @"https://api.sharegoodsmall.com/gateway/gongmall/contract/reback";
  }
  return path;
}

+(NSString *)getTrackAddress{
  if ([[self getHost] isEqualToString:ProductHost]) {
    return SA_SERVER_URL_production;
  }else{
     return SA_SERVER_URL_default;
  }
}
@end
