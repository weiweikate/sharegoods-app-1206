//
//  MRImageVideoManager.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/22.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^finshSelectImage)(NSString * imagePath);

@interface MRImageVideoManager : NSObject


SINGLETON_FOR_HEADER(MRImageVideoManager)
//+(void)

+(void)getImageAndVideo;

-(void)startSelectImageOrVideo;

@end

NS_ASSUME_NONNULL_END
