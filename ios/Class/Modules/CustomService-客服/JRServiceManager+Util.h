//
//  JRServiceManager+Util.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/3/26.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "JRServiceManager.h"
#import <QYSDK.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger,CHAT_TYPE){
  BEGIN_FROM_OTHER= 0,//从其他地方发起的聊天，一律转接平台客服
  BEGIN_FROM_PRODUCT= 1,//从商品发起的客服，
  BEGIN_FROM_ORDER= 2,//从订单发起客服
  BEGIN_FROM_MESSAGE=3//从消息列表发起客服
};

typedef NS_ENUM(NSInteger,CARD_TYPE) {
  PRODUCT_CARD=0, //商品卡片
  ORDER_CARD=1,//订单卡片
};

@interface JRServiceManager (Util)

/**
 组装七鱼用户信息函数
 
 @param jsonData RN端传递过来的json对象
 @return 返回QYUserInfo 对象
 */
-(QYUserInfo *)packingUserInfo:(id)jsonData;


-(QYCommodityInfo *)getCommodityMsgWithData:(id)chatData;



@end

NS_ASSUME_NONNULL_END
