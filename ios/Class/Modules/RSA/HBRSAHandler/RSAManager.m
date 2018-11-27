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

#define private_key_string @"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCKGaNlyPmvTbbY6b8RcpgYJiu8Ewi6ygBD3mWuNv2l/+Wq8IvKPnmXIxm644obXbcLv5QrYBaFHBHswny3xHQemNqgIkYJ+Cbc0eZqKuXdbjMeJ8cdFmRPUZHpbFxVoWBvcCxIX3cvscJRkTwCt2TeWCOazGo6lc6dXokEacDXDUjXGTEJqs4X1pV5ON37nTrx7RhpgeBYKOUX/Ow+ON1fZvWONcmPJXzlFHgUTbIc23CV2X9d4sYZZQHjED1+mZ5oRZZpEUXX/yxI0tv94R+zD7+0I+SsIDlunnypWBT74/lCcHW+nCODp2ostDXMhTB2SDLXy+70yYnZqHw0398jAgMBAAECggEAUpPKFM78HksGDuaWjcRMFgSdGjT3f1nSlsKhYm8XdO9zUafMrv50jl86v3nX101OawP/gYBPdwC15zDUir46ASG9eQuFfeiYtGn+sXU9Rg7jGiEG+umsyZEpAr7852c71uboU85h4m8UltmVXLp04k8p2yJoUufJSGiC3dSurugo9G31sqRI1f1IMbwdDosd6SODBk0MgmBzVOEDj786U8LlGTXQjyn/T909bLlTkszMeGBtDWnVfeFqmENpQ+0sJU+UyQQGZWKiklxcCCAv6dtci/W6/h2gMdbkMmYKAaV39Q1V9TBNaRVkL9+GuIL1tDu2kFpi8AtwHDQJuT3kAQKBgQDnUhJftK4vQus0bcxF/9kPC+6nN3d5pzIbozbAw3la0hj7qr8GzL0OQbiiQsiS8Irdf7XYsetpjSUABwAjwPps8NbatJJ8kmfgEn7E2UfufCTAAhW5u9pCeFFIPVvNhCstCvYGm1IoZT9R5fo2kH6zl79JkimvnRS4KtXLGoJqgQKBgQCY1X1HfWx9AQo5kWSbDKvrYXN0CCcttFrNmiodrXmmVMbFhb24MkF0nB3zLR2J6kfaDJHVdZiX8bjAwfi63YmOhudPwZuB5n7dszZ+vzyqAJJFLkpubzyzDXWJcR5ZwtL+/3I1omYbQAtZfVdPvfy6BRFl/gEG9p2+sDur3liPowKBgFIc8CjJGovsVVHnJ/wxNfwBYFY7ek3U7BSje2wx94Il0niDxAvF4daNvdzbmBeRC7pU+1hQ0CBH2jqIQaRvfHXviFVahCV0UytXZWi7OK2Po/wEwXGNHY066J+cKFpr8Ges3Gi7+g4c4r1PxeJYqKFX3K9hEysjt5conXvbjTABAoGBAIbhy4n/cHK2Kz75SS/ptAStYcZit6kHhif0Sf0dL8KTCUYjrXdVqxzt9yS5iVtBT55p/37DJSPcKjC8P/czM4Z9GsHx3Xt8YDTrSEn+HtzuWikCHKBwPcLMOxJMqfuQDMUNzs70/2ZHVHzrONZglx3ZASzhSijKGBfF0zPwrHo/AoGBAMuSgVj+/UxlvftQt8SV2YHJCw3mwQcYueeRTqEaF8Dapoz/7RATI6W2ZeEVUyaNQl+WDP/XOgVctCoXd9gW/MWGNEv2iGwImelJOuhXyhK41rzq5S7bR+HzrWBiabz78uNlhE0VUisuXkErBzrSHZcoIyk3QmK05b83V1cUEjvY"


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
