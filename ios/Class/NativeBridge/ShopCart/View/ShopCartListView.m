//
//  ShopCartListView.m
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ShopCartListView.h"
#import "SCCell.h"
@interface ShopCartListView()<UITableViewDataSource,UITableViewDelegate>

@end


@implementation ShopCartListView

-(instancetype)initWithFrame:(CGRect)frame style:(UITableViewStyle)style{
  if (self = [super initWithFrame:frame style:style]) {
    [self initView];
  }
  return self;
}
-(void)initView{
//  self.backgroundColor = [UIColor blueColor];
  UIView * headerView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, KScreenWidth, 150)];
  headerView.backgroundColor = [UIColor redColor];
  self.tableHeaderView = headerView;
  self.contentOffset = CGPointMake(0, -20);
  self.delegate = self;
  self.dataSource = self;
}
-(void)setDataArr:(NSDictionary *)dataArr{
  NSLog(@" ----- %@",dataArr);
  _dataArr = dataArr;
//  [self reloadData];
}

#pragma mark delegate

-(NSInteger)numberOfRowsInSection:(NSInteger)section{
  return self.dataArr.count;
}
-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
  return 140;
}
-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
  SCCell * cell = [SCCell cellWithTableView:tableView andId:@"SCCell"];
  return cell;
}
//-(void)layoutSubviews{
//  [self reloadData];
//}
@end
