//
//  JRBaseNavVC.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRBaseNavVC.h"

@interface JRBaseNavVC ()

@end

@implementation JRBaseNavVC

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    self.navigationBar.translucent = NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  if (self.childViewControllers.count > 0) { // 如果push进来的不是第一个控制器
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [btn setTitleColor:[UIColor redColor] forState:UIControlStateHighlighted];
    [btn setImage:[UIImage imageNamed:@"back"] forState:UIControlStateNormal];
    // [btn setImage:[UIImage imageNamed:@"navigationButtonReturnClick"] forState:UIControlStateHighlighted];
    
    btn.frame = CGRectMake(0, 0, 50, 44);
    // 让按钮内部的所有内容左对齐
    btn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
    
    //设置内边距，让按钮靠近屏幕边缘
    btn.contentEdgeInsets = UIEdgeInsetsMake(0,0, 0, 0);
    [btn addTarget:self action:@selector(back) forControlEvents:UIControlEventTouchUpInside];
    
    viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:btn];
    
    viewController.hidesBottomBarWhenPushed = YES; // 隐藏底部的工具条
  }
  
  // 一旦调用super的pushViewController方法,就会创建子控制器viewController的view并调用viewController的viewDidLoad方法。可以在viewDidLoad方法中重新设置自己想要的左上角按钮样式
  [super pushViewController:viewController animated:animated];
  
}

-(void)back{
    [self popViewControllerAnimated:YES];
}

@end
