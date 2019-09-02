//
//  JRNotiOrKey.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef JRNotiOrKey_h
#define JRNotiOrKey_h

//#define KDEBUG_XG 1

#ifdef KDEBUG_XG
#define KJSPushKey  @"3288c3f3feb6c119e3d88049" //极光测试key
#define KQiYuKey    @"ae7a2c616148c5aec7ffedfa50ad90a7"
#define KJisProduction NO
#define SA_DEBUG_MODE SensorsAnalyticsDebugOff
#else
#define KJSPushKey       @"7fde54543daf045a209a7abf"  //极光appkey
#define KQiYuKey         @"b87fd67831699ca494a9d3de266cd3b0" //七鱼key
#define KJisProduction YES
#define SA_DEBUG_MODE SensorsAnalyticsDebugOff
#endif

/**三方key 或者 通知key相关宏**/


#define KWechatAppKey    @"wx401bc973f010eece"  //微信key
#define KWechatAppSecret @"405dede82bb1c57e0b63056c8d2274c1"  //微信secret
#define KQQAppKey        @"101512141" //qq key
#define KWeiboKey        @"182724926" //微博 key
#define KWeiboAppSecret  @"ac38535a71796c40d4315ab436784b3e" //微博 secret
#define KUmSocialAppkey  @"5b73de76f43e4807ff000024"  //友盟key

#define SA_SERVER_URL_production @"https://track.sharegoodsmall.com/sa?project=production"
#define SA_SERVER_URL_default  @"https://track.sharegoodsmall.com/sa?project=default"

#endif /* JRNotiOrKey_h */
