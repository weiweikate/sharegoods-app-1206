//
//  SGRecordViewController.h
//  短视频录制
//
//  Created by lihaohao on 2017/5/19.
//  Copyright © 2017年 低调的魅力. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger,OptionType){
  hyf_img = 0,
  hyf_video,
  hyf_edit_img,
  hyf_edit_video
};
@interface SGRecordViewController : UIViewController
@property (nonatomic,strong) void(^finshBlock)(UIImage * image,NSString * videoPath,OptionType optionType );

@end
