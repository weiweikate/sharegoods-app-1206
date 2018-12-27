//
//  JRNotiOrKey.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef JRNotiOrKey_h
#define JRNotiOrKey_h




/**三方key 或者 通知key相关宏**/

#define KQiYuKey         @"b87fd67831699ca494a9d3de266cd3b0" //七鱼key
#define KJSPushKey       @"7fde54543daf045a209a7abf"  //极光appkey

#define KWechatAppKey    @"wx401bc973f010eece"  //微信key
#define KWechatAppSecret @"405dede82bb1c57e0b63056c8d2274c1"  //微信secret
#define KQQAppKey        @"101512141" //qq key
#define KWeiboKey        @"182724926" //微博 key
#define KWeiboAppSecret  @"ac38535a71796c40d4315ab436784b3e" //微博 secret
#define KUmSocialAppkey  @"5b73de76f43e4807ff000024"  //友盟key

#ifdef DEBUG
#define SA_SERVER_URL @"https://stat.sharegoodsmall.com/debug?project=default"
#define SA_DEBUG_MODE SensorsAnalyticsDebugAndTrack
#else
#define SA_SERVER_URL @"http://stat.sharegoodsmall.com/sa?project=default"
//#define SA_SERVER_URL @"https://stat.sharegoodsmall.com/debug?project=default"
#define SA_DEBUG_MODE SensorsAnalyticsDebugOff
#endif

#endif /* JRNotiOrKey_h */
