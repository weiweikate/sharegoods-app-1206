//
//  AA.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "SGImageDecode.h"

@implementation SGImageDecode
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
  
  YYImageDecoder *decoder = [YYImageDecoder decoderWithData:imageData scale:[UIScreen mainScreen].scale];
  UIImage *image = nil;
  if (decoder.frameCount == 1) {
    image = [decoder frameAtIndex:0 decodeForDisplay:YES].image;
  }else{
    image = [[YYImage alloc] initWithData:imageData scale:[UIScreen mainScreen].scale];
    image = [image imageByDecoded];
  }
  completionHandler(nil, image);
  return ^{};
}

- (float)decoderPriority{
  return -1.0;
}

@end
