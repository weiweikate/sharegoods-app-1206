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


typedef void(^finshCompressVideo)(NSString * newPath);


@interface MRImageVideoManager ()<UIAlertViewDelegate,UIActionSheetDelegate>

@property (nonatomic,strong) hyfFinshSelectBlock  finshBlock;
@property (nonatomic,strong) WAVideoBox  * videoBox;
@end

@implementation MRImageVideoManager

SINGLETON_FOR_CLASS(MRImageVideoManager)

-(void)startSelectImageOrVideoWithBlock:(hyfFinshSelectBlock)finshBlock{
  _finshBlock = finshBlock;
  
  UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:nil delegate:self cancelButtonTitle:@"取消" destructiveButtonTitle:nil otherButtonTitles:@"相机",@"相册", nil];
  [sheet showInView:[self currentViewController_XG].view];
  
}
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
   __weak typeof (self) weakSelf = self;
  if (buttonIndex == 0) {
    SGRecordViewController *vc = [[SGRecordViewController alloc]init];
      __weak typeof (self) weakSelf = self;
    vc.finshBlock = ^(UIImage *image, NSString *videoPath, OptionType optionType) {
      if (optionType == hyf_img) {
        //拍照完成
        NSMutableArray * backArr = [NSMutableArray new];
        NSMutableDictionary * imageInfo = [NSMutableDictionary new];
        [IJSVideoManager saveImageToSandBoxImage:image completion:^(NSURL *outputPath, NSError *error) {
          if (error) {
            [JRLoadingAndToastTool showToast:@"图片存储失败呢" andDelyTime:1];
            return ;
          }
           [imageInfo setObject:[NSString stringWithFormat:@"%@",outputPath] forKey:@"path"];
           [imageInfo setObject:@"image" forKey:@"type"];
           [imageInfo setObject:@(1980) forKey:@"height"];
           [imageInfo setObject:@(1024) forKey:@"width"];
           [backArr addObject:imageInfo];
          if (weakSelf.finshBlock) {
            weakSelf.finshBlock(backArr);
          }
        }];
      }else if(optionType == hyf_video){
        //录像完成
        [weakSelf compressVideo:videoPath andFinsh:^(NSString *newPath) {
          NSArray * pathArr = [newPath componentsSeparatedByString:@"private"];
          newPath = [NSString stringWithFormat:@"%@%@",@"file://",pathArr[1]];
          //          [weakSelf compressVideo:urlPath andFinsh:^(NSString *newPath) {
          NSMutableArray *backArr = [NSMutableArray new];
          NSMutableDictionary * infoDic = [NSMutableDictionary dictionary];
          [infoDic setObject:@(30) forKey:@"videoTime"];
          [infoDic setObject:@"video/mp4" forKey:@"type"];
          [infoDic setObject:newPath forKey:@"path"];
          [infoDic setObject:@(1980) forKey:@"width"];
          [infoDic setObject:@(1024) forKey:@"height"];
          [backArr addObject:infoDic];
          if (weakSelf.finshBlock) {
            weakSelf.finshBlock(backArr);
          }
          
        }];
      }else if (optionType == hyf_edit_img){
        //编辑图片
        [weakSelf editImage:image];
      }else if (optionType == hyf_edit_video){
        //编辑视频
      }
    };
    [[self currentViewController_XG] presentViewController:vc animated:YES completion:nil];
  }else if (buttonIndex == 1){
    
    [[IJSImageManager shareManager] stopCachingImagesFormAllAssets];
    [IJSImageManager shareManager].allowPickingOriginalPhoto = YES;
    
    IJSImagePickerController * nav = [[IJSImagePickerController alloc]initWithMaxImagesCount:7 columnNumber:4 pushPhotoPickerVc:YES];
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
    }else{
        if ( avPlayers && avPlayers.count > 0) {
           NSString * urlPath = [NSString stringWithFormat:@"%@",((NSURL *)avPlayers[0]).absoluteString];
            NSMutableDictionary * infoDic = [NSMutableDictionary dictionary];
            PHAsset * asset = assets[0];
            [infoDic setObject:@(asset.duration) forKey:@"videoTime"];
            [infoDic setObject:@"video/mp4" forKey:@"type"];
            [infoDic setObject:urlPath forKey:@"path"];
            [infoDic setObject:@(asset.pixelWidth) forKey:@"width"];
            [infoDic setObject:@(asset.pixelHeight) forKey:@"height"];
            [backArr addObject:infoDic];
            if (weakSelf.finshBlock) {
              weakSelf.finshBlock(backArr);
            }
        }
    }
    }];
    [[self currentViewController_XG] presentViewController:nav animated:YES completion:nil];
  }
}

//保存图片到沙盒
-(void)saveImageWithImageArr:(NSArray *)imageArr and:(void(^)(NSArray * imageUrlArr))finshSave{
  dispatch_semaphore_t sema = dispatch_semaphore_create(1);
  NSMutableArray * urlArr=[NSMutableArray new];
  for (NSInteger index =0 ; index < imageArr.count; index++) {
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
       dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
      [IJSVideoManager saveImageToSandBoxImage:imageArr[index] completion:^(NSURL *outputPath, NSError *error) {
        if (error) {
          [JRLoadingAndToastTool showToast:@"图片缓存失败" andDelyTime:1];
          dispatch_semaphore_signal(sema);
          return ;
        }
        dispatch_semaphore_signal(sema);
        [urlArr addObject:outputPath];
        if (imageArr.count == urlArr.count) {
          if (finshSave) {
            finshSave(urlArr);
          }
        }else if (index == imageArr.count - 1 ) {
          [JRLoadingAndToastTool showToast:@"图片缓存失败" andDelyTime:1];
        }
      }];
    });
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
