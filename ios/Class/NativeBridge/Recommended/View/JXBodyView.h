//
//  JXBodyView.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JXModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^imgBlock)(NSArray*,NSInteger);//block写法比较特殊，一般重命名一下

@interface JXBodyView : UIView

@property (nonatomic,copy)imgBlock imgBlock; //定义一个MyBlock属性

@property (nonatomic,strong)NSArray<SourcesModel *> * sources;


@end

NS_ASSUME_NONNULL_END
