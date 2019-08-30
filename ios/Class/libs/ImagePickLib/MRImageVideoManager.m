//
//  MRImageVideoManager.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/6/22.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MRImageVideoManager.h"
#import "IJSImageManager.h"
#import "IJSImagePickerController.h"
#import "SGRecordViewController.h"
#import "IJSImageManagerController.h"
#import "WAVideoBox.h"
#import "IJSVideoManager.h"
#import "JRBaseNavVC.h"

#import "AliyunMagicCameraViewController.h"
#import "AliyunIConfig.h"


typedef void(^finshCompressVideo)(NSString * newPath);


@interface MRImageVideoManager ()<UIAlertViewDelegate,UIActionSheetDelegate>

@property (nonatomic,strong) hyfFinshSelectBlock  finshBlock;
@property (nonatomic,strong) hyfFinshRecordVideo  finshRecordBlock;
@property (nonatomic,strong) WAVideoBox  * videoBox;
@property (nonatomic,strong) NSDictionary * options;
@end

@implementation MRImageVideoManager

SINGLETON_FOR_CLASS(MRImageVideoManager)
-(void)startRecordVideo:(hyfFinshRecordVideo)finshBlock{
  _finshBlock = finshBlock;
  dispatch_async(dispatch_get_main_queue(), ^{
      AliyunMediaConfig * _mediaConfig;
      _mediaConfig = [AliyunMediaConfig defaultConfig];
      _mediaConfig.minDuration = 5.0f;
      _mediaConfig.maxDuration = 30.f;
      _mediaConfig.fps = 25;
      _mediaConfig.gop = 5;
      _mediaConfig.cutMode = AliyunMediaCutModeScaleAspectFill;
      _mediaConfig.videoOnly = NO;
      _mediaConfig.backgroundColor = [UIColor blackColor];
    
      AliyunIConfig * config = [[AliyunIConfig alloc]init];
      [AliyunIConfig setConfig:config];
    
      AliyunMagicCameraViewController * controller = [[AliyunMagicCameraViewController alloc]init];
      [controller setValue:_mediaConfig forKey:@"quVideo"];
    
      JRBaseNavVC * navVC = [[JRBaseNavVC alloc]initWithRootViewController:controller];
      [navVC setNavigationBarHidden:YES];
    __weak typeof (self) weakSelf = self;
    controller.finishBlock = ^(NSString * _Nonnull outputPath) {
      [weakSelf getShutImageWithUrl:outputPath andFinshBlock:finshBlock];
    };
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:navVC animated:YES completion:nil];
    });
  });
}
-(void)startSelectImageOrVideoWithBlock:(NSDictionary *)options and:(hyfFinshSelectBlock)finshBlock{
  _finshBlock = finshBlock;
  _options = options;
  [[IJSImageManager shareManager] stopCachingImagesFormAllAssets];
  [IJSImageManager shareManager].allowPickingOriginalPhoto = YES;
  IJSImagePickerController * nav = [[IJSImagePickerController alloc]initWithMaxImagesCount:8 columnNumber:4 pushPhotoPickerVc:YES];
  nav.maxImagesCount = self.options[@"maxFiles"] ?[self.options[@"maxFiles"] integerValue]:8;
  nav.allowPickingVideo = NO;
  nav.networkAccessAllowed = NO;
  nav.allowPickingImage = YES;
  nav.sortAscendingByModificationDate = NO;
  __weak typeof (self) weakSelf = self;
  [nav loadTheSelectedData:^(NSArray<UIImage *> *photos, NSArray<NSURL *> *avPlayers, NSArray<PHAsset *> *assets, NSArray<NSDictionary *> *infos, IJSPExportSourceType sourceType, NSError *error) {
    NSLog(@"回调信息");
    NSMutableArray * backArr = [NSMutableArray new];
    if (sourceType == IJSPImageType)
    {
      [weakSelf saveImageWithImageArr:photos and:^(NSArray *imageUrlArr) {
        for (NSInteger index = 0; index < imageUrlArr.count; index++){
          NSMutableDictionary * imageInfo = [NSMutableDictionary dictionary];
          PHAsset * asset = assets[index];
          [imageInfo setObject:[NSString stringWithFormat:@"%@",imageUrlArr[index]] forKey:@"path"];
          [imageInfo setObject:@"image" forKey:@"type"];
          [imageInfo setObject:@(asset.pixelHeight) forKey:@"height"];
          [imageInfo setObject:@(asset.pixelWidth) forKey:@"width"];
          [backArr addObject:imageInfo];
        }
        if (weakSelf.finshBlock) {
          weakSelf.finshBlock(backArr);
        }
      }];
    }
  }];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:nav animated:YES completion:nil];
  });
}

