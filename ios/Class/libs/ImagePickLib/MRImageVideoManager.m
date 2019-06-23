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


@interface MRImageVideoManager ()<UIAlertViewDelegate,UIActionSheetDelegate>

@end

@implementation MRImageVideoManager

SINGLETON_FOR_CLASS(MRImageVideoManager)

-(void)startSelectImageOrVideo{
  UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:nil delegate:self cancelButtonTitle:@"取消" destructiveButtonTitle:nil otherButtonTitles:@"相机",@"相册", nil];
  [sheet showInView:[self currentViewController_XG].view];
  
}
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
   __weak typeof (self) weakSelf = self;
  if (buttonIndex == 0) {
    SGRecordViewController *vc = [[SGRecordViewController alloc]init];
    vc.finshBlock = ^(UIImage *image, NSString *videoPath, OptionType optionType) {
      if (optionType == hyf_img) {
        //拍照完成
      }else if(optionType == hyf_video){
        //录像完成
      }else if (optionType == hyf_edit_img){
        //编辑图片
        [weakSelf editImage:image];
      }else if (optionType == hyf_edit_video){
        //编辑视频
      }
    };
    [[self currentViewController_XG] presentViewController:vc animated:YES completion:nil];
  }else if (buttonIndex == 1){
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
