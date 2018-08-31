//
//  PickerManager.h
//  jure
//
//  Created by nuomi on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^finshSelectBlock)(NSDictionary * selectData);
@interface PickerManager : NSObject

SINGLETON_FOR_HEADER(PickerManager)

@property (nonatomic,strong) NSArray * array;
@property(nonatomic,strong)UIPickerView *picView;

- (void)showPickAndFinsh:(finshSelectBlock)finshBlock;

@end
