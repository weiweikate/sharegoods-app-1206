//
//  HYFPreviewVC.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "HYFVideoPreviewView.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^recordFinshBlock)(NSString * videoPath);

@interface HYFPreviewVC : UIViewController

@property (nonatomic,strong) HYFVideoPreviewView * preView;

@property (nonatomic,strong) NSString * videoPath;

@property (nonatomic,copy) recordFinshBlock finshPreview;
@end

NS_ASSUME_NONNULL_END
