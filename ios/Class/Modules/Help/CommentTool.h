//
//  CommentTool.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/5/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CommentTool : NSObject

SINGLETON_FOR_HEADER(CommentTool)

/**
 检测是否需要跳转评论
 */
-(void)checkIsCanComment;

@end

NS_ASSUME_NONNULL_END
