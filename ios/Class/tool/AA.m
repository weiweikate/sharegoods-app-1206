//
//  AA.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AA.h"

@implementation AA
RCT_EXPORT_MODULE();
- (BOOL)canDecodeImageData:(NSData *)imageData
{
  return YES;
}

- (RCTImageLoaderCancellationBlock)decodeImageData:(NSData *)imageData
                                              size:(CGSize)size
                                             scale:(CGFloat)scale
                                        resizeMode:(UIViewContentMode)resizeMode
                                 completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  
  //    NSData *data = [NSData dataWithContentOfFile:@"/tmp/image.webp"];
  YYImageDecoder *decoder = [YYImageDecoder decoderWithData:imageData scale:2.0];
  UIImage *image = [decoder frameAtIndex:0 decodeForDisplay:YES].image;
  completionHandler(nil, image);
  
  
  return ^{};
}
@end
