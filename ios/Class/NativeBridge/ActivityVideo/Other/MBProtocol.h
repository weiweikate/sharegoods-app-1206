//
//  MBProtocol.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/18.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol MBProtocol <NSObject>

- (void)clickBuy;
- (void)clickPlayOrPause; //点击播放/暂停
- (void)clickDownload;
- (void)clicCollection;
-(void)clickZan;

@end

NS_ASSUME_NONNULL_END
