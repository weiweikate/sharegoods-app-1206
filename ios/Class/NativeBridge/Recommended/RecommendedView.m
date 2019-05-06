//
//  RecommendedView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedView.h"
#import "RecommendedCell.h"
#import "RecTypeCell.h"
#import "Model/JXModel.h"
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import  <SDAutoLayout.h>
#import "ShowHeaderView.h"
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "MBProgressHUD+PD.h"
#import <YYKit.h>


@interface RecommendedView()<recTypeCellDelegate,JXCellDelegate,UITableViewDelegate,UITableViewDataSource,UIScrollViewDelegate>
@property (nonatomic, weak)UITableView *tableView;
@property (nonatomic, strong)NSMutableArray* dataSource;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, strong)UIView *headerView;

@end

static NSString *ID = @"tabCell";
static NSString *IDType = @"TypeCell";

@implementation RecommendedView

- (NSMutableArray *)dataSource {
    if (!_dataSource) {
        _dataSource = [NSMutableArray new];
        
      NSArray *data = @[
                       @{
                         @"content": @"上面写到要将控件的布局写在同一个方法中，方便之后查看与修改，但关于布局的选型也是需要精心考虑的，如果直接使用CGRectMake可读性会很差，因为只通过x,y,width,height是不能确定View与View之间的位置关系的。 github上关于iOS布局的第三方也是有很多的，看公司架构而定，个人比较喜欢SDAutoLayout，这个布局库语法简单，功能完善，而且代码可读性很好。上面写到要将控件的布局写在同一个方法中，方便之后查看与修改，但关于布局的选型也是需要精心考虑的，如果直接使用CGRectMake可读性会很差，因为只通过x,y,width,height是不能确定View与View之间的位置关系的。 github上关于iOS布局的第三方也是有很多的，看公司架构而定，个人比较喜欢SDAutoLayout，这个布局库语法简单，功能完善，而且代码可读性很好。上面写到要将控件的布局写在同一个方法中，方便之后查看与修改，但关于布局的选型也是需要精心考虑的，如果直接使用CGRectMake可读性会很差，因为只通过x,y,width,height是不能确定View与View之间的位置关系的。 github上关于iOS布局的第三方也是有很多的，看公司架构而定，个人比较喜欢SDAutoLayout，这个布局库语法简单，功能完善，而且代码可读性很好。上面写到要将控件的布局写在同一个方法中，方便之后查看与修改，但关于布局的选型也是需要精心考虑的，如果直接使用CGRectMake可读性会很差，因为只通过x,y,width,height是不能确定Vie",
                         @"download": @true,
                         @"downloadCount": @45875629,
                         @"like": @true,
                         @"likesCount": @95406802,
                         @"products": @[
                                      @{
                                        @"desc": @"minim est sunt",
                                        @"image": @"ad labore laboris amet",
                                        @"originalPrice": @292226.68,
                                        @"price": @82273.35,
                                        @"productNo": @"id reprehender"
                                      },
                                      @{
                                        @"desc": @"veniam culpa minim",
                                        @"image": @"laborum ullamco ad magna",
                                        @"originalPrice": @63017992.355,
                                        @"price": @67793485.25,
                                        @"productNo": @"nostrud ea esse ipsum voluptate"
                                      }
                                      ],
                         @"share": @false,
                         @"shareCount": @18440885,
                         @"showNo": @"cupida",
                         @"sources": @[
                                     @{
                                       @"type": @37596700,
                                       @"url": @"minim vo"
                                     }
                                     ],
                         @"userInfoVO": @{
                           @"userImg": @"consectetur in",
                           @"userName": @"mollit deserunt velit",
                           @"userNo": @"dolor esse"
                         }
                       },
                       @{
                         @"content": @"aliqua",
                         @"download": @true,
                         @"downloadCount": @45875629,
                         @"like": @true,
                         @"likesCount": @95406802,
                         @"products": @[
                             @{
                               @"desc": @"minim est sunt",
                               @"image": @"ad labore laboris amet",
                               @"originalPrice": @29469036.683377817,
                               @"price": @8778633.35651967,
                               @"productNo": @"id reprehender"
                               },
                             ],
                         @"share": @false,
                         @"shareCount": @18440885,
                         @"showNo": @"cupida",
                         @"sources": @[],
                         @"userInfoVO": @{
                             @"userImg": @"consectetur in",
                             @"userName": @"mollit deserunt velit",
                             @"userNo": @"dolor esse"
                             }
                         },
                       @{
                         @"content": @"non Ut",
                         @"download": @true,
                         @"downloadCount": @24088353,
                         @"like": @true,
                         @"likesCount": @40652343,
                         @"products": @[
                                      @{
                                        @"desc": @"enim Ut Excepteur",
                                        @"image": @"fugiat eiusmod",
                                        @"originalPrice": @88449610.52747275,
                                        @"price": @49476155.883,
                                        @"productNo": @"amet ipsum anim"
                                      }
                                      ],
                         @"share": @false,
                         @"shareCount": @16687859,
                         @"showNo": @"laborum mollit eiusmod commodo",
                         @"sources": @[
                                     @{
                                       @"type": @68119245,
                                       @"url": @"reprehenderit dolore voluptate est"
                                     },
                                     @{
                                       @"type": @388960,
                                       @"url": @"id d"
                                     },
                                     @{
                                       @"type": @48440775,
                                       @"url": @"enim sunt"
                                     }
                                     ],
                         @"userInfoVO": @{
                           @"userImg": @"labore dolor",
                           @"userName": @"consequat ea",
                           @"userNo": @"anim"
                         }
                       },
                       @{
                         @"content": @"Excepteur proident nostrud",
                         @"download": @false,
                         @"downloadCount": @19217467,
                         @"like": @false,
                         @"likesCount": @42450792,
                         @"products": @[
                                      @{
                                        @"desc": @"enim aliquip incididunt ",
                                        @"image": @"ut dolor veniam n",
                                        @"originalPrice": @92351558.78668478,
                                        @"price": @9353697.968925044,
                                        @"productNo": @"Excepteur dolor"
                                      },
                                      @{
                                        @"desc": @"laboris Except",
                                        @"image": @"aliqui",
                                        @"originalPrice": @30996177.457668632,
                                        @"price": @85962604.51718524,
                                        @"productNo": @"Excep"
                                      },
                                      @{
                                        @"desc": @"mollit Lorem eiusmod culpa",
                                        @"image": @"dolor occaecat veniam",
                                        @"originalPrice": @93153748.4623023,
                                        @"price": @7297523.034078687,
                                        @"productNo": @"i"
                                      }
                                      ],
                         @"share": @false,
                         @"shareCount": @81808357,
                         @"showNo": @"incididunt dolore nisi in",
                         @"sources": @[
                                     @{
                                       @"type": @46495839,
                                       @"url": @"velit eu in et sed"
                                     },
                                     @{
                                       @"type": @52817453,
                                       @"url": @"nulla ea"
                                     }
                                     ],
                         @"userInfoVO": @{
                           @"userImg": @"exercitation veniam cillum ad",
                           @"userName": @"irure in pariatur",
                           @"userNo": @"irure ipsum eiu"
                         }
                         },@{
                         @"content": @"Excepteur proident nostrud",
                         @"download": @false,
                         @"downloadCount": @19217467,
                         @"like": @false,
                         @"likesCount": @42450792,
                         @"products": @[
                             @{
                               @"desc": @"enim aliquip incididunt ",
                               @"image": @"ut dolor veniam n",
                               @"originalPrice": @92351558.78668478,
                               @"price": @9353697.968925044,
                               @"productNo": @"Excepteur dolor"
                               },
                             @{
                               @"desc": @"laboris Except",
                               @"image": @"aliqui",
                               @"originalPrice": @30996177.457668632,
                               @"price": @85962604.51718524,
                               @"productNo": @"Excep"
                               },
                             @{
                               @"desc": @"mollit Lorem eiusmod culpa",
                               @"image": @"dolor occaecat veniam",
                               @"originalPrice": @93153748.4623023,
                               @"price": @7297523.034078687,
                               @"productNo": @"i"
                               }
                             ],
                         @"share": @false,
                         @"shareCount": @81808357,
                         @"showNo": @"incididunt dolore nisi in",
                         @"sources": @[
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               }
                             ],
                         @"userInfoVO": @{
                             @"userImg": @"exercitation veniam cillum ad",
                             @"userName": @"irure in pariatur",
                             @"userNo": @"irure ipsum eiu"
                             }
                         },@{
                         @"content": @"Excepteur proident nostrud",
                         @"download": @false,
                         @"downloadCount": @19217467,
                         @"like": @false,
                         @"likesCount": @42450792,
                         @"products": @[
                             @{
                               @"desc": @"enim aliquip incididunt ",
                               @"image": @"ut dolor veniam n",
                               @"originalPrice": @92351558.78668478,
                               @"price": @9353697.968925044,
                               @"productNo": @"Excepteur dolor"
                               },
                             @{
                               @"desc": @"laboris Except",
                               @"image": @"aliqui",
                               @"originalPrice": @30996177.457668632,
                               @"price": @85962604.51718524,
                               @"productNo": @"Excep"
                               },
                             @{
                               @"desc": @"mollit Lorem eiusmod culpa",
                               @"image": @"dolor occaecat veniam",
                               @"originalPrice": @93153748.4623023,
                               @"price": @7297523.034078687,
                               @"productNo": @"i"
                               }
                             ],
                         @"share": @false,
                         @"shareCount": @81808357,
                         @"showNo": @"incididunt dolore nisi in",
                         @"sources": @[
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             ],
                         @"userInfoVO": @{
                             @"userImg": @"exercitation veniam cillum ad",
                             @"userName": @"irure in pariatur",
                             @"userNo": @"irure ipsum eiu"
                             }
                         },@{
                         @"content": @"Excepteur proident nostrud",
                         @"download": @false,
                         @"downloadCount": @19217467,
                         @"like": @false,
                         @"likesCount": @42450792,
                         @"products": @[
                             @{
                               @"desc": @"enim aliquip incididunt ",
                               @"image": @"ut dolor veniam n",
                               @"originalPrice": @92351558.78668478,
                               @"price": @9353697.968925044,
                               @"productNo": @"Excepteur dolor"
                               },
                             @{
                               @"desc": @"laboris Except",
                               @"image": @"aliqui",
                               @"originalPrice": @30996177.457668632,
                               @"price": @85962604.51718524,
                               @"productNo": @"Excep"
                               },
                             @{
                               @"desc": @"mollit Lorem eiusmod culpa",
                               @"image": @"dolor occaecat veniam",
                               @"originalPrice": @93153748.4623023,
                               @"price": @7297523.034078687,
                               @"productNo": @"i"
                               }
                             ],
                         @"share": @false,
                         @"shareCount": @81808357,
                         @"showNo": @"incididunt dolore nisi in",
                         @"sources": @[
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @52817453,
                               @"url": @"nulla ea"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             @{
                               @"type": @46495839,
                               @"url": @"velit eu in et sed"
                               },
                             ],
                         @"userInfoVO": @{
                             @"userImg": @"exercitation veniam cillum ad",
                             @"userName": @"irure in pariatur",
                             @"userNo": @"irure ipsum eiu"
                             }
                         }
                       ];
        
        
        for (int i=0; i<[data count]; i++) {
            NSDictionary *diction=[data objectAtIndex:i];
            JXModel * model = [JXModel modelWithJSON:diction];
            [_dataSource addObject:model];
        }
    }
    return _dataSource;
}