-(void)getShutImageWithUrl:(NSString *)path andFinshBlock:(hyfFinshRecordVideo)finshBlock{
  
//  if (![path hasPrefix:@"file://"]) {
//    path = [NSString stringWithFormat:@"%@%@",@"file://",path];
//  }
  NSArray *paths=NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
  NSString *documentsDirectory=[paths objectAtIndex:0];
  NSString *savedImagePath=[documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.png",path.md5String]];
  YYCache *cache = [YYCache cacheWithName:@"crm_app_xiugou_video_image"];
  [cache objectForKey:savedImagePath withBlock:^(NSString * _Nonnull key, id<NSCoding>  _Nonnull object) {
    if (object) {
//      resolve(@{@"imagePath":key});
      NSData * imageData = [NSData dataWithContentsOfFile:key];
      UIImage * iamge = [UIImage imageWithData:imageData];
      NSLog(@"%@",iamge);
    }else{
      NSURL *videoUrl;
      if (![path hasPrefix:@"file://"]) {
        videoUrl = [NSURL fileURLWithPath:path];
      }else{
        videoUrl = [NSURL URLWithString:path];
      }
      NSDictionary *opts = [NSDictionary dictionaryWithObject:[NSNumber numberWithBool:NO] forKey:AVURLAssetPreferPreciseDurationAndTimingKey];
      AVURLAsset *urlAsset = [AVURLAsset URLAssetWithURL:videoUrl options:opts];
      AVAssetImageGenerator *generator = [AVAssetImageGenerator assetImageGeneratorWithAsset:urlAsset];
      generator.appliesPreferredTrackTransform = YES;
      NSError *error = nil;
      CGImageRef img = [generator copyCGImageAtTime:CMTimeMakeWithSeconds(0.0, 5) actualTime:NULL error:&error];
      UIImage *videoImage = [[UIImage alloc] initWithCGImage:img];
      CGImageRelease(img);
      NSData * data = UIImageJPEGRepresentation(videoImage,1.0);
      key = [NSString stringWithFormat:@"%@%@",@"file://",key];
      BOOL isRight = [data writeToURL:[NSURL URLWithString:key] atomically:YES];
      if (isRight) {
        [cache setObject:data forKey:key withBlock:^{
//          resolve(@{@"imagePath":key});
          CGFloat width = videoImage.size.width ? videoImage.size.width:KScreenWidth;
          CGFloat height = videoImage.size.height ? videoImage.size.height:KScreenHeight;

          NSDictionary * videoDic = @{
                                      @"videoCover":key,
                                      @"videoPath":path,
                                      @"width":@(width),
                                      @"height":@(height)
                                      };
          if (finshBlock) {
            finshBlock(@[videoDic]);
          }
        }];
      }
    }
  }];
}

//保存图片到沙盒
-(void)saveImageWithImageArr:(NSArray *)imageArr and:(void(^)(NSArray * imageUrlArr))finshSave{
  __weak typeof(self) weakSelf = self;
 __block NSInteger saveImageIndex = imageArr.count;
  NSMutableArray * urlArr = [[NSMutableArray alloc]initWithCapacity:saveImageIndex];
  for (NSInteger index = 0; index < imageArr.count; index++) {
    [urlArr addObject:@""];
    [IJSVideoManager saveImageToSandBoxImage:imageArr[index] completion:^(NSURL *outputPath, NSError *error) {
      saveImageIndex--;
      if (!error) {
        urlArr[index] = outputPath.absoluteString;
      }
      if (saveImageIndex == 0) {
        if ([urlArr containsObject:@""]) {
          [JRLoadingAndToastTool showToast:@"图片保存失败" andDelyTime:1];
        }else{
          if (finshSave) {
            finshSave(urlArr);
          }
        }
      }
    }];
  }
}

-(void)compressVideo:(NSString *)path andFinsh:(finshCompressVideo)finshCompress{
  [self.videoBox clean];
  NSString *filePath = [self buildFilePath];
  [_videoBox appendVideoByPath:path];
  _videoBox.ratio = WAVideoExportRatio960x540;
  _videoBox.videoQuality = 1; // 有两种方法可以压缩
  [_videoBox asyncFinishEditByFilePath:filePath complete:^(NSError *error) {
    if (error) {
      [JRLoadingAndToastTool showToast:@"视频压缩失败" andDelyTime:0.5];
      return ;
    }
    if(finshCompress){
      finshCompress(filePath);
    }
  }];
}
- (NSString *)buildFilePath{
  return [NSTemporaryDirectory() stringByAppendingString:[NSString stringWithFormat:@"%f.mp4", [[NSDate date] timeIntervalSinceReferenceDate]]];
}
-(void)editImage:(UIImage *)image{
  __weak typeof (self) weakSelf = self;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    IJSImageManagerController *vc =[[IJSImageManagerController alloc]initWithEditImage:image];
    [vc loadImageOnCompleteResult:^(UIImage *image, NSURL *outputPath, NSError *error) {
      //    weakSelf.backImageView.image = image;
    }];
    vc.mapImageArr = @[];
    [[self currentViewController_XG] presentViewController:vc animated:YES completion:nil];
  });
}
-(WAVideoBox *)videoBox{
  if(!_videoBox){
    _videoBox = [WAVideoBox new];
  }
  return _videoBox;
}
+(void)getImageAndVideo{
  [IJSImageManager shareManager].allowPickingOriginalPhoto = YES;
  IJSImagePickerController * nav = [[IJSImagePickerController alloc]initWithMaxImagesCount:7 columnNumber:4 pushPhotoPickerVc:YES];
  nav.allowPickingVideo = YES;
  nav.networkAccessAllowed = NO;
  nav.allowPickingImage = YES;
  nav.sortAscendingByModificationDate = NO;
  [nav loadTheSelectedData:^(NSArray<UIImage *> *photos, NSArray<NSURL *> *avPlayers, NSArray<PHAsset *> *assets, NSArray<NSDictionary *> *infos, IJSPExportSourceType sourceType, NSError *error) {
    NSLog(@"回调信息");
  }];
  [[self currentViewController_XG] presentViewController:nav animated:YES completion:nil];
}
@end
