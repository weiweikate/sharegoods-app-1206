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

@interface JRServiceManager (Util)

/**
 组装七鱼用户信息函数
 
 @param jsonData RN端传递过来的json对象
 @return 返回QYUserInfo 对象
 */
-(QYUserInfo *)packingUserInfo:(id)jsonData;




@end

NS_ASSUME_NONNULL_END
