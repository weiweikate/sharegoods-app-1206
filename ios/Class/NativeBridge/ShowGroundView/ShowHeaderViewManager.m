//
//  ShowHeaderViewManager.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/21.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ShowHeaderViewManager.h"
#import "ShowHeaderView.h"
@implementation ShowHeaderViewManager

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

RCT_EXPORT_MODULE(ShowHeaderView)
- (UIView *)view
{
  ShowHeaderView *view = [[ShowHeaderView alloc] init];
  return view;
}


@end
