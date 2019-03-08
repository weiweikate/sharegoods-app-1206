//
//  LoginBundle.m
//  crm_app_xiugou
//
//  Created by magi on 2018/12/31.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "LoginBundle.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTBridge.h"
#import <React/RCTBridge+Private.h>
#import "LoginViewController.h"

@interface LoginBundle()

@property (nonatomic) RCTBridge* bridge;
@property (nonatomic) BOOL isBundleLoaded;

@end

@implementation LoginBundle

+ (instancetype)shareInstance {
  static dispatch_once_t onceToken;
  static LoginBundle* loginBundle = nil;
  dispatch_once(&onceToken, ^{
    loginBundle = [[LoginBundle alloc] init];
    loginBundle.isBundleLoaded = NO;
  });
  return loginBundle;
}

+ (void)loadPlatformBunlde {
  [[LoginBundle shareInstance] loadPlatformBundle];
}

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(login:)
                                                 name:[kOpenLoginViewController copy]
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)login: (id)sender {
  if (self.bridge) {
    RCTRootView *view = [LoginBundle loginView];
    [LoginViewController loginWithRCTRootView:view];
  } else {
    NSURL *jsCodeLocation  = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    [LoginViewController loginWithBundleURL:jsCodeLocation];
  }
}


- (void)loadPlatformBundle {
  __weak LoginBundle *weakSelf = self;
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    NSURL *jsCodeLocation;
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"platform" withExtension:@"jsbundle"];
    RCTBridge* jsbridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                        moduleProvider:nil
                                         launchOptions:nil];
    dispatch_async(dispatch_get_main_queue(), ^{
      weakSelf.bridge = jsbridge;
    });
  });
}

- (void)loadLoginBundle {
  if (!_isBundleLoaded && self.bridge) {
    NSURL *jsCodeLocationBuz = [[NSBundle mainBundle] URLForResource:@"login" withExtension:@"jsbundle"];
    NSError *error = nil;
    NSData *sourceBuz = [NSData dataWithContentsOfFile:jsCodeLocationBuz.path
                                               options:NSDataReadingMappedIfSafe
                                                 error:&error];
    [self.bridge.batchedBridge executeSourceCode:sourceBuz sync:NO];
    _isBundleLoaded = YES;
  }
}

+ (RCTRootView *)loginView {
  [[LoginBundle shareInstance] loadLoginBundle];
  RCTRootView* view = [[RCTRootView alloc] initWithBridge:[LoginBundle shareInstance].bridge moduleName:@"mrlogin" initialProperties:nil];
  return view;
}

@end
