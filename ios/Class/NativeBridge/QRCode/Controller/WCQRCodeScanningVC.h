//
//  WCQRCodeScanningVC.h
//  SGQRCodeExample
//
//  Created by boboMa on 2018/4/20.
//  Copyright © 2018年 boboMa. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^ScanResultBlock)(NSString * resultStr);

@interface WCQRCodeScanningVC : UIViewController

// 扫描结果
@property (nonatomic,copy)ScanResultBlock scanResultBlock;

@end
