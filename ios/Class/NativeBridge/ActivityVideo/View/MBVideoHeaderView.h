//
//  MBVideoHeaderView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class MBVideoHeaderView;

@protocol  MBHeaderViewDelegate <NSObject>
- (void)headerClick;
- (void)goBack; //点击播放/暂停
- (void)guanzhuClick;
- (void)shareClick;
@end


@interface MBVideoHeaderView : UIView
@property (nonatomic, weak) id<MBHeaderViewDelegate> dataDelegate;
@property(nonatomic,strong)NSDictionary* UserInfoModel;
@property(nonatomic,copy)NSString* time;
@property(nonatomic,assign)BOOL type;


@end

NS_ASSUME_NONNULL_END
