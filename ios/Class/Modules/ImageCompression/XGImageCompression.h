//
//  XGImageCompression.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/10/27.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface XGImageCompression : NSObject
+(void)RN_ImageCompressionWithPath:(NSString *)path
                                fileSize:(NSInteger)fileSize
                               limitSize:(NSInteger)limitSize;
@end
