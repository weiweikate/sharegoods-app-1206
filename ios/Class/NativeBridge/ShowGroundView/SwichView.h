//
//  SwichView.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/7/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>



@interface SwichView : UIView
@property(nonatomic, strong)NSArray<NSString *> *data;
@property(nonatomic, assign)NSInteger index;
@property(nonatomic, strong)void(^selectBlock)(NSInteger index);
-(void)changToIndex:(NSInteger)index;
@end


@interface SwichViewNavi : UIView
@property(nonatomic, strong)NSArray<NSString *> *data;
@property(nonatomic, strong)SwichView *swichView;
@property(nonatomic, strong)void(^selectBlock)(NSInteger index);
@property(nonatomic, strong)void(^backBlock)();
@end
