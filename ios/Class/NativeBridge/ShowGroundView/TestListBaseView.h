//
//  TestListBaseView.h
//  JXCategoryView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JXPagerView.h"
#import <React/RCTView.h>

@interface TestListBaseView : UIView <JXPagerViewListViewDelegate>

@property(nonatomic, strong)UICollectionView *collectionView;
@property(nonatomic, strong) NSArray <NSString *> *dataSource;
@property(nonatomic, copy)NSString *api;
@property(nonatomic, copy)NSDictionary *params;
@property(nonatomic, assign)NSInteger type;//0 我的文章 1我的收藏 2他的文章
@property (nonatomic, copy) RCTBubblingEventBlock onPersonItemPress;
@property (nonatomic, copy) RCTBubblingEventBlock onPersonCollection;
@property (nonatomic, copy) RCTBubblingEventBlock onPersonPublish;

- (void)refreshData;
@end
