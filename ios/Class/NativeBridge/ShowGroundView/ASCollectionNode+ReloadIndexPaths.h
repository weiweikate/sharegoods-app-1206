//
//  ASCollectionNode+ReloadIndexPaths.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/28.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <AsyncDisplayKit/AsyncDisplayKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ASCollectionNode (ReloadIndexPaths)
@property (nonatomic, copy)NSArray  *js_reloadIndexPaths;//需要刷新的indexPath
@end

NS_ASSUME_NONNULL_END
