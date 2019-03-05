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
#import <imageco>
@interface GongMaoVC ()<WKNavigationDelegate>
@property(nonatomic, strong)WKWebView *webView;
@end

@implementation GongMaoVC

- (void)viewDidLoad {
    [super viewDidLoad];
  NSURLRequest * request = [NSURLRequest requestWithURL:[NSURL URLWithString:self.url]];
  [self.webView loadRequest:request];
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
  NSLog(@"%@",url_str);
  decisionHandler(WKNavigationActionPolicyAllow);
}

@end
