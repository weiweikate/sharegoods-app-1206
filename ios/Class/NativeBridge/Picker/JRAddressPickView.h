//
//  JRAddressPickView.h
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
typedef void (^sureBlock)(NSDictionary *selectData);

@interface JRAddressPickView : UIView

@property(nonatomic,copy)sureBlock  sureBlock;
@property(nonatomic,strong)UIPickerView *pickerView;
@property(nonatomic,strong)NSArray *dataArr;

-(void)showView;
@end
