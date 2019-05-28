//
//  JXHeaderModel.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/26.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface JXHeaderModel : NSObject

/** 头像 */
@property (nonatomic, copy) NSString *userImg;

/** 昵称 */
@property (nonatomic, copy) NSString *userName;

/** 发布时间 */
@property (nonatomic, copy) NSString *userNo;

@end

NS_ASSUME_NONNULL_END
