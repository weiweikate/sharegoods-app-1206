//
//  TestListBaseView.h
//  JXCategoryView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JXPagerView.h"

@interface TestListBaseView : UIView <JXPagerViewListViewDelegate>

@property(nonatomic, strong)UICollectionView *collectionView;
@property(nonatomic, strong) NSArray <NSString *> *dataSource;
@property(nonatomic, copy)NSString *api;
@property(nonatomic, assign)NSInteger type;//0 我的文章 1我的收藏 2他的文章
@end
