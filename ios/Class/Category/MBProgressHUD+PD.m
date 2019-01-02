//
//  MBProgressHUD+PD.m
//  xiaoZhang
//
//  Created by 胡胡超 on 2018/11/28.
//  Copyright © 2018年 胡胡超. All rights reserved.
//

#import "MBProgressHUD+PD.h"
#import "AppDelegate.h"

@implementation MBProgressHUD (PD)
/**
 *  =======显示信息
 *  @param text 信息内容
 *  @param icon 图标
 *  @param view 显示的视图
 */
+ (void)show:(NSString *)text icon:(NSString *)icon view:(UIView *)view
{
    if (view == nil)
        view =((AppDelegate *)[UIApplication sharedApplication].delegate).window;
    // 快速显示一个提示信息
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
     hud.margin = 11;
     hud.offset = CGPointMake(0, -30);
  // 再设置模式
    hud.mode = MBProgressHUDModeCustomView;
    hud.label.text = text;
    hud.label.numberOfLines = 0;
    hud.contentColor = [UIColor whiteColor];//文字和菊花的颜色
    //hud.bezelView.style = MBProgressHUDBackgroundStyleSolidCo;
    hud.label.font = [UIFont systemFontOfSize:13.0];
    hud.userInteractionEnabled= YES;
    
    hud.customView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:icon]];  // 设置图片
    hud.bezelView.backgroundColor = [UIColor blackColor];
    hud.layer.opacity = 0.8;
    // 设置图片
//    hud.customView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:[NSString stringWithFormat:@"MBProgressHUD.bundle/%@", icon]]];
  
    
    // 隐藏时候从父控件中移除
    hud.removeFromSuperViewOnHide = YES;
    
    // 1秒之后再消失
    [hud hideAnimated:YES afterDelay:1.5];
}

/**
 *  =======显示 提示信息
 *  @param success 信息内容
 */
+ (void)showSuccess:(NSString *)success
{
    [self showSuccess:success toView:nil];
}

/**
 *  =======显示
 *  @param success 信息内容
 */
+ (void)showSuccess:(NSString *)success toView:(UIView *)view
{
    [self show:success icon:@"success.png" view:view];
}

/**
 *  =======显示错误信息
 */
+ (void)showError:(NSString *)error
{
    [self showError:error toView:nil];
}

+ (void)showError:(NSString *)error toView:(UIView *)view{
    [self show:error icon:@"error.png" view:view];
}
/**
 *  显示提示 + 菊花
 *  @param message 信息内容
 *  @return 直接返回一个MBProgressHUD， 需要手动关闭(  ?
 */
+ (MBProgressHUD *)showMessage:(NSString *)message
{
    return [self showMessage:message toView:nil];
}

/**
 *  显示一些信息
 *  @param message 信息内容
 *  @param view    需要显示信息的视图
 *  @return 直接返回一个MBProgressHUD，需要手动关闭
 */
+ (MBProgressHUD *)showMessage:(NSString *)message toView:(UIView *)view {
    if (view == nil) view = ((AppDelegate *)[UIApplication sharedApplication].delegate).window;
    // 快速显示一个提示信息
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
    hud.label.text = message;
    hud.margin = 15;
    hud.contentColor = [UIColor whiteColor];//文字和菊花的颜色
    hud.label.font = [UIFont systemFontOfSize:13.0];
    hud.bezelView.backgroundColor =  [UIColor colorWithHexString:@"000000"];
    hud.layer.opacity = 0.8;
    //隐藏时候从父控件中移除
    hud.removeFromSuperViewOnHide = YES;
    // YES代表需要蒙版效果
    hud.userInteractionEnabled= YES;
    hud.dimBackground = NO;
    
    return hud;
}

/**
 *  手动关闭MBProgressHUD
 */
+ (void)hideHUD
{
    [self hideHUDForView:nil];
}
/**
 *  @param view    显示MBProgressHUD的视图
 */
+ (void)hideHUDForView:(UIView *)view
{
    if (view == nil){
        view = ((AppDelegate *)[UIApplication sharedApplication].delegate).window;
    }
      [self hideHUDForView:view animated:YES];
}
@end
