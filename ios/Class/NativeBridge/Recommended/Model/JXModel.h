//
//  JXModel.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JXModel : NSObject
@property (nonatomic,copy) NSString * content;
@property (nonatomic,assign) NSInteger type;
@property (nonatomic,strong) NSArray * list;
@property (nonatomic,copy) NSString * name;
@property (nonatomic,copy) NSString * videoImgStr;
@property (nonatomic,assign) NSInteger guanType;//0 未关注 1 已关注

@end
