//
//  ShopCartListManager.m
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ShopCartListManager.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "ShopCartListView.h"
#import "SCCell.h"


@interface ShopCartListManager()

@end
@implementation ShopCartListManager
RCT_EXPORT_MODULE(ShopCartListView)
//RCT_EXPORT_VIEW_PROPERTY(isBeginAnimation, BOOL)
//RCT_EXPORT_VIEW_PROPERTY(itemData, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(dataArr, NSArray)

-(UIView *)view{
  ShopCartListView * view = [[ShopCartListView alloc]init];
//  view.delegate = self;
//  view.dataSource = self;
  return view;
}
//#pragma mark delegate
//
//-(NSInteger)numberOfRowsInSection:(NSInteger)section{
//  return self.dataArr.count;
//}
//-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
//  return 140;
//}
//-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
//  SCCell * cell = [SCCell cellWithTableView:tableView andId:@"SCCell"];
//  return cell;
//}
@end
