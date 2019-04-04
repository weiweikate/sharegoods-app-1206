//
//  GongMaoVC.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/3/5.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "GongMaoVC.h"
#import <WebKit/WebKit.h>
#import <SDAutoLayout.h>
#import "MBProgressHUD+PD.h"
#import "StorageFromRN.h"
static  NSString * constTile = @"公猫认证";
//static  NSString * web_back_mark = @"/gongmall/contract/notify";
@interface GongMaoVC ()<WKNavigationDelegate>
@property(nonatomic, strong)WKWebView *webView;
@end

@implementation GongMaoVC

- (void)viewDidLoad {
  [super viewDidLoad];
 if(_webConstTitle) {
    self.title = _webConstTitle;
 }else{
    self.title = constTile;
 }
  [self addBackBtn];
  if (!self.url) {
    [MBProgressHUD showError:@"网页链接为空"];
    return;
  }
  NSURLRequest * request = [NSURLRequest requestWithURL:[NSURL URLWithString:self.url]];
  [self.webView loadRequest:request];
}
/** 添加返回按钮*/
- (void)addBackBtn
{
  UIButton *backBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 44, 44)];
  [backBtn addTarget:self action:@selector(back_web) forControlEvents:UIControlEventTouchUpInside];
  [backBtn setImage:[UIImage imageNamed:@"back"] forState:0];
  backBtn.imageView.sd_layout
  .centerYEqualToView(backBtn)
  .leftSpaceToView(backBtn, 0)
  .heightIs(15)
  .widthIs(15);
  UIBarButtonItem* backItem = [[UIBarButtonItem alloc]initWithCustomView:backBtn];
  self.navigationItem.leftBarButtonItem = backItem;
}
/** 返回事件*/
- (void)back_web
{
  if (self.webView.canGoBack) {
    [self.webView goBack];
  }else{
    [self.navigationController popViewControllerAnimated:YES];
  }
}

/** 懒加载*/
- (WKWebView *)webView
{
  if (!_webView) {
    _webView = [[WKWebView alloc]init];
    _webView.navigationDelegate = self;
    [self.view addSubview:_webView];
    _webView.sd_layout
    .spaceToSuperView(UIEdgeInsetsZero);
    
  }
  return _webView;
}

#pragma WKNavigationDelegate
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
  NSURL * navi_url = navigationAction.request.URL;
  NSString *url_str = navi_url.absoluteString;
  NSLog(@"@@@@@%@",url_str);
  NSString *mark = [StorageFromRN getGongMao];
  if ([mark isEqualToString:url_str]) {
    decisionHandler(WKNavigationActionPolicyCancel);
    [self.navigationController popViewControllerAnimated:YES];
    if (self.resolver) {
      self.resolver(@{});
    }
    return;
  }
  decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation
{
  if (webView.title) {
    self.title = webView.title;
  }else if(_webConstTitle){
    self.title = _webConstTitle;
  }else{
    self.title = constTile;
  }
}

- (BOOL)shouldAutorotate
{
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  return UIInterfaceOrientationMaskAllButUpsideDown;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
  return UIInterfaceOrientationPortrait;
}

@end
