//
//  HYFVideoPreviewView.h
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol HYFVideoPreviewViewDelegate <NSObject>

//0 取消 1 完成
-(void)preViewBtnClick:(NSInteger)btnTag;

@end

@interface HYFVideoPreviewView : UIView

@property (nonatomic ,copy) NSString *videoPath;
@property (nonatomic,assign) BOOL isFirstLoad;
@property (nonatomic,weak)  id<HYFVideoPreviewViewDelegate>delegate;

-(instancetype)initWithVideoPath:(NSString *)videoPath;



@end

NS_ASSUME_NONNULL_END
