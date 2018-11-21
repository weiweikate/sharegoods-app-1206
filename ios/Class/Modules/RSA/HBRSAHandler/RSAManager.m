//
//  RSAManager.m
//  crm_app_xiugou
//
//  Created by Max on 2018/11/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RSAManager.h"
#import "HBRSAHandler.h"

//const static  NSString * private_key_string = @"";
//const static  NSString * public_key_string = @"";

#define private_key_string @""
#define public_key_string @""
@interface RSAManager()


@end

@implementation RSAManager
{
  HBRSAHandler* _handler;
}
SINGLETON_FOR_CLASS(RSAManager)

-(instancetype)init{
  if (self = [super init]) {
    [self initPrivateKey];
  }
  return self;
}
-(void)initPrivateKey{
  HBRSAHandler * hander = [HBRSAHandler new];
  [hander importKeyWithType:KeyTypePrivate andkeyString:private_key_string];
  _handler = hander;
}
/**
 SHA1形式加签
 @param string 加签字符串
 @return 加签后的结果
 */
-(NSString *)signSHA1String:(NSString *)string{
  if (string && [string length] > 0 ) {
    NSString * result = [_handler signString:string];
    return result;
  }
  return @"";
}
/**
 MD5形式加签
 @param string 加签字符串
 @return 加签结果
 */
-(NSString *)signMD5String:(NSString *)string{
  if (string && string.length > 0) {
    NSString * result = [_handler signMD5String:string];
    return result;
  }
  return @"";
}
@end
