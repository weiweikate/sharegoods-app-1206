//
//  OCExampleViewController.h
//  JXPagingView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
/**
 该库的JXPagerView不能保证为最新版本，强烈建议阅读JXPagingView库：https://github.com/pujiaxin33/JXPagingView，里面有更丰富的效果支持！！！
 */
@interface PagingViewController : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onItemPress;
@property (nonatomic, strong) NSString* userType;
@property (nonatomic, assign) NSInteger headerHeight;
@end
