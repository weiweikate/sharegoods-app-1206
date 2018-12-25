//
//  WelcomeView.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2018/12/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface WelcomeView : UIView
@property(nonatomic, strong)NSArray *data;
- (instancetype)initWithData:(NSArray *)data;
@end

@interface  WelcomePageControl : UIView
- (instancetype)initWithNumber:(NSInteger)num;
@property(nonatomic, assign)NSInteger currentIndex;
@property(nonatomic, strong)NSMutableArray<UIView *> *views;
@end
