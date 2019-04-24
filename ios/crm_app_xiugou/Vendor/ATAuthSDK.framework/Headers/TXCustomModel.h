//
//  TXCustomModel.h
//  ATAuthSDK
//
//  Created by yangli on 2019/4/4.
//  Copyright © 2019 alicom. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TXCustomModel : NSObject

// 导航栏
@property (nonatomic, strong) UIColor *navColor;
@property (nonatomic, copy) NSAttributedString *navTitle;

// logo图片
@property (nonatomic, strong) UIImage *logoImage;
@property (nonatomic, assign) BOOL logoIsHidden;

// slogon
@property (nonatomic, strong) UIColor *slogonColor;

// 号码
@property (nonatomic, strong) UIColor *numberColor;
@property (nonatomic, assign) CGFloat numberSize;

// 登录
@property (nonatomic, strong) UIColor *loginBtnBgColor;
@property (nonatomic, copy) NSString *loginBtnText;
@property (nonatomic, strong) UIColor *loginBtnTextColor;

// 协议
@property (nonatomic, copy) NSArray *privacyOne;
@property (nonatomic, copy) NSArray *privacyTwo;
@property (nonatomic, strong) UIColor *privacyColor;

// 切换账号
@property (nonatomic, assign) BOOL changeBtnIsHidden;
@property (nonatomic, strong) UIColor *changeBtnColor;

@end

NS_ASSUME_NONNULL_END