-(instancetype)init{
  self=[super init];
  if(self){
    [self setUI];
    [self setupRefresh];
  }
  return self;
}

-(void)setUI{
  self.backgroundColor = [UIColor redColor];
  UITableView *tableView = [[UITableView alloc]initWithFrame:self.bounds style: UITableViewStylePlain];
  tableView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
  tableView.delegate = self;
  tableView.dataSource = self;
  [tableView registerClass:[RecommendedCell class] forCellReuseIdentifier:ID];
  [tableView registerClass:[RecTypeCell class] forCellReuseIdentifier:IDType];
    self.tableView =  tableView;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;//推荐该方法
    self.tableView.estimatedRowHeight = 0;
    self.tableView.estimatedSectionHeaderHeight = 0;
    self.tableView.estimatedSectionFooterHeight = 0;
    [self addSubview:tableView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _tableView.frame = self.bounds;
}

/**
 * 刷新控件
 */
- (void)setupRefresh{
  
  MJRefreshNormalHeader *header = [MJRefreshNormalHeader headerWithRefreshingTarget:self refreshingAction:@selector(refreshData)];
  [header setTitle:@"下拉刷新" forState:MJRefreshStateIdle];
  [header setTitle:@"松开刷新" forState:MJRefreshStatePulling];
  [header setTitle:@"正在刷新 ..." forState:MJRefreshStateRefreshing];
  header.lastUpdatedTimeLabel.hidden = YES;
  header.stateLabel.font = [UIFont systemFontOfSize:11];
  header.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  self.tableView.mj_header = header;
  [self.tableView.mj_header beginRefreshing];
  
  MJRefreshAutoNormalFooter *footer = [MJRefreshAutoNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(getMoreData)];
  footer.triggerAutomaticallyRefreshPercent = -5;
  [footer setTitle:@"上拉加载" forState:MJRefreshStateIdle];
  [footer setTitle:@"正在加载 ..." forState:MJRefreshStateRefreshing];
  [footer setTitle:@"我也是有底线" forState:MJRefreshStateNoMoreData];
  footer.stateLabel.font = [UIFont systemFontOfSize:11];
  footer.stateLabel.textColor = [UIColor colorWithRed:144/255.f green:144/255.f blue:144/255.f alpha:1.0f];
  
  self.tableView.mj_footer = footer;
  self.tableView.mj_footer.hidden = YES;
}

/**
 刷新数据
 */
- (void)refreshData
{
  if (self.onStartRefresh) {
    self.onStartRefresh(@{});
  }
  self.page = 1;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"}];
//  __weak ShowGroundView * weakSelf = self;
//  [NetWorkTool requestWithURL:self.uri params:dic  toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
//    weakSelf.dataArr = [result.data mutableCopy];
    [self.tableView.mj_header endRefreshing];
    if(YES){
      [self.tableView.mj_footer endRefreshingWithNoMoreData];
    }else{
      [self.tableView.mj_footer resetNoMoreData];
    }
    [self.tableView reloadData];
//    if (weakSelf.collectionView.mj_footer.hidden) {
//      //延迟0.5秒，防止第一次在刷新成功过程中在顶部出现footer《加载更多》
//      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.tableView.mj_footer.hidden = NO;
//      });
//    }
//  } failure:^(NSString *msg, NSInteger code) {
//    [MBProgressHUD showSuccess:msg];
//    [weakSelf.collectionView.mj_header endRefreshing];
//  } showLoading:nil];
}

/**
 加载更多数据
 */
- (void)getMoreData
{
  self.page++;
  NSMutableDictionary *dic = [NSMutableDictionary new];
  if (self.params) {
    dic = [self.params mutableCopy];
  }
  [dic addEntriesFromDictionary:@{@"page": [NSString stringWithFormat:@"%ld",self.page], @"size": @"10"}];
  __weak  RecommendedView * weakSelf = self;
//  [NetWorkTool requestWithURL:self.uri params:dic toModel:[ShowQueryModel class] success:^(ShowQueryModel* result) {
//    [weakSelf.dataArr addObjectsFromArray:result.data];
//    [weakSelf.collectionView reloadData];
//    //    [weakSelf.collectionView.collectionViewLayout invalidateLayout];
//    if(result.data.count < 10){
//      [weakSelf.collectionView.mj_footer endRefreshingWithNoMoreData];
//    }else{
//      [weakSelf.collectionView.mj_footer endRefreshing];
//    }
//  } failure:^(NSString *msg, NSInteger code) {
//    [MBProgressHUD showSuccess:msg];
//    [weakSelf.collectionView.mj_footer endRefreshing];
//  } showLoading:nil];
}



#define UITableViewDataSource
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
  return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
//  return self.data.count;
  return self.dataSource.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
  
//  UITableViewCell* cell = [tableView dequeueReusableCellWithIdentifier:ID];
//  if(cell==nil){
//    cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:ID];
//  }
//  cell.textLabel.text = [NSString stringWithFormat:@"%ld",indexPath.row];
//
  
  if(indexPath.row==1){
    RecTypeCell * cell = [tableView dequeueReusableCellWithIdentifier:IDType];
    cell.model = [self.dataSource objectAtIndex:indexPath.row];
    cell.recTypeDelegate = self;
    cell.clipsToBounds = YES;
    return cell;
    
  }
  RecommendedCell * cell = [tableView dequeueReusableCellWithIdentifier:ID];
  cell.model = [self.dataSource objectAtIndex:indexPath.row];
  cell.cellDelegate = self;
  cell.clipsToBounds = YES;
  return cell;
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    /* model 为模型实例， keyPath为 model的属性名，通过 kvc统一赋值接口 */
    // keypath:比如你要显示的是str,str对应的model的属性是text（model属性名）
  if(indexPath.row==1){
    return [self.tableView cellHeightForIndexPath:indexPath model:_dataSource[indexPath.row] keyPath:@"model" cellClass:[RecTypeCell class] contentViewWidth: self.frame.size.width];
  }
    return [self.tableView cellHeightForIndexPath:indexPath model:_dataSource[indexPath.row] keyPath:@"model" cellClass:[RecommendedCell class] contentViewWidth: self.frame.size.width];
}

#pragma mark - 按钮点击代理
/**
 *  折叠按钮点击代理
 *
 *  @param cell 按钮所属cell
 */

-(void)clickFoldLabel:(RecommendedCell*)cell{
    NSIndexPath * indexPath = [self.tableView indexPathForCell:cell];
    JXModel *model = self.dataSource[indexPath.row];
    
    model.isOpening = !model.isOpening;
    [self.tableView beginUpdates];
    [self.tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
}

-(void)imageClick:(RecommendedCell *)cell{
  NSLog(@"delegate 1");
}

-(void)zanClick:(RecommendedCell *)cell{
NSLog(@"delegate 2");
}

-(void)downloadClick:(RecommendedCell *)cell{
  NSLog(@"delegate 3");
}

-(void)shareClick:(RecommendedCell *)cell{
  NSLog(@"delegate 4");
}

- (void)didUpdateReactSubviews {
  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:[ShowHeaderView class]]) {
      self.tableView.tableHeaderView = view;
      [self.tableView reloadData];
    }
  }
}

-(void)clickLabel:(RecTypeCell *)cell{
  
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  
}
@end
