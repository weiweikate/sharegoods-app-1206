//
//  RecommendedView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "UITableView+SDAutoTableViewCellHeight.h"
#import "RecommendedCell.h"
#import "Model/JXModel.h"

@interface RecommendedView()<UITableViewDelegate,UITableViewDataSource,UIScrollViewDelegate>
@property (nonatomic, weak)UITableView *tableview;
@property (nonatomic, strong)NSMutableArray* data;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;

@end

static NSString *ID = @"tabCell";

@implementation RecommendedView

-(instancetype)init{
  self=[super init];
  if(self){
    [self initData];
    [self setUI];
    [self setupRefresh];
  }
  return self;
}

-(void)initData{
  _data = [NSMutableArray new];
}

-(void)setUI{
  self.backgroundColor = [UIColor redColor];
  UITableView *tableView = [[UITableView alloc]initWithFrame:self.bounds style: UITableViewStylePlain];
  tableView.delegate = self;
  tableView.dataSource = self;
  [tableView registerClass:[RecommendedCell class] forCellReuseIdentifier:ID];
  self.tableview =  tableView;
  [self addSubview:tableView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _tableview.frame = self.bounds;
}

-(void)setupRefresh{
  
}


#define UITableViewDataSource
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
  return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
//  return self.data.count;
  return 20;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
  
//  UITableViewCell* cell = [tableView dequeueReusableCellWithIdentifier:ID];
//  if(cell==nil){
//    cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:ID];
//  }
//  cell.textLabel.text = [NSString stringWithFormat:@"%ld",indexPath.row];
//
  
  RecommendedCell * cell = [tableView dequeueReusableCellWithIdentifier:ID];
  return cell;
}


-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
  JXModel * one6 = [[JXModel alloc] init];
  one6.content = @"2015年国家发布了《中国联网作为中国制造2025的主攻方向，成为中国工业互联网的行动纲领";
  one6.type = 1;
  one6.list = @[[UIImage imageNamed:@"welcome4"]];
  one6.name = @"liuyifei6";
  one6.guanType = 0;

  return [self.tableview cellHeightForIndexPath:indexPath model:one6 keyPath:@"model" cellClass:[RecommendedCell class] contentViewWidth:[self cellContentViewWith]];
}

- (CGFloat)cellContentViewWith
{
  CGFloat width = [UIScreen mainScreen].bounds.size.width;
  
  // 适配ios7横屏
  if ([UIApplication sharedApplication].statusBarOrientation != UIInterfaceOrientationPortrait && [[UIDevice currentDevice].systemVersion floatValue] < 8) {
    width = [UIScreen mainScreen].bounds.size.height;
  }
  return width;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  
}
@end
