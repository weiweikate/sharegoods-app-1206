//
//  HYFUploaderVideo.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^HYFFinshUploadVideo)(NSString * finshParam);
typedef void(^HYFErrorUploadVideo)(NSString * finshParam);

NS_ASSUME_NONNULL_BEGIN

@interface HYFUploaderVideo : NSObject
SINGLETON_FOR_HEADER(HYFUploaderVideo)
@property(nonatomic,copy)HYFFinshUploadVideo finshBlock;
@property(nonatomic,copy)HYFErrorUploadVideo errorBlock;

-(void)startUpLoad:(NSString *)fileName and:(NSString *)filePath and:(NSString *)title andUpLoadAuth:(NSString *)uploadAuth andUpLoadAddress:(NSString *)uploadAddress;

@end

NS_ASSUME_NONNULL_END
