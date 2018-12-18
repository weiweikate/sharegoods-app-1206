//
//  MRShopCartCellManager.m
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MRShopCartCellManager.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "ShopCartCell.h"

@implementation MRShopCartCellManager
RCT_EXPORT_MODULE(ShopCartCell)
RCT_EXPORT_VIEW_PROPERTY(isBeginAnimation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(itemData, NSDictionary)

-(UIView *)view{
  ShopCartCell * view= [[ShopCartCell alloc]init];
  return view;
}
@end
